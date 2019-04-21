import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import CreatePin from "./Pin/CreatePin";
import NoContent from "./Pin/NoContent";
import PinContent from "./Pin/PinContent";

import appContext from "../context";

const Blog = ({ classes }) => {
  const {
    state: { draft, pin }
  } = useContext(appContext);

  let CurrentContent;
  if (!draft && !pin) CurrentContent = NoContent;
  else if (draft && !pin) CurrentContent = CreatePin;
  else if (!draft && pin) CurrentContent = PinContent;

  return (
    <Paper className={classes.root}>
      <CurrentContent />
    </Paper>
  );
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    display: "flex",
    justifyContent: "center"
  },
  rootMobile: {
    maxWidth: "100%",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll"
  }
};

export default withStyles(styles)(Blog);
