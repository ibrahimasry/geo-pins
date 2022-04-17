import React, { useState, useContext, useEffect } from "react";
import ReactMapGL, { Marker, Popup, NavigationControl } from "react-map-gl";
import differenceInMinutes from "date-fns/difference_in_minutes";
import { Subscription } from "react-apollo";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import PinIcon from "./PinIcon";
import appContext from "../context";
import Blog from "./Blog";
import { GET_PINS } from "../graphql/queries";
import { DELETE_PIN } from "../graphql/mutations";
import Client from "../client";
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION
} from "../graphql/subscriptions";

const Map = ({ classes }) => {
  const [viewOption, setViewOption] = useState({
    latitude: 37.7577,
    longitude: -122.4376
  });

  const [userPosition, setUserPosition] = useState();

  const {
    state: { currentUser, draft, pins, pin },
    dispatch
  } = useContext(appContext);
  const client = Client();

  useEffect(() => {
    getPins();
    getUserPosition();
  }, []);
  async function getPins() {
    const { getPins } = await client.request(GET_PINS);
    dispatch({ type: "GET_PINS", payload: getPins });
  }

  const mobileSize = useMediaQuery("(max-width: 650px)");
  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    closePopUp();
    dispatch({ type: "CREATE_DRAFT", payload: lngLat });
  };

  const highlightNewPin = pin => {
    const isNewPin =
      differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;

    return isNewPin ? "black" : "yellow";
  };

  function getUserPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewOption({ zoom: 12, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  }

  function openPopUp(pin) {
    dispatch({ type: "DELETE_DRAFT" });

    dispatch({ type: "SHOW_POPUP", payload: pin });
  }

  function closePopUp() {
    dispatch({ type: "HIDE_POPUP" });
  }

  function isAuthUser() {
    return pin.author._id === currentUser._id;
  }

  async function handleDeletePin() {
    await client.request(DELETE_PIN, { _id: pin._id });
  }
  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <ReactMapGL
        mapboxApiAccessToken="pk.eyJ1IjoiaWJyYWhpbWFzcnkiLCJhIjoiY2p1bW13ZmpmMDI2dTRibDg4cnA1NjNzaCJ9.G6C3-tJk2t2TrdYYFji4Ig"
        width="100vw"
        mapStyle="mapbox://sprites/mapbox/streets-v11"
        height="calc(100vh - 64px)"
        zoom={8}
        onClick={handleMapClick}
        {...viewOption}
        onViewportChange={viewport => {
          setViewOption(viewport);
        }}
      >
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewOption(newViewport)}
          />
        </div>

        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}

        {draft && (
          <Marker
            latitude={Number(draft[1])}
            longitude={Number(draft[0])}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <PinIcon color={"hotpink"} size={40} />
          </Marker>
        )}

        {pin && (
          <Popup
            latitude={Number(pin.lat)}
            longitude={Number(pin.lng)}
            closeOnClick={false}
            onClose={() => closePopUp(null)}
            anchor="top"
          >
            <img
              className={classes.popupImage}
              src={pin.image}
              alt={pin.title}
            />
            {isAuthUser() && (
              <div className={classes.Tab}>
                <Button onClick={() => handleDeletePin()}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              </div>
            )}
          </Popup>
        )}

        {pins.map(pin => (
          <Marker
            latitude={Number(pin.lat)}
            longitude={Number(pin.lng)}
            offsetLeft={-20}
            offsetTop={-10}
            key={pin._id}
          >
            <PinIcon
              onClick={() => openPopUp(pin)}
              color={highlightNewPin(pin)}
              size={40}
            />
          </Marker>
        ))}
      </ReactMapGL>

      {/* Subscriptions for Creating / Updating / Deleting Pins */}
      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          console.log({ pinAdded });
          dispatch({ type: "ADD_PIN", payload: pinAdded });
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          dispatch({ type: "CREATE_COMMENT", payload: pinUpdated });
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data;
          dispatch({ type: "DELETE_PIN", payload: pinDeleted._id });
        }}
      />

      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover",
    zIndex: 5
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
