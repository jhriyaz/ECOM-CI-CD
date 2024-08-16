
let init = {
    open: false,
    cartItems: {}

}

const cartReducer = (state = init, action) => {
    switch (action.type) {
        case "CART_OPEN":
            return {
                ...state,
                open: true,
            }
        case 'CART_CLOSE':
            return {
                ...state,
                open: false,
            }
        case 'ADD_TO_CART':
            return {
                ...state,
                cartItems:action.payload.cartItems,
            }
        case 'RESET_CART':
            return {
                ...state,
                cartItems:{},
            }

        default:
            return state;
    }
}

export default cartReducer