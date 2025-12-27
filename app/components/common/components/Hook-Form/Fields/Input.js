import React from "react";
import InputMask from "react-input-mask";
import { Controller } from "react-hook-form";

const Input = ({
  type,
  register,
  onFocus,
  onBlur,
  onChange,
  name,
  valid,
  id,
  mask,
  control,
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
    <>
      {mask && control ? (
        <Controller
          {...rest}
          as={InputMask}
          control={control}
          mask={mask}
          alwaysShowMask={false}
          defaultValue=""
          maskChar=""
          id={getID()}
          type={type || "text"}
          name={name}
          aria-invalid={valid}
          aria-describedby={name && valid ? `error_${name}` : null}
        />
      ) : (
        <input
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
      )}
    </>
  );
};

export default Input;
