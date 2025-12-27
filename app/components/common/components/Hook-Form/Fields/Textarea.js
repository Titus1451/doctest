import React from "react";

const Textarea = ({
  type,
  register,
  onFocus,
  onBlur,
  onChange,
  name,
  valid,
  id,
  value,
  ...rest
}) => {
  const getID = () => {
    if (id) {
      return `form_${id}`;
    } else if (name) {
      return `form_${name}`;
    } else {
      return null;
    }
  };

  return (
    <textarea
      {...rest}
      id={getID()}
      type={type || "text"}
      name={name}
      ref={register}
      value={value}
      onFocus={onFocus}
      onChange={onChange}
      onBlur={onBlur}
      aria-invalid={valid}
      aria-describedby={name && valid ? `error_${name}` : null}
    />
  );
};

export default Textarea;
