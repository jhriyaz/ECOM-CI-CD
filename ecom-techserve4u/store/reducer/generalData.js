
let init ={
    addresses:[],
    categories:[],
    brands:[],
    notifications: []
}

const generalData = (state=init, action)=>{
    switch (action.type) {
        case "SET_ADDRESSES":
       return{
           ...state,
           addresses:action.payload
        }
        case "ADD_NEW_ADDRESSES":
       return{
           ...state,
           addresses:[action.payload,...state.addresses]
        }
        case "SET_CATEGORIES":
       return{
           ...state,
           categories:action.payload
        }
        case "SET_BRANDS":
       return{
           ...state,
           brands:action.payload
        }
        case "SET_NOTIFICATIONS":
            return {
                ...state,
                notifications: action.payload,
            }
        case "UPDATE_NOTIFICATION":
            let array = [...state.notifications]
            let index = array.findIndex(n => n._id === action.payload._id)
            array[index] = action.payload
            return {
                ...state,
                notifications: array,
            }
        default:
            return state;
    }
}

export default generalData