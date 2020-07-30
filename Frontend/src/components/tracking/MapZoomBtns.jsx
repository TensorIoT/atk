import React from "react";
import { NavigationControl } from "react-map-gl";

const MapZoomButtons = () => (
  <div style={{ position: "absolute", right: "1.875rem", bottom: "1.875rem" }}>
    <NavigationControl showCompass={false} />
  </div>
);

export default MapZoomButtons;
