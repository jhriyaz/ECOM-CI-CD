import store from "../store";
import axios from 'axios'


export const addToCart = (product, newQty) => {
  //console.log(newQty);
    return async (dispatch) => {
      const {
        cart: { cartItems },
      } = store.getState();
      //console.log('action::products', products);
      //const product = action.payload.product;
      //const products = state.products;
      const qty = cartItems[product.productId]
        ? parseInt(cartItems[product.productId].qty + newQty)
        : newQty;
      cartItems[product.productId] = {
       ...product,
        qty,
      };
  
        localStorage.setItem("cart", JSON.stringify(cartItems));
      
  
      //console.log("addToCart::", cartItems);
  //console.log(cartItems);
      dispatch({
        type: "ADD_TO_CART",
        payload: { cartItems },
      });
    };
  };


  const getFiltered=async (cartItems,errorIds,checks)=>{
    let newcart = {}


    Object.keys(cartItems).map((key)=>{
      if(errorIds.includes(key)){
        let matchederror = checks.filter(c=>c._id === key)[0]
        newcart[key] = {...cartItems[key],isAvailable:false,error:matchederror.message}
      }else{
        newcart[key] = {...cartItems[key],isAvailable:true,error:""}
      }
    })
    return newcart
  }


  export const updateCart = () => {
    return async (dispatch) => {
      const { auth } = store.getState();
      let cartItems = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : null;
  
    
  
   
        if (cartItems) {
          let items = Object.keys(cartItems).map((key) => ({
            thumbnail: cartItems[key].thumbnail,
            productSlug: cartItems[key].slug,
            productName: cartItems[key].name,
            payablePrice: cartItems[key].price,
            purchasedQty: cartItems[key].qty,
            variations: cartItems[key].attributes,
            campaign: cartItems[key].campaign,
            productId: cartItems[key].productId
        }))


        axios.post( process.env.NEXT_PUBLIC_API_URL+"/order/checkCartProducts",{items})
        .then(async res=>{
            //console.log(res.data.check);
            let checks =res.data.check.filter(check=>check.success == false)
            if(checks.length>0){
              let errorIds = []
              checks.map(c=>{
                errorIds.push(c._id)
              })

              let newCart = await getFiltered(cartItems,errorIds,checks)
              //console.log(newCart);
            
                dispatch({
                  type: "ADD_TO_CART",
                  payload: { cartItems:newCart },
                });
              

            }else{
              dispatch({
                type: "ADD_TO_CART",
                payload: { cartItems },
              });
            }
        })

          // dispatch({
          //   type:"ADD_TO_CART",
          //   payload: { cartItems },
          // });
        }
      
    };
  };


  export const removeCartItem = (payload) => {
    return async (dispatch) => {
      const { auth } = store.getState();
      let cartItems = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : null;

        let newCart={}
        Object.keys(cartItems).map((key, index)=>{
          //console.log(cartItems[key]._id === payload);
          if(cartItems[key].productId === payload)return
          newCart[cartItems[key].productId] = cartItems[key]
         // console.log( newCart);
        })

        
        //console.log(newCart);
        if (newCart) {
          localStorage.setItem("cart", JSON.stringify(newCart));
          dispatch({
            type: "ADD_TO_CART",
            payload: { cartItems:newCart} ,
          });
        }
        
    };
  };


