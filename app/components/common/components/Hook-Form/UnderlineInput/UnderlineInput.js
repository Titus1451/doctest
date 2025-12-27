import React, { useState } from "react";
import Input from "../Fields/Input";
import Label from "../Fields/Label";
import Error from "../Fields/Error";
import classNames from "classnames";

import scss from "./UnderlineInput.module.scss";

const UnderlineInput = ({
  errors,
  errorHidden,
  name,
  placeholder,
  register,
  label,
  type,
  required,
  value,
  onChange,
  onFocus,
  onBlur,
  className,
  ...rest
}) => {
  const [isFocused, updateFocusState] = useState(false);
  const handleFocus = () => {
    updateFocusState(true);
    onFocus && onFocus();
  };
  const handleBlur = () => {
    updateFocusState(false);
    onBlur && onBlur();
  };

  return (
    <div
      className={classNames(
        scss["underline-input"],
        { [scss["error"]]: errors },
        { [scss["focus"]]: isFocused },
        className
      )}
    >
      <Label name={name} className="sr-only">
        {label || placeholder}
      </Label>
      <Input
        {...rest}
        name={name}
        type={type}
        placeholder={placeholder}
        register={register}
        aria-required={required ? true : false}
        valid={errors ? true : false}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
      />
      {errors && !errorHidden && <Error name={name}>{errors?.message || errors}</Error>}
    </div>
  );
};

export default UnderlineInput;
