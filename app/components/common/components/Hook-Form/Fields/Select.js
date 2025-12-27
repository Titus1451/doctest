import React, { useState } from "react";

const Select = ({ register, name, valid, onChange, id, options, ...rest }) => {
  const [isDirty, updateDirtyState] = useState(true);

  const handleChange = event => {
    updateDirtyState(false);
    onChange && onChange(event);
  };

  return (
    <select
      {...rest}
      id={id ? `form_${id}` : `form_${name}`}
      name={name}
      ref={register}
      aria-invalid={valid}
      aria-describedby={name && valid ? `error_${name}` : null}
      onChange={handleChange}
      className={isDirty ? "default-state" : null}
      defaultValue=""
    >
      {options &&
        options.map(option => (
          <option key={option.name} value={option.name} disabled={option.name === "" ? true : null}>
            {option.text}
          </option>
        ))}
    </select>
  );
};

export default Select;
