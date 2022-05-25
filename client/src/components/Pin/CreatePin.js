import React, {useState, useContext} from "react";
import axios from "axios";

import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import {unstable_useMediaQuery as useMediaQuery} from "@material-ui/core/useMediaQuery";
import appContext from "../../context";
import {CREATE_PIN} from "../../graphql/mutations";
import useClient from "../../client";

const CreatePin = ({classes}) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  const {state, dispatch} = useContext(appContext);
  const client = useClient();

  const [lng, lat] = state.draft;

  const handleDeleteDraft = () => {
    setContent("");
    setTitle("");
    setImage("");
    dispatch({type: "DELETE_DRAFT"});
  };

  const handleUploadImage = async () => {
    try {
      const cloudinaryApi =
        "https://api.cloudinary.com/v1_1/ibrahimasry/image/upload";

      const file = new FormData();
      file.append("file", image);
      file.append("upload_preset", "geoPins");
      file.append("cloud_name", "ibrahimasry");

      const res = await axios.post(cloudinaryApi, file);
      const {url} = res.data;
      return url;
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const image = await handleUploadImage();
    const res = await client.request(CREATE_PIN, {
      title,
      image,
      content,
      lat,
      lng,
    });
    if (res.createPin) {
      res.createPin.createdAt = new Date();
      dispatch({type: "ADD_PIN", payload: res.createPin});
    }
    handleDeleteDraft();
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} /> Pin Location
      </Typography>
      <div className={classes.form}>
        <TextField
          name="title"
          label="Title"
          placeholder="Insert pin title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          accept="image/*"
          id="image"
          type="file"
          className={classes.input}
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="image">
          <Button
            style={{color: image && "green"}}
            component="span"
            size="small"
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          multiline
          rows={mobileSize ? "3" : "6"}
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className={classes.form}>
        <Button
          onClick={handleDeleteDraft}
          className={classes.button}
          variant="contained"
          color="primary"
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = (theme) => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit,
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%",
  },
  input: {
    display: "none",
  },
  alignCenter: {
    display: "flex",
    alignItems: "center",
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit,
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0,
  },
});

export default withStyles(styles)(CreatePin);
