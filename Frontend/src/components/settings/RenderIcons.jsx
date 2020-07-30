import React from "react";
import SignalCellular0BarIcon from "@material-ui/icons/SignalCellular0Bar";
import SignalCellular1BarIcon from "@material-ui/icons/SignalCellular1Bar";
import SignalCellular3BarIcon from "@material-ui/icons/SignalCellular3Bar";
import SignalCellular4BarIcon from "@material-ui/icons/SignalCellular4Bar";
import Battery20Icon from "@material-ui/icons/Battery20";
import Battery50Icon from "@material-ui/icons/Battery50";
import BatteryFullIcon from "@material-ui/icons/BatteryFull";
import BatteryUnknownIcon from "@material-ui/icons/BatteryUnknown";

const RenderIcons = (props) => {
  const getSignalIcon = (signal) => {
    if (signal <= -96) {
      return (
        <SignalCellular4BarIcon
          onMouseOver={timeMouseEnterHandler(signal)}
          onMouseLeave={timeMouseLeaveHandler}
        />
      );
    } else if (signal <= -81) {
      return (
        <SignalCellular3BarIcon
          onMouseOver={timeMouseEnterHandler(signal)}
          onMouseLeave={timeMouseLeaveHandler}
        />
      );
    } else if (signal >= -80 && signal <= -51) {
      return (
        <SignalCellular1BarIcon
          onMouseOver={timeMouseEnterHandler(signal)}
          onMouseLeave={timeMouseLeaveHandler}
        />
      );
    } else if (signal >= -50) {
      return (
        <SignalCellular0BarIcon
          onMouseOver={timeMouseEnterHandler(signal)}
          onMouseLeave={timeMouseLeaveHandler}
        />
      );
    } else {
      return signal;
    }
  };

  const getBatteryIcon = (percent) => {
    if (percent <= 40) {
      return (
        <Battery20Icon
          onMouseOver={timeMouseEnterHandler(percent, "%")}
          onMouseLeave={timeMouseLeaveHandler}
        />
      );
    } else if (percent > 30 && percent < 90) {
      return (
        <Battery50Icon
          onMouseOver={timeMouseEnterHandler(percent, "%")}
          onMouseLeave={timeMouseLeaveHandler}
        />
      );
    } else if (percent >= 90) {
      return (
        <BatteryFullIcon
          onMouseOver={timeMouseEnterHandler(percent, "%")}
          onMouseLeave={timeMouseLeaveHandler}
        />
      );
    } else {
      return (
        <BatteryUnknownIcon
          onMouseOver={timeMouseEnterHandler(percent, "%")}
          onMouseLeave={timeMouseLeaveHandler}
        />
      );
    }
  };

  const timeMouseEnterHandler = (amnt, type) => (event) => {
    event.persist();
    if (type === "%") {
      let signalToStr = `${amnt.toString()} %`;
      props.setHoveredData({ signal: signalToStr, anchorEl: event.target });
    } else {
      let signalToStr = `${amnt.toString()} dBm`;
      props.setHoveredData({ signal: signalToStr, anchorEl: event.target });
    }
  };

  const timeMouseLeaveHandler = () =>
    props.setHoveredData({ signal: null, anchorEl: null });

  return (
    <div>
      {props.signal
        ? getSignalIcon(props.signal)
        : getBatteryIcon(props.percent)}
    </div>
  );
};

export default RenderIcons;
