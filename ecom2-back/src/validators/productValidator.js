


const productValidator = (name, unit,thumbnail,price) => {
    error = {}
    
    if(!name){
        error.name ='Please provide product name'
    }
  

    if(!unit){
        error.unit = 'Please provide a unit name (e.g. Pc,KG)'
    }
    if(!thumbnail){
        error.thumbnail = 'Please provide a thumbnail image'
    }
    if(!price){
        error.price = 'Please provide  price'
    }
   

    return {
        error,
        isError : Object.keys(error).length == 0
    }
}

module.exports = productValidator