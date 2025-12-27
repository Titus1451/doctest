import React from "react";

const Form = ({ method = "post", children, ...rest }) => {
  return (
    <form method={method} {...rest}>
      {children}
    </form>
  );
};

export default Form;
