import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Auth } from "aws-amplify";
import { Switch, Route } from "react-router-dom";

import Footer from "./components/footer/Footer";
import Banner from "./components/banner/Banner";
import Nav from "./components/nav/Nav";
import Settings from "./components/settings/Settings";
import Tracking from "./components/tracking/Tracking";
import { getDataAction } from "./store/reducers/settingsReducers";
import { setUserAction } from "./store/reducers/userReducers";
import API from "services/axiosCall";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.settings.devices);

  const getUserId = useCallback(async () => {
    try {
      const response = await Auth.currentAuthenticatedUser();
      dispatch(setUserAction(response.username));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const fetchData = useCallback(async () => {
    try {
      const response = await API.getAllDevices();
      dispatch(getDataAction(response.Items));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (devices.length === 0) {
      fetchData();
    }
    getUserId();
  }, [getUserId, fetchData, devices]);

  return (
    <div>
      <Banner />
      <div className="btn-section">
        <div className="nav-container">
          <Nav />
        </div>
        <main className="main">
          <Switch>
            <Route exact path="/" component={Tracking} />
            <Route path="/devicesettings" component={Settings} />
          </Switch>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
