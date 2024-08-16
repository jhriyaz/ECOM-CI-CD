var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
var zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;

const addressValidator = ( name,mobileNumber,state,city,zip,address) => {
    error = {}

    if(!name){
        error.name = "Please enter your name"
    }
    if(!mobileNumber){
        error.mobileNumber ='Please provide your mobile number'
    }
    // else if(!phoneNumberPattern.test(mobileNumber)){
    //     error.mobileNumber ='Invalid number'
    // }
    
    if (!state) {
        error.state = 'Please select a state'
    }
    if (!city) {
        error.city = 'Please enter your city'
    }
    if (!zip) {
        error.zip = 'Please enter your zip code'
    }else if(!zipCodePattern.test(zip)){
        error.zip = 'Invalid zip code'
    }
    if (!address) {
        error.address = 'Please provide your address'
    }

    return {
        error,
        isError: Object.keys(error).length == 0
    }
}

module.exports = addressValidator