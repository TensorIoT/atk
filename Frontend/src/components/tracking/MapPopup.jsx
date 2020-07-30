import React from "react";
import { Popup } from "react-map-gl";
import Moment from "moment";

const MapPopup = ({ popupInfo, setPopupInfo, getTrackerName }) => {
  const getDate = (epochTime) => {
    let myDate = new Date(epochTime * 1000);
    let formated = Moment(myDate.toString()).format(
      "dddd, MMMM Do YYYY, h:mm:ss a"
    );
    return formated;
  };
  return (
    popupInfo && (
      <Popup
        tipSize={5}
        anchor="bottom"
        longitude={parseFloat(popupInfo.LON)}
        latitude={parseFloat(popupInfo.LAT)}
        closeOnClick={false}
        sortByDepth={true}
        onClose={() => setPopupInfo(null)}
      >
        <div>
          <p style={{ fontSize: "0.8rem", margin: "0" }}>
            {getTrackerName(popupInfo.DEVEUI)}
          </p>
          <p style={{ fontSize: "0.8rem", margin: "0" }}>
            {getDate(popupInfo.TSTAMP)}
          </p>
        </div>
      </Popup>
    )
  );
};

export default MapPopup;
