import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import Moment from "moment";
import { cloneDeep } from "lodash";
import { extendMoment } from "moment-range";

import MapZoomBtns from "./MapZoomBtns";
import MapTypeBtns from "./MapTypeBtns";
import Markers from "./Markers";
import MapPopup from "./MapPopup";
import SideBar from "./Sidebar";
import {
  getDaysLeft,
  getDaysRight,
  getDate,
} from "./../../utils/helperFunctions";

import API from "services/axiosCall";
import {
  getDataAction,
  filterDevicesAction,
  hideDevicesAction,
  showDevicesAction,
  setSliderValuesAction,
  setShowLatestAction,
} from "./../../store/reducers/trackingReducer";
import "./Tracking.css";

import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

const moment = extendMoment(Moment);
const API_KEY = process.env.REACT_APP_MAPBOX_API_KEY;

const Map = () => {
  const dispatch = useDispatch();
  const devicesBackup = useSelector((state) => state.tracking.devicesBackup);
  const devices = useSelector((state) => state.tracking.devices);
  const hiddenDevices = useSelector((state) => state.tracking.hiddenDevices);
  const sliderValues = useSelector((state) => state.tracking.sliderValues);
  const showLatest = useSelector((state) => state.tracking.showLatest);
  const settingState = useSelector((state) => state.settings.devices);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [showSatellite, setShowSatellite] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [popupInfo, setPopupInfo] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 15,
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const response = await API.getTrackerData();
      dispatch(getDataAction(response.Items));
      updateMapSize();
      setDataLoaded(true);
      setViewport({
        latitude: response.Items ? parseFloat(response.Items[0].LAT) : 0,
        longitude: response.Items ? parseFloat(response.Items[0].LON) : 0,
        zoom: 17,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getCoordinatesArr = (DEVEUI) => {
    let coordsArr = [];
    let cluster = devices.filter((d) => d.DEVEUI === DEVEUI);
    cluster.sort((a, b) => (a.TSTAMP > b.TSTAMP ? 1 : -1));
    cluster.forEach((c) =>
      coordsArr.push([parseFloat(c.LON), parseFloat(c.LAT)])
    );
    return coordsArr;
  };

  const filterDevices = () => {
    let resArr = [];
    devicesBackup.forEach((d) => {
      let i = resArr.findIndex((x) => x.DEVEUI === d.DEVEUI);
      if (i <= -1) {
        resArr.push(d);
      }
    });
    return resArr;
  };

  const filteredDevices = filterDevices();
  const mapRef = useRef();
  const mapContainerRef = useRef();

  const filterByDate = (dateLeft, dateRight) => {
    const range = moment.range(dateLeft, dateRight);
    const inRange = devicesBackup.filter((d) =>
      range.contains(moment(d.TSTAMP * 1000)._d)
    );
    dispatch(filterDevicesAction(inRange));
    return inRange;
  };

  const handleSliderFiltering = () => {
    const isLeftDecimal = sliderValues[0] % 1 !== 0;
    const isRightDecimal = sliderValues[1] % 1 !== 0;
    let leftDate;
    let rightDate;

    if (isLeftDecimal) {
      leftDate = moment().add(sliderValues[0], "days").add(12, "hours");
    } else {
      leftDate = moment().add(sliderValues[0], "days");
    }

    if (isRightDecimal) {
      rightDate = moment().add(sliderValues[1], "days").add(12, "hours");
    } else {
      rightDate = moment().add(sliderValues[1], "days");
    }
    setDateRange([moment(leftDate._d), moment(rightDate._d)]);
    if (hiddenDevices.length === 0) {
      filterByDate(leftDate._d, rightDate._d);
    } else {
      handleFiltering();
    }
  };

  const handleFiltering = () => {
    let rangeFiltered = filterByDate(dateRange[0], dateRange[1]);
    if (showLatest) {
      rangeFiltered = filterByDate(moment().subtract(7, "days"), moment());
      let filtered = [];
      if (hiddenDevices.length === 0) {
        filteredDevices.forEach((device) => {
          let arr = rangeFiltered.filter((d) => d.DEVEUI === device.DEVEUI);
          filtered.push(max(arr));
        });
      } else {
        let newFilteredDevices = filteredDevices.filter(
          (d) => hiddenDevices.indexOf(d.DEVEUI) === -1
        );
        newFilteredDevices.forEach((device) => {
          let arr = rangeFiltered.filter((d) => d.DEVEUI === device.DEVEUI);
          filtered.push(max(arr));
        });
      }
      dispatch(filterDevicesAction(filtered));
    } else {
      if (hiddenDevices.length > 0) {
        let temp = rangeFiltered.filter(
          (t) => hiddenDevices.indexOf(t.DEVEUI) === -1
        );
        dispatch(filterDevicesAction(temp));
        return;
      }
      dispatch(filterDevicesAction(rangeFiltered));
    }
  };

  const max = (data) =>
    data.reduce((prev, current) =>
      prev.TSTAMP > current.TSTAMP ? prev : current
    );

  const updateMapSize = React.useCallback(() => {
    if (mapContainerRef.current) {
      const { width, height } = mapContainerRef.current.getBoundingClientRect();
      setViewport((viewport) => ({
        ...viewport,
        width,
        height,
      }));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateMapSize);
    return () => {
      window.removeEventListener("resize", updateMapSize);
    };
  }, [updateMapSize]);

  useEffect(() => {
    handleSliderFiltering();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValues, hiddenDevices, dataLoaded]);

  useEffect(() => {
    handleFiltering();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLatest, hiddenDevices, dataLoaded]);

  const hideTracker = (id) => {
    if (hiddenDevices.indexOf(id) > -1) {
      return;
    }
    dispatch(hideDevicesAction({ id }));
  };

  const showTracker = (id) => {
    let arr = hiddenDevices.filter((t) => t !== id);
    dispatch(showDevicesAction(arr));
  };

  const checkIfHidden = (id) => {
    return hiddenDevices.includes(id);
  };

  const handleSliderChange = (e) => {
    dispatch(setSliderValuesAction(e));
  };

  const handleCheckbox = (e) => {
    dispatch(setShowLatestAction(e.target.checked));
  };

  const updateView = (tracker) => {
    if (checkIfHidden(tracker.DEVEUI)) return;
    const foundDevice = devices.find((d) => d.DEVEUI === tracker.DEVEUI);
    if (foundDevice.LAT !== null || foundDevice.LON !== null) {
      viewportChangeHandler({
        latitude: parseFloat(foundDevice.LAT),
        longitude: parseFloat(foundDevice.LON),
        zoom: 19,
      });
    }
  };

  const mapRefHandler = (ref) => (mapRef.current = ref && ref.getMap());
  const viewportChangeHandler = (viewport) => setViewport(viewport);

  const onClickMarker = (device) => {
    setPopupInfo(device);
  };

  const getTrackerName = (id) => {
    let name = "";
    settingState.forEach((device) => {
      if (device.DEVEUI === id) {
        name = device.DEVICE_NAME;
      }
    });
    return name;
  };

  const newTableState = {
    columns: [
      {
        title: "Tracker",
        field: "DEVEUI",
        editable: "never",
        render: (rowData) => getTrackerName(rowData.DEVEUI),
      },
      { title: "Tracker ID", field: "DEVEUI", editable: "never" },
      {
        title: "Timestamp",
        field: "TSTAMP",
        editable: "never",
        render: (rowData) => getDate(rowData.TSTAMP),
      },
      {
        title: "Latitude",
        field: "LAT",
        editable: "never",
        render: (rowData) => (rowData.LAT ? rowData.LAT : " - "),
      },
      {
        title: "Longitude",
        field: "LON",
        editable: "never",
        render: (rowData) => (rowData.LON ? rowData.LON : " - "),
      },
      {
        title: "Accuracy(m)",
        field: "ACC",
        editable: "never",
        render: (rowData) => (rowData.ACC ? rowData.ACC : " - "),
      },
      {
        title: "GPS Fix",
        field: "GPS_FIX",
        editable: "never",
        render: (rowData) => (rowData.GPS_FIX ? "YES" : "NO"),
      },
      {
        title: "Acc <= 16m",
        field: "ACC",
        editable: "never",
        render: (rowData) =>
          rowData.accuracy === null ? " - " : rowData.ACC <= 16 ? "YES" : "NO",
      },
    ],
  };

  const classes = useStyles();

  return (
    <div>
      <p style={{ marginTop: "0" }}>Device Tracking</p>
      <div className={classes.innerContainer}>
        <Paper
          elevation={2}
          className={classes.mapContainer}
          ref={mapContainerRef}
        >
          <ReactMapGL
            mapboxApiAccessToken={API_KEY}
            mapStyle={
              showSatellite
                ? "mapbox://styles/mapbox/satellite-v9"
                : "mapbox://styles/mapbox/streets-v11"
            }
            width="100%"
            height="100%"
            dragRotate={false}
            touchRotate={false}
            {...viewport}
            ref={mapRefHandler}
            onViewportChange={viewportChangeHandler}
          >
            <MapTypeBtns
              showSatellite={showSatellite}
              setShowSatellite={setShowSatellite}
            />
            <MapZoomBtns />
            <MapPopup
              popupInfo={popupInfo}
              setPopupInfo={setPopupInfo}
              getTrackerName={getTrackerName}
            />
            <Markers data={devices} onClickMarker={onClickMarker} />
            {settingState &&
              settingState.map((d) => {
                return (
                  <Source
                    key={d.DEVEUI + d.LAST_MESSAGE}
                    id={d.DEVEUI}
                    type="geojson"
                    data={{
                      type: "Feature",
                      properties: {},
                      geometry: {
                        type: "LineString",
                        coordinates: getCoordinatesArr(d.DEVEUI),
                      },
                    }}
                  >
                    <Layer
                      id={d.DEVEUI}
                      type="line"
                      source={d.DEVEUI}
                      paint={{
                        "line-width": 3,
                        "line-color": "#888",
                        "line-translate": [16, 37],
                      }}
                    />
                  </Source>
                );
              })}
          </ReactMapGL>
        </Paper>
        <SideBar
          filteredDevices={filteredDevices}
          updateView={updateView}
          checkIfHidden={checkIfHidden}
          showTracker={showTracker}
          hideTracker={hideTracker}
          sliderValues={sliderValues}
          handleSliderChange={handleSliderChange}
          showLatest={showLatest}
          getDaysLeft={getDaysLeft}
          getDaysRight={getDaysRight}
          handleCheckbox={handleCheckbox}
          getTrackerName={getTrackerName}
        />
      </div>
      <div className={classes.tableContainer}>
        <MaterialTable
          title=""
          options={{
            headerStyle: {
              backgroundColor: "steelblue",
              color: "#FFF",
              fontWeight: "600",
            },
            exportAllData: true,
            exportButton: true,
            exportFileName: `assest_tracking.${Date.now()}`,
          }}
          style={{ marginTop: "1em" }}
          columns={newTableState.columns}
          data={cloneDeep(devices)}
        />
      </div>
    </div>
  );
};

export default Map;

const useStyles = makeStyles((theme) => ({
  innerContainer: {
    display: "flex",
  },
  mapContainer: {
    width: "68.5%",
    marginRight: "1em",
  },
  tableContainer: {
    width: "90%",
  },
}));
