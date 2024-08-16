import React, { Component } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import Cookies from "js-cookie";
import axios from "axios";
//import {setToast} from './ToastMsg'
import store from "../store";
import {connect} from 'react-redux'



const WithAuth = (AuthComponent) => {
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
     
      
        this.setState({ isLoading: true });
      const token = Cookies.get("myshop_auth2")
     
      
      if(!token){
          window.location.href='/'
        
      }else{
        return  this.setState({ isLoading: false });
      }
     
      
    }

    render() {
      return (
        <div>
          {this.state.isLoading ? (
            <div style={{height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <CircularProgress color="primary" />
            </div>
          ) : (
            <AuthComponent {...this.props} userData={this.state.userData} />
          )}
        </div>
      );
    }
  };
};
export default WithAuth;
