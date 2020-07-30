import React from "react";
import logo from "./../../img/tensoriot-logo.jpg";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="tensoriot logo" />
      </div>
    </header>
  );
};

export default Header;
