import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import getChildrenOffScreenText from "@/app/components/common/util/hooks/getChildrenOffScreenText";
import { REGEX_HTTPS, REGEX_ANCHOR_LINK } from "@/app/components/common/constants/regexConstants";

const SmartLink = ({
  className = null,
  href = "#",
  tabIndex = null,
  openInNewTab,
  onClick,
  children,
  as,
  ...rest
}) => {
  const [childrenWithOffScreenText] = getChildrenOffScreenText(children);
  const https = new RegExp(REGEX_HTTPS, "i");
  const hash = new RegExp(REGEX_ANCHOR_LINK, "i");
  const isExternal = https.test(href);
  const isHash = hash.test(href);

  if (isExternal) {
    return (
      <a
        {...rest}
        href={href}
        className={className}
        target={isHash ? null : "_blank"}
        rel={isHash ? null : "external noopener noreferrer"}
        tabIndex={tabIndex}
        onClick={onClick}
      >
        {childrenWithOffScreenText}
      </a>
    );
  } else {
    return (
      <Link
        href={href}
        as={as}
        {...rest}
        className={className}
        target={openInNewTab ? "_blank" : null}
        tabIndex={tabIndex}
        onClick={onClick}
      >
        {childrenWithOffScreenText}
      </Link>
    );
  }
};

SmartLink.propTypes = {
  classes: PropTypes.string,
  destination: PropTypes.string,
  text: PropTypes.string,
  tabIndex: PropTypes.number,
  openInNewTab: PropTypes.bool,
  onClick: PropTypes.func
};

export default SmartLink;
