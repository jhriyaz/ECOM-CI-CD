
import axios from 'axios'
import ReactGA from 'react-ga';


export const config = () => {
  axios.get(process.env.NEXT_PUBLIC_API_URL + '/settings/initialdata')
    .then(res => {
      let crisp = res.data.liveChat.crisp
      let analytics = res.data.analytics


      if (crisp.isEnable) {
        let scriptTag = document.createElement('script')
        scriptTag.innerHTML = ` window.$crisp=[];window.CRISP_WEBSITE_ID="${crisp.websiteId}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`
        document.body.appendChild(scriptTag)
      }


      if (analytics.ga && analytics.ga.isActive) {
        ReactGA.initialize(analytics.ga.id);
        ReactGA.pageview(window.location.pathname + window.location.search);
      }
      if (analytics.pixel && analytics.pixel.isActive) {
        const ReactPixel = require('react-facebook-pixel');
        ReactPixel.default.init(analytics.pixel.id);
      }

    })
    .catch(err => {
      console.log(err);
    })

}



export const fetchCategories = () => {
  return (dispatch) => {
    axios.get(process.env.NEXT_PUBLIC_API_URL + '/category/getcategory')
      .then(res => {
        dispatch({
          type: "SET_CATEGORIES",
          payload: res.data.categories
        })
      })
      .catch(err => {
        console.log(err);
      })

  };

}

export const fetchBrands = () => {
  return (dispatch) => {
    axios.get(process.env.NEXT_PUBLIC_API_URL + '/brand/get')
      .then(res => {
        dispatch({
          type: "SET_BRANDS",
          payload: res.data.brands
        })
      })
      .catch(err => {
        console.log(err);
      })

  };
}


export const getNotifications = () => {
  return (dispatch) => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notification/mynotification`)
      .then(res => {
        dispatch({
          type: "SET_NOTIFICATIONS",
          payload: res.data.notifications
        })
      })
      .catch(err => {
        console.log(err);
      })

  };
};


export const fetchAddresses = () => {
  return (dispatch) => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/address/getaddress`)
      .then(res => {
        dispatch({
          type: "SET_ADDRESSES",
          payload: res.data.addresses
        })
      })
      .catch(err => {
        console.log(err);
      })

  };
}
