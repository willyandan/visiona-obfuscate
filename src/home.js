const ProductList = require('./product-list')
const Api = require('./api')
const estoque = ProductList()
const carrinho = ProductList()
const api = Api()
/**
 * @type {ReturnType<Product>}
 */

async function loadProducts(){
    const db = await api.getProducts()
    estoque.loadProducts({db})
}

/**
 *
 * @param {{product: ReturnType<Product>}} param0
 */
function makeRow({product}){
    const row = document.createElement('tr')

    const codigo = document.createElement('td')
    codigo.innerHTML = product.getId()

    const nome = document.createElement('td')
    nome.innerHTML = product.getNome()

    const marca = document.createElement('td')
    marca.innerHTML = product.getMarca()


    const preco = document.createElement('td')
    preco.innerHTML = `R$ ${parseFloat(product.getPreco()).toFixed(2)}`
    preco.classList.add('has-text-right')

    const quantidade = document.createElement('td')
    quantidade.innerHTML = parseFloat(product.getQuantidade()).toFixed(3)
    quantidade.classList.add('has-text-right')

    const total = document.createElement('td')
    total.innerHTML = product.getQuantidade() * product.getPreco()
    total.classList.add('has-text-right')

    const buttons = document.createElement('td')
    buttons.innerHTML = `<button class="button is-danger" data-id='${product.getId()}' onclick='removeProduct(this)'>
    <span class="icon is-small">
      <i class="fas fa-times"></i>
    </span>
    </button>`
    row.appendChild(codigo)
    row.appendChild(nome)
    row.appendChild(marca)
    row.appendChild(preco)
    row.appendChild(quantidade)
    row.appendChild(total)
    row.appendChild(buttons)
    return row
}

/**
 *
 * @param {{products:Array<ReturnType<Product>}} param0
 */
function renderTable({products}){
    document.getElementById('tbody').innerHTML = null
    products.map((prod)=>{
       return makeRow({product:prod})
    }).forEach((row)=>{
        const tableBody = document.getElementById('tbody')
        tableBody.appendChild(row)
    })
}

/**
 *
 * @param {{total:number}} param0
 */
function renderTotal({total}){
    document.getElementById('total-compra').innerHTML = total.toFixed(2)
}

function updateView(){
    renderTable({products: carrinho.getProducts()})
    renderTotal({total: carrinho.calculateTotal()})
}

function openSearchProductModal(){
    document.getElementById("sp-cod").innerHTML = null
    document.getElementById("search-product-input").value = null
    document.getElementById("sp-nome").innerHTML = null
    document.getElementById("sp-marca").innerHTML = null
    document.getElementById("sp-unidade").innerHTML = null
    document.getElementById("sp-preco").innerHTML = (0.0).toFixed(2)
    document.getElementById("sp-total").innerHTML = (0.0).toFixed(2)
    const qtd = document.getElementById("sp-qtd").value = 0
    openModal('modalSearchProduct')
}

/**
 *
 * @param {Element} el
 */
function removeProduct(el){
    const id = el.getAttribute('data-id')
    const prod = carrinho.getProducts().find((p)=>p.getId() == id)
    carrinho.removeProduct({product:prod})
    updateView()
}

/**
 *
 * @param {{codigo:!string}} param0
 */
function searchProduct({codigo}){
    const product = estoque.getProducts().find((prod)=>codigo == prod.getId())
    if(!product){
        Swal.fire('Oops','Produto não encontrado')
        return
    }
    document.getElementById("sp-cod").innerHTML = product.getId()
    document.getElementById("sp-nome").innerHTML = product.getNome()
    document.getElementById("sp-marca").innerHTML = product.getMarca()
    document.getElementById("sp-unidade").innerHTML = product.getUnidade()
    document.getElementById("sp-preco").innerHTML = product.getPreco()
    document.getElementById("sp-total").innerHTML = (0.0).toFixed(2)
    document.getElementById("sp-qtd").value = 0

    document.getElementById("sp-qtd").addEventListener('keyup',()=>{
        const qtd = document.getElementById("sp-qtd").value
        if(qtd > product.getQuantidade()){
            Swal.fire('Atenção','Não temos essa quantidade disponivel','error')
            return
        }
        const total = product.getPreco() * qtd
        document.getElementById("sp-total").innerHTML = total.toFixed(2)
    })

    const addProd = function(){
        let qtd = parseInt(document.getElementById("sp-qtd").value)
        let prod = carrinho.getProducts().find((p)=>p.getId() == codigo)
        let inCart = true
        if(!prod){
            inCart = false
            prod = Product({
                id:product.getId(),
                marca:product.getMarca(),
                nome:product.getNome(),
                preco:product.getPreco(),
                unidade:product.getUnidade(),
                quantidade: 0
            })
        }
        qtd += prod.getQuantidade()

        if(qtd > product.getQuantidade()){
            Swal.fire('Atenção','Não temos essa quantidade disponivel','error')
            return
        }
        prod.setQuantidade({newQtd: qtd})
        if(!inCart){
            carrinho.addProduct({product: prod})
        }
        document.getElementById("btn-add-item").removeEventListener('click', addProd)
        updateView()
        closeModal('modalSearchProduct')
    }
    document.getElementById("btn-add-item").addEventListener('click', addProd)

}

function openModal(id){
    const element = document.getElementById(id)
    element.classList.add('is-active')
}

function closeModal(id){
    const element = document.getElementById(id)
    element.classList.remove('is-active')

}

loadProducts()

document.getElementById("search-product").addEventListener('click',(e)=>{
    e.preventDefault()
    const codigo = document.getElementById("search-product-input").value
    searchProduct({codigo})
})

document.getElementById('finalizar-compra').addEventListener('click', async (e)=>{
    try {
        const ids = carrinho.getProducts().map((p)=>p.getId())
        const qtds = carrinho.getProducts().map((p)=>p.getQuantidade())
        const res = await api.realizarCompra({
            ids,
            qtds
        })
        const data = {ids, qtds}
        const formData = Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');

        const url = 'carrinho?'+formData
        console.log(url)
        window.location.href = url
    } catch (error) {
        console.log('ERROR', error)
        if(error.status && error.status == 500){
            const p = carrinho.getProducts().find((prod)=> prod.getId() == error.error.product)
            Swal.fire('Atenção',`O produto ${p.getNome()} nao tem essa quantidade disponivel`, 'error')
        }
    }
})