const validator = require('validator');

const registerValidator = (name, email, password) => {
    error = {}
    
    if(!name){
        error.name ='Please provide your name'
    }
  

    if(!email){
        error.email ='Please provide your email address'
    }else if(!validator.isEmail(email)){
        
        error.email ='Invalid email address'
    }

    if(!password){
        error.password = 'Please provide a password'
    }else if(password.length < 6){
        error.password = 'password should not be less then six'
    }
   

    return {
        error,
        isError : Object.keys(error).length == 0
    }
}

module.exports = registerValidator