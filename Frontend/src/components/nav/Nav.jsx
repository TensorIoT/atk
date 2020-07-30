import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

import { setUserAction } from "./../../store/reducers/userReducers";
// import { clearSettingsDataAction } from "./../../store/reducers/settingsReducers";
// import { clearTrackingDataAction } from "./../../store/reducers/trackingReducer";
import "./Nav.css";

const Nav = () => {
  const dispatch = useDispatch();
  // const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  let location = useLocation();
  let pathname = location.pathname;

  const paths = [
    {
      path: "/",
      title: "DEVICE TRACKING",
    },
    {
      path: "/devicesettings",
      title: "DEVICE SETTINGS",
    },
  ];

  const signOut = async () => {
    try {
      await Auth.signOut();
      window.location.reload(false);
      dispatch(setUserAction(""));
      // dispatch(clearSettingsDataAction());
      // dispatch(clearTrackingDataAction());
    } catch (error) {
      console.log("error signing out", error);
    }
  };

  const setLinkClass = (path) =>
    pathname === path ? "nav__link--light" : "nav__link--dark";

  const generateLinks = () => {
    return paths.map((p, i) => {
      return (
        <div className="link-container" key={i}>
          <Link className={setLinkClass(p.path)} to={p.path}>
            {p.title}
          </Link>
        </div>
      );
    });
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <nav className="nav">
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Are you sure you want to sign out?</DialogTitle>
        <DialogActions>
          <button className="dialogBtn yesBtn" onClick={() => signOut()}>
            Yes
          </button>
          <button
            className="dialogBtn cancelBtn"
            onClick={() => handleDialogClose()}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
      <div>{generateLinks()}</div>
      <div className="link-container signOut">
        <p onClick={() => handleDialogOpen()}>SIGN OUT</p>
      </div>
    </nav>
  );
};

export default Nav;
