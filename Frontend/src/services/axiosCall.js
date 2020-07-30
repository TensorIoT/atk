import axios from "axios";
import { Auth } from "aws-amplify";

const rootURL = "<url for api gateway stage>";

const axiosCall = (method, url, data, headers) =>
  axios({ method, url, data, headers });

const getCognitoToken = async () => {
  const userToken = await Auth.currentSession();
  const id = userToken.getIdToken();
  const jwt = id.getJwtToken();
  return jwt;
};

export default {
  getAllDevices: async () => {
    const token = await getCognitoToken();
    const header = { authorization: token };
    const response = await axiosCall(
      "POST",
      `${rootURL}/atk/devices/getuserdevices`,
      {},
      header
    );
    return response.data;
  },
  getTrackerData: async () => {
    const token = await getCognitoToken();
    const header = { authorization: token };
    const response = await axiosCall(
      "POST",
      `${rootURL}/atk/devices/gettrackerdata`,
      {},
      header
    );
    return response.data;
  },
  updateTrackerName: async (data) => {
    const token = await getCognitoToken();
    const header = { authorization: token };
    const response = await axiosCall(
      "POST",
      `${rootURL}/atk/devicesettings/changetrackername`,
      JSON.stringify(data),
      header
    );
    return response.data;
  },
  updateTrackerFrequency: async (data) => {
    const token = await getCognitoToken();
    const header = { authorization: token };
    const response = await axiosCall(
      "POST",
      `${rootURL}/atk/devicesettings/changetrackerfrequency`,
      JSON.stringify(data),
      header
    );
    return response.data;
  },
};
