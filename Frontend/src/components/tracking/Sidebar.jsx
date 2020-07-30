import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import { makeStyles } from "@material-ui/core/styles";
import { Range } from "rc-slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEyeSlash,
  faEye,
  faCrosshairs,
} from "@fortawesome/pro-regular-svg-icons";

import { setDeviceSearchAction } from "./../../store/reducers/trackingReducer";

const Sidebar = ({
  updateView,
  checkIfHidden,
  showTracker,
  hideTracker,
  sliderValues,
  handleSliderChange,
  showLatest,
  getDaysLeft,
  getDaysRight,
  handleCheckbox,
}) => {
  const dispatch = useDispatch();
  const deviceSearch = useSelector((state) => state.tracking.deviceSearch);
  const trackers = useSelector((state) => state.settings.devices);

  const [filteredTrackers, setFilteredTrackers] = useState([]);

  useEffect(() => {
    setFilteredTrackers(trackers);
  }, [trackers]);

  useEffect(() => {
    if (deviceSearch) {
      searchDevice();
    } else {
      setFilteredTrackers(trackers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceSearch]);

  const searchDevice = () => {
    let device = [];
    filteredTrackers.forEach((d) => {
      if (d.DEVICE_NAME.toLowerCase().includes(deviceSearch.toLowerCase())) {
        device.push(d);
      }
    });
    setFilteredTrackers(device);
  };

  const clearSearch = () => {
    dispatch(setDeviceSearchAction(""));
  };

  const handleChange = (e) => {
    dispatch(setDeviceSearchAction(e.target.value));
  };

  const classes = useStyles();
  return (
    <Paper className={classes.sidebar}>
      <p className={classes.title} style={{ marginTop: "0" }}>
        Trackers
      </p>
      <TextField
        placeholder="Search"
        value={deviceSearch}
        onChange={handleChange}
        style={{ marginLeft: ".75em" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment>
              <ClearIcon
                onClick={clearSearch}
                className={
                  deviceSearch ? classes.clearIcon : classes.disabledClearIcon
                }
              />
            </InputAdornment>
          ),
        }}
      />
      <div className={classes.trackerList}>
        {filteredTrackers &&
          filteredTrackers.map((tracker) => (
            <div
              className={classes.tracker}
              key={tracker.DEVEUI + tracker.TSTAMP}
            >
              <p className={classes.text} style={{ width: "127px" }}>
                {tracker.DEVICE_NAME}
              </p>
              <FontAwesomeIcon
                icon={faCrosshairs}
                onClick={() => updateView(tracker)}
                className={
                  checkIfHidden(tracker.DEVEUI)
                    ? classes.hiddenCrosshair
                    : classes.icon
                }
                style={{ margin: "0 1.5em" }}
              />
              {checkIfHidden(tracker.DEVEUI) ? (
                <FontAwesomeIcon
                  className={classes.hiddenIcon}
                  icon={faEyeSlash}
                  onClick={() => showTracker(tracker.DEVEUI)}
                />
              ) : (
                <FontAwesomeIcon
                  className={classes.icon}
                  icon={faEye}
                  onClick={() => hideTracker(tracker.DEVEUI)}
                />
              )}
            </div>
          ))}
      </div>
      <div>
        <div className={classes.devicesSection}>
          <p className={classes.title}>Tracking Period</p>
        </div>
        <p className={classes.text}>
          Drag slider to select start and end time.
        </p>
        <div className={classes.sliderContainer}>
          <div className={classes.slider}>
            <Range
              value={sliderValues}
              min={-7}
              max={0}
              dots={true}
              step={0.5}
              pushable={0.5}
              onChange={handleSliderChange}
              disabled={showLatest}
            />
            <div className={classes.sliderLabels}>
              <p style={{ color: showLatest ? "gray" : "black" }}>
                {getDaysLeft(sliderValues[0])}
              </p>
              <p style={{ color: showLatest ? "gray" : "black" }}>
                {getDaysRight(sliderValues[1])}
              </p>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <Checkbox
              color="primary"
              onChange={(e) => handleCheckbox(e)}
              checked={showLatest}
            />
            <p className={classes.text}>Show latest positions only</p>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default Sidebar;

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: "280px",
    height: "600px",
  },
  title: {
    display: "flex",
    alignItems: "center",
    fontSize: "1rem",
    fontWeight: "600",
    paddingLeft: "1em",
    height: "3rem",
    backgroundColor: "steelblue",
    color: "white",
  },
  text: {
    fontSize: "0.9rem",
    padding: "0 1em",
  },
  trackerList: {
    height: "250px",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      "-webkit-appearance": "none",
    },
    "&::-webkit-scrollbar:vertical": {
      width: "11px",
    },
    "&::-webkit-scrollbar:horizontal": {
      height: "11px",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "8px",
      border: "2px solid white",
      backgroundColor: "rgba(70, 130, 180, 0.5)",
    },
  },
  tracker: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    color: "steelblue",
    cursor: "pointer",
  },
  hiddenIcon: {
    color: "lightblue",
    cursor: "pointer",
  },
  hiddenCrosshair: {
    color: "lightblue",
  },
  slider: {
    width: "85%",
    margin: "0 auto",
  },
  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1rem",
    "& p": {
      width: "65px",
      textAlign: "center",
      fontWeight: "500",
    },
  },
  clearIcon: {
    cursor: "pointer",
  },
  disabledClearIcon: {
    opacity: "0.5",
  },
}));
