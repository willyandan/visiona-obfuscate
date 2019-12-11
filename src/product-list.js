/**
 * @typedef {{id: !number, nome: !string, marca:!string, unidade: !string, preco:!number, quantidade:!number}} ProductInput
 * @param {ProductInput} param0
 *
 */
function Product({id, nome, marca, unidade, preco, quantidade} = {}){

  function validateInput(){
      if(!id) throw new Error("id not provided")
      if(!nome) throw new Error("nome undefined")
      if(!marca) throw new Error("marca undefined")
      if(!unidade) throw new Error("unidade undefined")
      if(!preco) throw new Error("preco undefined")
      if(quantidade === undefined) throw new Error("preco undefined")
  }

  //GETTERS

  function getId(){
      return id
  }

  function getNome () {
      return nome
  }

  function getMarca(){
      return marca
  }

  function getUnidade(){
      return unidade
  }

  function getPreco(){
      return preco
  }

  function getQuantidade(){
      return quantidade
  }

  //SETTERS
  function setNome ({newNome}) {
      nome = newNome
      return this
  }

  function setMarca({newMarca}){
      marca = newMarca
      return this
  }

  function setUnidade({newUnidade}){
      unidade = newUnidade
      return this
  }

  function setPreco({newPreco}){
      preco = parseFloat(newPreco)
      return this
  }

  function setQuantidade({newQtd}){
      quantidade = parseFloat(newQtd)
      return this
  }


  validateInput()

  return Object.freeze({
      getId,
      getNome,
      getMarca,
      getUnidade,
      getPreco,
      getQuantidade,
      setNome,
      setMarca,
      setUnidade,
      setPreco,
      setQuantidade
  })
}

function ProductList(){
  /**
   * @type {Array<ReturnType<Product>>}
   */
  let products = []
  let instance = this
  function validateInput({db} = {}){
      if(db == undefined) throw new Error("db is undefined")
      if(!Array.isArray(db)) throw new Error("db must be an array")
  }

  function loadProducts({db} = {}){
      validateInput({db})
      for(let product of db){
          products.push(Product(product))
      }
      return instance
  }

  /**
   *
   * @param {{product: ReturnType<Product>}} param0
   */
  function addProduct({product} = {}){
      if(!product) throw new Error("product not provided")
      products.push(product)
      return instance
  }

  function getProducts(){
      return products
  }

  /**
   *
   * @param {{product:ReturnType<Product>}} param0
   */
  function removeProduct({product}={}){
      if(!product) throw new Error("product not provided")
      const idx = product.getId()
      products = products.filter((val, i) => val.getId() != idx)
      return instance
  }

  /**
   *
   * @param {{id:number, product: ProductInput}} param0
   */
  function updateProduct({id, product}={}){
      const prod = Product(product)
      for(let [idx, p] of products.entries()){
          if(p.getId() == id){
              products[idx] = prod
          }
      }
      return instance
  }

  function calculateTotal(){
      let total = 0
      for(let product of products){
          total += product.getPreco() * product.getQuantidade()
      }
      return total
  }
  return Object.freeze({
      loadProducts,
      addProduct,
      getProducts,
      calculateTotal,
      removeProduct,
      updateProduct
  })
}