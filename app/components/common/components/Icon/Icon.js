import React from "react";

const Icon = ({ icon, text, ...rest }) => {
  return icon ? (
    <span {...rest} key={icon} aria-label={text} role={text ? "img" : null}>
      <i className={icon}></i>
    </span>
  ) : null;
};

export default Icon;
