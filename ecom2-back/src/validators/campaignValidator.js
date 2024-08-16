const campaignValidator = (name, startAt,endAt) => {
    error = {}
    
    if(!name){
        error.name ='Please provide campaign name'
    }
  

    if(!startAt){
        error.startAt = 'Please provide start time'
    }
    if(!endAt){
        error.endAt = 'Please provide end time'
    }
   

    return {
        error,
        isError : Object.keys(error).length == 0
    }
}

module.exports = campaignValidator