import React, { useContext } from "react";
import GoogleLogin from "react-google-login";
import { GraphQLClient } from "graphql-request";

import { withStyles } from "@material-ui/core/styles";
import appContext from "../../context";
import Typography from "@material-ui/core/Typography";

const Login = ({ classes }) => {
  const { dispatch } = useContext(appContext);
  const token = res.getAuthResponse().id_token
  const responseGoogle = async res => {
    try {
      const graphQLClient = new GraphQLClient("http://localhost:8080/graphql", {
        headers: {
          authorization:token
        }
      });

      localStorage.setItem('header',res.getAuthResponse().token);

      const query = `
      {
        me {
          _id
          name
          picture
        }
      }
    `;

      const { me } = await graphQLClient.request(query);
      dispatch({ type: "LOGGED_IN", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: res.isSignedIn() });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h3" gutterBottom>
        Welcome , share your beautiful images
      </Typography>

      <GoogleLogin
        clientId={
          "1010376071284-50kkhosj8f1ovpdt3gtbfuakdt89bb8b.apps.googleusercontent.com"
        }
        onSuccess={responseGoogle}
        buttonText="Login with Google"
        onFailure={e => console.log(e)}
        isSignedIn
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);