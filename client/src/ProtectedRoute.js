import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import appContext from "./context";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(appContext);
  return (
    <Route
      render={props =>
        !state.isAuth ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
      {...rest}
    />
  );
};

export default ProtectedRoute;
