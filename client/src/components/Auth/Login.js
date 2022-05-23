import React, {useContext} from "react";
import GoogleLogin from "react-google-login";
import {GraphQLClient} from "graphql-request";

import {withStyles} from "@material-ui/core/styles";
import appContext from "../../context";
import Typography from "@material-ui/core/Typography";
import Client from "../../client";

const Login = ({classes}) => {
  const {dispatch} = useContext(appContext);

  const responseGoogle = async (res) => {
    try {
      localStorage.setItem("header", res.getAuthResponse().token);

      const query = `
      {
        me {
          _id
          name
          picture
        }
      }
    `;

      const {me} = await Client().request(query);
      dispatch({type: "LOGGED_IN", payload: me});
      dispatch({type: "IS_LOGGED_IN", payload: res.isSignedIn()});
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
          "714415920029-kfb0a99k7pjj2b3e98gmt21bipa0voth.apps.googleusercontent.com"
        }
        onSuccess={responseGoogle}
        buttonText="Login with Google"
        isSignedIn
        onFailure={(e) => console.log(e)}
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
    alignItems: "center",
  },
};

export default withStyles(styles)(Login);
