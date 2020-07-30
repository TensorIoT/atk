import { configureStore, combineReducers } from "@reduxjs/toolkit";

import settingsReducer from "./reducers/settingsReducers";
import trackingReducer from "./reducers/trackingReducer";
import userReducer from "./reducers/userReducers";

const reducer = combineReducers({
  settings: settingsReducer,
  tracking: trackingReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer,
});
