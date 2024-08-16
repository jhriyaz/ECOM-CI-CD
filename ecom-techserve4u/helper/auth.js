import React, { Component } from "react";

import Cookies from "js-cookie";
import axios from "axios";
import { SpinnerCircularFixed } from 'spinners-react';
import { fetchCategories, fetchBrands, fetchAddresses } from '../actions/generalActions'

//import {setToast} from './ToastMsg'
import store from "../store";

const configureAxiosHeader = () => {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL
  const token = Cookies.get("myshop_auth2");
  if (token) {
    axios.defaults.headers.common = {
      Authorization: token,
    };
  }

};








const AuthAndAxiso = (AuthComponent) => {
  return class Authenticated extends Component {
    static async getInitialProps(ctx) {
      // Ensures material-ui renders the correct css prefixes server-side
      let userAgent;
      // eslint-disable-next-line no-undef
      if (process.browser) {
        // eslint-disable-next-line prefer-destructuring
        userAgent = navigator.userAgent;
      } else {
        userAgent = ctx.req?.headers["user-agent"];
      }

      // Check if Page has a `getInitialProps`; if so, call it.
      const pageProps =
        AuthComponent.getInitialProps &&
        (await AuthComponent.getInitialProps(ctx));
      // Return props.
      return { ...pageProps, userAgent };
    }

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        userData: [],
      };
    }

    componentDidMount() {

      configureAxiosHeader();
      store.dispatch(fetchCategories())
      store.dispatch(fetchBrands())


      const token = Cookies.get("myshop_auth2")
      //console.log(token);
      if (token) {
        this.setState({ isLoading: true });
        axios
          // eslint-disable-next-line no-undef
          .post(`${process.env.NEXT_PUBLIC_API_URL}/user/verify`, {})
          .then((res) => {
            if (res.status === 200 && res.data.success) {
              //do some change state
              store.dispatch(fetchAddresses())
              this.setState({ userData: res.data.user });
              this.setState({ isLoading: false });
              store.dispatch({
                type: "SET_USER",
                payload: res.data.user
              })

            }
          })
          .catch((err) => {
            this.setState({ isLoading: false });
            err && err.response && console.log(err.response.data.error, "error")
            Cookies.remove("myshop_auth2");
            err && err.response.data && err.response.data.error && alert(err.response.data.error)
            store.dispatch({
              type: "LOGOUT"
            })
            //console.log(window.location.pathname)
            //   if(window.location.pathname !== '/login'){
            //     window.location.pathname='/login'
            //   }
            //window.location.pathname='/login'
          });
      }

    }

    render() {
      return (
        <div>
          {this.state.isLoading ? (
            <div style={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <SpinnerCircularFixed style={{ margin: "0 auto" }} size={100} thickness={160} speed={100} color="#36D7B7" secondaryColor="rgba(0, 0, 0, .05)" />
            </div>
          ) : (
            <AuthComponent {...this.props} userData={this.state.userData} />
          )}
        </div>
      );
    }
  };
};
export default AuthAndAxiso;
