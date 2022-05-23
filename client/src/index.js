import React, {useContext, useReducer} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import App from "./pages/App";
import Splash from "./pages/Splash";

import "mapbox-gl/dist/mapbox-gl.css";
import * as serviceWorker from "./serviceWorker";
import appContext from "./context";
import ProtectedRoute from "./ProtectedRoute";
import reducer from "./reducer";

import {ApolloProvider} from "react-apollo";
import {ApolloClient} from "apollo-client";
import {WebSocketLink} from "apollo-link-ws";
import {InMemoryCache} from "apollo-cache-inmemory";

const wsLink = new WebSocketLink({
  uri: "ws:https//image2022.herokuapp.com/graphql",
  credentials: "include",

  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem("header"),
    },
  },
});

const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache(),
});

const Root = () => {
  const initialState = useContext(appContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Router>
      <ApolloProvider client={client}>
        <appContext.Provider value={{state, dispatch}}>
          <Switch>
            <ProtectedRoute exact path="/" component={App} />

            <Route path="/login" component={Splash} />
          </Switch>
        </appContext.Provider>
      </ApolloProvider>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
