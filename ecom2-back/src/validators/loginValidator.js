const validator = require('validator');
const loginValidator = (email, password) => {
    error = {}

    
    if(!email){
        error.email ='Please provide your email address'
    }else if(!validator.isEmail(email)){
        error.email ='Invalid email address'
    }

    if (!password) {
        error.password = 'Please provide a password'
    }

    return {
        error,
        isError: Object.keys(error).length == 0
    }
}

module.exports = loginValidator