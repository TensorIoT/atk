import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    devices: [],
  },
  reducers: {
    getData: (state, { payload }) => {
      state.devices = payload;
    },
    editName: (state, { payload }) => {
      const index = state.devices.findIndex(
        (device) => device.DEVEUI === payload.DEVEUI
      );
      if (index !== -1) {
        state.devices[index].DEVICE_NAME = payload.DEVICE_NAME;
      }
    },
    updateRate: (state, { payload }) => {
      const index = state.devices.findIndex(
        (device) => device.DEVEUI === payload.DEVEUI
      );
      if (index !== -1) {
        state.devices[index].UPDATE_RATE = payload.UPDATE_RATE;
      }
    },
    clearData: (state) => {
      state.devices = [];
    },
  },
});

export const {
  editName: editNameAction,
  updateRate: updateRateAction,
  getData: getDataAction,
  clearData: clearSettingsDataAction,
} = settingsSlice.actions;

export default settingsSlice.reducer;
