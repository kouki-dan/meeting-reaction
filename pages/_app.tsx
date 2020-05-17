import React from "react";
import firebase from "firebase/app";
import App from "next/app";

type State = {
  firebaseInitialized: boolean;
};
  
class MyApp extends App<{}, {}, State>  {
  constructor(props) {
    super(props);
    this.state = {
      firebaseInitialized: false,
    };
  }

  componentDidMount() {
    if (process.env.NEXT_PUBLIC_FIREBASE_JSON) {
      firebase.initializeApp(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_JSON));
      this.setState({
        firebaseInitialized: true,
      });
    } else {
      fetch("/__/firebase/init.json").then(async (response) => {
        firebase.initializeApp(await response.json());
        this.setState({
          firebaseInitialized: true,
        });
      });
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    if (!this.state.firebaseInitialized) {
      return <></>;
    }
    return (
      <Component {...pageProps} />
    );
  }
}

export default MyApp;
