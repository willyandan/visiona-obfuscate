function Api(){
  /**
   * @constant URL
   */
  const URL = '/projeto/api'


  function doPost({url, data}){

      return new Promise((resolve, reject)=>{
          var xmlDoc = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
          xmlDoc.open('POST', url, true);
          xmlDoc.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

          xmlDoc.onreadystatechange = function(val) {
              if (xmlDoc.readyState === 4 && xmlDoc.status === 200) {
                  console.log(xmlDoc.responseText)
                  resolve(JSON.parse(xmlDoc.responseText))
              }
          }
          const formData = Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
          xmlDoc.send(formData);
      })
  }

  async function getProducts(){
      try {
          const response = await fetch(`${URL}/product`,{
              method:'get',
          })
          return response.json()
      } catch (error) {
          return []
      }
  }


  async function createProduct({nome, marca, unidade, preco, id, quantidade} = {}){
      try {
          const response = await doPost({
              url:`${URL}/product`,
              data:{nome, marca, unidade, preco, id, quantidade}
          })
          return response
      } catch (error) {
          throw error
      }
  }

  async function updateProduct({nome, marca, unidade, preco, id, quantidade} = {}){
      try {
          const response = await doPost({
              url:`${URL}/update-product`,
              data:{nome, marca, unidade, preco, id, quantidade}
          })
          return response
      } catch (error) {
          throw error
      }
  }

  async function removeProduct({id} = {}){
      try {
          const response = await doPost({
              url:`${URL}/remove-product`,
              data:{id}
          })
          return response
      } catch (error) {
          throw error
      }
  }

  /**
   *
   * @param {{ids:Array<number>, qtds:Array<number>}} param0
   */
  async function realizarCompra({ids,qtds}){
      try {
          const response = await doPost({
              url: `${URL}/finsish-buy`,
              data:{ids, qtds}
          })
          console.log(response)
          if(response.status != 200){
              throw response
          }
          return response
      } catch (error) {
          throw error
      }
  }

  return Object.freeze({
      getProducts,
      updateProduct,
      createProduct,
      removeProduct,
      realizarCompra
  })
}
