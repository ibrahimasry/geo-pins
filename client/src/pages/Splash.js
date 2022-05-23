import React, {useContext} from "react";
import {Redirect} from "react-router-dom";
import Login from "../components/Auth/Login";
import appContext from "../context";

const Splash = () => {
  const {
    state: {isAuth, currentUser},
  } = useContext(appContext);
  return isAuth ? <Redirect to="/" /> : <Login />;
};

export default Splash;
