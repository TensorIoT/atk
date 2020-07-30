import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, Select, MenuItem } from "@material-ui/core";
import { cloneDeep } from "lodash";
import MaterialTable from "material-table";
import Tooltip from "@material-ui/core/Tooltip";

import {
  editNameAction,
  updateRateAction,
} from "./../../store/reducers/settingsReducers";
import RenderIcons from "./RenderIcons";
import { getDate } from "./../../utils/helperFunctions";
import API from "services/axiosCall";

const Settings = () => {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.settings.devices);
  const [hoveredData, setHoveredData] = useState({
    signal: null,
    anchorEl: null,
  });

  const updateName = async (data) => {
    try {
      const response = await API.updateTrackerName(data);
      if (response.UPDATE === "SUCCESS") {
        dispatch(
          editNameAction({ DEVEUI: data.DEVEUI, DEVICE_NAME: data.DEVICE_NAME })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateFrequency = async (data) => {
    try {
      const response = await API.updateTrackerFrequency(data);
      if (response.UPDATE === "SUCCESS") {
        dispatch(updateRateAction(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderDropdown = (rate, data) => {
    let { DEVEUI } = data;

    return (
      <FormControl variant="outlined" style={{ width: "200px" }}>
        <Select
          value={rate}
          onChange={(e) =>
            updateFrequency({ DEVEUI, UPDATE_RATE: e.target.value })
          }
        >
          <MenuItem value="LOWEST">Lowest</MenuItem>
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium (Default)</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
          <MenuItem value="HIGHEST">Highest</MenuItem>
        </Select>
      </FormControl>
    );
  };

  const setEstBatteryLife = (rate) => {
    switch (rate) {
      case "HIGHEST":
        return styleBatteryLife("lowest");
      case "HIGH":
        return styleBatteryLife("low");
      case "MEDIUM":
        return styleBatteryLife("medium");
      case "LOW":
        return styleBatteryLife("high");
      case "LOWEST":
        return styleBatteryLife("highest");
      default:
        return "error";
    }
  };

  const styleBatteryLife = (life) => {
    const batteryColor =
      life === "highest" || life === "high"
        ? "green"
        : life === "medium"
        ? "orange"
        : life === "low" || life === "lowest"
        ? "red"
        : "";
    return (
      <p style={{ textTransform: "capitalize", color: batteryColor }}>{life}</p>
    );
  };

  const tableState = {
    columns: [
      { title: "Name", field: "DEVICE_NAME", editable: "onUpdate" },
      { title: "ID", field: "DEVEUI", editable: "never" },
      {
        title: "Update Rate",
        field: "UPDATE_RATE",
        editable: "never",
        render: (rowData) => renderDropdown(rowData.UPDATE_RATE, rowData),
      },
      {
        title: "Est. Battery Life",
        field: "UPDATE_RATE",
        editable: "never",
        render: (rowData) => setEstBatteryLife(rowData.UPDATE_RATE),
      },
      {
        title: "Battery",
        field: "BATTERY_PERCENTAGE",
        editable: "never",
        render: (rowData) => (
          <RenderIcons
            setHoveredData={setHoveredData}
            percent={rowData.BATTERY_PERCENTAGE}
          />
        ),
      },
      {
        title: "Signal Strength",
        field: "SIGNAL_STRENGTH",
        editable: "never",
        render: (rowData) => (
          <RenderIcons
            setHoveredData={setHoveredData}
            signal={rowData.SIGNAL_STRENGTH}
          />
        ),
      },
      {
        title: "Last Message",
        field: "LAST_MESSAGE",
        editable: "never",
        render: (rowData) => getDate(rowData.LAST_MESSAGE),
      },
    ],
  };

  const renderToolTip = () => {
    const { signal, anchorEl } = hoveredData;
    if (!anchorEl) return null;

    return (
      <Tooltip
        title={signal}
        arrow
        placement="top"
        open={Boolean(anchorEl)}
        PopperProps={{
          anchorEl,
        }}
        classes={{ tooltip: classes.tooltip }}
      >
        <div />
      </Tooltip>
    );
  };

  const classes = useStyles();
  return (
    <div className={classes.settingsContainer}>
      {renderToolTip()}
      <MaterialTable
        title="Device Settings"
        columns={tableState.columns}
        data={cloneDeep(devices)}
        options={{
          paging: false,
          headerStyle: {
            backgroundColor: "steelblue",
            color: "#FFF",
            fontWeight: "600",
          },
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                if (oldData) {
                  updateName({
                    DEVEUI: newData.DEVEUI,
                    DEVICE_NAME: newData.DEVICE_NAME,
                  });
                }
              }, 600);
            }),
        }}
      />
    </div>
  );
};

export default Settings;

const useStyles = makeStyles((theme) => ({
  settingsContainer: {},
  tooltip: {
    fontSize: "1rem",
  },
}));
