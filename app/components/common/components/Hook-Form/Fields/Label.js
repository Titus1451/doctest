import React from "react";

const Label = ({ name, children, ...rest }) => {
  return (
    <label htmlFor={`form_${name}`} {...rest}>
      {children}
    </label>
  );
};

export default Label;
