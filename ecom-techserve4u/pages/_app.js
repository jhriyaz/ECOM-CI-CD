import "../styles/main.scss"
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


import { Provider } from 'react-redux';
import App from 'next/app'
import { createWrapper } from 'next-redux-wrapper'
import store from '../store'
import AuthAndAxios from '../helper/auth'
import {updateCart} from '../actions/cartActions'
import {config} from '../actions/generalActions'

import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
NProgress.configure({ showSpinner: false });
//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());



class MyApp extends App {
  componentDidMount(){
    store.dispatch(updateCart());
    config()
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    )
  }
}


const makestore = () => store
const wrapper = createWrapper(makestore)

export default wrapper.withRedux(AuthAndAxios(MyApp))
