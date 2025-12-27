import React, { useState } from "react";
import UnderlineInput from "common/components/Hook-Form/UnderlineInput";
import Icon from "common/components/Icon";
import classNames from "classnames";

import scss from "./UnderlineInputIcon.module.scss";

const UnderlineInputIcon = ({
  onIconClick,
  onIconHoverIn,
  onIconHoverOut,
  icon,
  iconText,
  iconLive,
  name,
  toolTip,
  className,
  ...rest
}) => {
  const [isClicked, updateClickState] = useState(false);
  const [isHovered, updateHoverState] = useState(false);

  const handleButtonClick = e => {
    updateClickState(!isClicked);
    onIconClick && onIconClick(e);
    e.preventDefault();
  };

  const handleButtonHoverIn = e => {
    updateHoverState(true);
    onIconHoverIn && onIconHoverIn(e);
    e.preventDefault();
  };

  const handleButtonHoverOut = e => {
    updateHoverState(false);
    onIconHoverOut && onIconHoverOut(e);
    e.preventDefault();
  };

  const handleButtonFocus = e => {
    updateHoverState(true);
    onIconHoverIn && onIconHoverIn(e);
    e.preventDefault();
  };

  const handleButtonBlur = e => {
    updateHoverState(false);
    onIconHoverOut && onIconHoverOut(e);
    e.preventDefault();
  };

  return (
    <div className={classNames(scss["underline-input-icon"], className)}>
      <UnderlineInput {...rest} name={name} />
      <button
        className={classNames({
          "icon-clicked": isClicked,
          "icon-hover": isHovered
        })}
        type="button" // clicking enter triggers button click for [type=submit] https://github.com/facebook/react/issues/3907
        onClick={handleButtonClick}
        onFocus={handleButtonFocus}
        onBlur={handleButtonBlur}
        onMouseOver={handleButtonHoverIn}
        onMouseOut={handleButtonHoverOut}
        aria-describedby={toolTip ? `tool-tip-${name}` : null}
        aria-live={iconLive ? "polite" : null}
      >
        <Icon icon={icon} text={iconText} />
      </button>
      {toolTip && (
        <div
          id={`tool-tip-${name}`}
          className={classNames("tool-tip", { "tool-tip-active": isHovered })}
        >
          {toolTip}
        </div>
      )}
    </div>
  );
};

export default UnderlineInputIcon;
