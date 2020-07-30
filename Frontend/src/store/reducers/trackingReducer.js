import { createSlice } from "@reduxjs/toolkit";

const state = {
  hiddenDevices: [],
  sliderValues: [-7, 0],
  showLatest: false,
  devices: [],
  devicesBackup: [],
  deviceSearch: "",
};

export const trackingSlice = createSlice({
  name: "tracking",
  initialState: state,
  reducers: {
    getData: (state, { payload }) => {
      state.devices = payload;
      state.devicesBackup = payload;
    },
    filterDevices: (state, { payload }) => {
      state.devices = payload;
    },
    hideDevices: (state, { payload }) => {
      state.hiddenDevices.push(payload.id);
    },
    showDevices: (state, { payload }) => {
      state.hiddenDevices = payload;
    },
    setSliderValues: (state, { payload }) => {
      state.sliderValues = payload;
    },
    setShowLatest: (state, { payload }) => {
      state.showLatest = payload;
    },
    setDeviceSearch: (state, { payload }) => {
      state.deviceSearch = payload;
    },
    clearData: (state) => {
      state.hiddenDevices = [];
      state.sliderValues = [-7, 0];
      state.showLatest = false;
      state.devices = [];
      state.devicesBackup = [];
      state.deviceSearch = "";
    },
  },
});

export const {
  getData: getDataAction,
  filterDevices: filterDevicesAction,
  hideDevices: hideDevicesAction,
  showDevices: showDevicesAction,
  setSliderValues: setSliderValuesAction,
  setShowLatest: setShowLatestAction,
  clearData: clearTrackingDataAction,
  setDeviceSearch: setDeviceSearchAction,
} = trackingSlice.actions;

export default trackingSlice.reducer;
