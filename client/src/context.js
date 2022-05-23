import React from "react";
const appContext = React.createContext({
  currentUser: null,
  isAuth: null,
  draft: null,
  pins: [],
  pin: null,
});

export default appContext;
