import {combineReducers} from 'redux'
import authReducers from './authReducer'
import cartReducer from './cartReducer'
import generalData from './generalData'

const rootReducer = combineReducers({
    auth: authReducers,
    cart: cartReducer,
    general:generalData
})

export default rootReducer