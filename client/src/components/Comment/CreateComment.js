import React, {useState, useContext} from "react";
import {withStyles} from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";
import useClient from "../../client";
import {CREATE_COMMENT} from "../../graphql/mutations";
import appContext from "../../context";

const CreateComment = ({classes}) => {
  const [comment, setComment] = useState("");
  const client = useClient();
  const {state: AppState, dispatch} = useContext(appContext);
  const pinId = AppState.pin._id;

  const handleSubmitComment = async () => {
    const res = await client.request(CREATE_COMMENT, {
      pinId,
      text: comment,
    });

    if (res.createComment) {
      res.createComment.pin = pinId;
      res.createComment.createdAt = new Date();
      dispatch({type: "CREATE_COMMENT", payload: res.createComment});
    }
    setComment("");
  };

  return (
    <>
      <form className={classes.form}>
        <IconButton
          onClick={() => setComment("")}
          disabled={!comment.trim()}
          className={classes.clearButton}
        >
          <ClearIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder="Add Comment"
          multiline={true}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <IconButton
          onClick={handleSubmitComment}
          disabled={!comment.trim()}
          className={classes.sendButton}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </>
  );
};

const styles = (theme) => ({
  form: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  clearButton: {
    padding: 0,
    color: "red",
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark,
  },
});

export default withStyles(styles)(CreateComment);
