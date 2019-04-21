import React from "react";
const appContext = React.createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
  pins: [],
  pin:null
});

export default appContext;
