import React from "react";
import Input from "../Fields/Input";
import Label from "../Fields/Label";
import classNames from "classnames";
import { getSimpleHash } from "common/util/getSimpleHash";
import { REGEX_WHITE_SPACE } from "common/constants/regexConstants";
import scss from "./InputBox.module.scss";

const getClass = type => {
  switch (type) {
    case "radio": // () Radio
      return scss["input-radio"];
    case "box": // [ Box Button ]
      return scss["input-box"];
    default: // [] Check Mark
      return scss["input-checkbox"];
  }
};

const InputBox = ({ type, value, label, children, name, register, required, errors, ...rest }) => {
  const id = `${name.toLowerCase().replace(REGEX_WHITE_SPACE, "")}-${getSimpleHash(label || name)}`;

  return (
    <div className={classNames(getClass(type), { [scss["error"]]: errors })}>
      <div>
        <Input
          name={name}
          type={type == "box" ? "checkbox" : type}
          value={value}
          register={register}
          id={id}
          valid={errors ? true : null}
          aria-required={required ? true : null}
          {...rest}
        />
        <div>
          {type == "box" && (
            <span aria-hidden="true" tabIndex="-1">
              {label || children}
            </span>
          )}
          {type == "checkbox" && (
            <span>
              <i className="fas fa-check"></i>
            </span>
          )}
        </div>
      </div>
      <Label name={id}>{label || children}</Label>
    </div>
  );
};

export default InputBox;
