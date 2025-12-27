import React, { useState } from "react";
import Select from "../Fields/Select";
import Label from "../Fields/Label";
import Error from "../Fields/Error";
import Icon from "common/components/Icon";
import classNames from "classnames";

import scss from "./UnderlineSelect.module.scss";

const UnderlineSelect = ({
  errors,
  errorHidden,
  name,
  register,
  label,
  required,
  value,
  onFocus,
  onBlur,
  onChange,
  ...rest
}) => {
  const [isFocused, updateFocusState] = useState(false);
  const handleFocusChange = e => {
    updateFocusState(true);
    onFocus && onFocus(e);
  };
  const handleBlurChange = e => {
    updateFocusState(false);
    onBlur && onBlur(e);
  };

  return (
    <div
      className={classNames(
        scss["underline-select"],
        { [scss["error"]]: errors },
        { [scss["focus"]]: isFocused }
      )}
    >
      <div className={scss["faux-select"]}>
        <Label name={name} className="sr-only">
          {label}
        </Label>
        <Select
          {...rest}
          name={name}
          register={register}
          aria-required={required ? true : false}
          valid={errors ? true : false}
          value={value}
          onFocus={handleFocusChange}
          onBlur={handleBlurChange}
          onChange={onChange}
        />
        <Icon icon="far fa-chevron-down" />
      </div>
      {errors && !errorHidden && <Error name={name}>{errors?.message}</Error>}
    </div>
  );
};

export default UnderlineSelect;
