import React from "react";

const Error = ({ children, name, ...rest }) => {
  return children ? (
    <div id={`error_${name}`} {...rest}>
      {children}
    </div>
  ) : (
    <></>
  );
};

export default Error;
