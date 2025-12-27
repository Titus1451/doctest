import React, { useState } from "react";
import Textarea from "../Fields/Textarea";
import Label from "../Fields/Label";
import Error from "../Fields/Error";
import classNames from "classnames";

import scss from "./CommonTextarea.module.scss";

const CommonTextarea = ({
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
        scss["common-textarea"],
        { [scss["error"]]: errors },
        { [scss["focus"]]: isFocused },
        className
      )}
    >
      <Label name={name} className="sr-only">
        {label || placeholder}
      </Label>
      <Textarea
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

export default CommonTextarea;
