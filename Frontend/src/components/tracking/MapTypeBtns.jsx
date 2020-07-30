import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const MapTypeBtns = ({ showSatellite, setShowSatellite }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Paper
        className={classes.btn}
        style={{ fontWeight: showSatellite ? "400" : "600" }}
        onClick={() => setShowSatellite(false)}
      >
        Map
      </Paper>
      <Paper
        className={classes.btn}
        style={{ fontWeight: showSatellite ? "600" : "400" }}
        onClick={() => setShowSatellite(true)}
      >
        Satellite
      </Paper>
    </div>
  );
};

export default MapTypeBtns;

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    position: "absolute",
    left: "1.875rem",
    top: "1.875rem",
  },
  btn: {
    padding: "0.5em 0.75em",
    marginRight: ".1em",
    "&:hover": {
      backgroundColor: "#E6E4DF",
      cursor: "pointer",
    },
  },
}));
