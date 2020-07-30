import React from "react";
import { Marker } from "react-map-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/pro-duotone-svg-icons";

function Markers({ data, onClickMarker }) {
  return (
    <div>
      {data.map((t) =>
        t.LON !== null && t.LAT !== null ? (
          <Marker
            key={t.TSTAMP + t.DEVEUI}
            longitude={parseFloat(t.LON)}
            latitude={parseFloat(t.LAT)}
          >
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              onClick={() => onClickMarker(t)}
              style={{
                fontSize: "2.5rem",
                "--fa-primary-color": "white",
                "--fa-secondary-color": "steelblue",
                "--fa-primary-opacity": "1.0",
                "--fa-secondary-opacity": "1.0",
              }}
            />
          </Marker>
        ) : (
          ""
        )
      )}
    </div>
  );
}

export default Markers;
