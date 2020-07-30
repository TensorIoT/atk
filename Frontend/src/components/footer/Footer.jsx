import React from "react";
import "./Footer.css";
import logo from "./../../img/TensorIoTlogo-white.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerLogo-container">
        <img className="footer-logo" src={logo} alt="company logo" />
        <p className="logo-text">TensorIoT</p>
        <p className="legal-text">| © 2020 All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
