import React, { Component } from 'react';
import classNames from 'classnames';
import { scrollToElement } from '@/app/components/common/util/scrollElementIntoView';
//import { Input } from '@/app/components/common/components/Hook-Form';
import SmartLink from '@/app/components/common/components/SmartLink';
import Icon from '@/app/components/common/components/Icon';
import { REGEX_ANCHOR_LINK } from '@/app/components/common/constants/regexConstants';

import scss from './Button.module.scss';

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: this.chooseTheme(props.theme),
      isFocused: false,
    };
  }

  componentDidMount() {
    this.setState({ theme: this.chooseTheme(this.props.theme) });
  }

  chooseTheme = (theme) => {
    switch (theme) {
      case 'outline':
        return 'se-button-pill se-button-outline';
        case 'custom-orange': // ADD THIS CASE
      return 'se-button-pill se-button-orange';
      case 'outline-white':
        return 'se-button-pill se-button-outline se-button-outline-white';
      case 'outline-black':
        return 'se-button-pill se-button-outline se-button-outline-black';
      case 'outline-green':
        return 'se-button-pill se-button-outline se-button-outline-green';
      case 'pill-white':
        return 'se-button-pill se-button-pill-white';
      case 'pill-white-green':
        return 'se-button-pill se-button-pill-white-green';
      case 'pill-black':
        return 'se-button-pill se-button-pill-black';
      case 'box-white':
        return 'se-button-box';
      case 'text-black':
        return 'se-button-pill se-button-text se-button-text-black';
      case 'text-white':
        return 'se-button-pill se-button-text se-button-text-white';
      case 'text-black-paddingless':
        return 'se-button-paddingless se-button-text-black-paddingless';
      case 'text-white-paddingless':
        return 'se-button-paddingless se-button-text-white-paddingless';
      case 'text-green-paddingless':
        return 'se-button-paddingless se-button-text-green-paddingless';
      default:
        return 'se-button-pill se-button-default';
    }
  };

  handleScrollToElement = (e) => {
    e.preventDefault();
    const href = e.target.hash;
    if (typeof href == 'string') {
      const elem = document.getElementById(href.substring(1));
      scrollToElement(elem);
    }
    return false;
  };

  handleClick = (e) => {
    const { destination, onClick, type } = this.props;
    if (destination?.match(REGEX_ANCHOR_LINK)) {
      this.handleScrollToElement(e);
      e.preventDefault();
    }

    if (!destination && type != 'submit') {
      e.preventDefault();
    }

    onClick && onClick(e);
  };

  fauxFocus = () => {
    this.setState({ isFocused: true });
  };

  fauxBlur = () => {
    this.setState({ isFocused: false });
  };

  render() {
    const { theme, isFocused } = this.state;
    const {
      iconPre,
      iconPost,
      text,
      children,
      destination,
      openInNewTab,
      wide,
      type,
      ...rest
    } = this.props;
    const btnClassNames = classNames(
      scss['se-button'],
      theme.split(' ').map((btn) => scss[`${btn}`]),
      { [scss['se-button-wide']]: wide },
      { [scss['focus']]: isFocused },
      { [scss['se-button-icons']]: iconPre || iconPost },
    );

    switch (type) {
      case 'submit':
        return (
          <div className={btnClassNames}>
            <div aria-hidden="true">
              {/* Pre Icon */}
              <Icon
                icon={iconPre}
                className={classNames(scss['icon'], scss['icon-pre'])}
              />
              {text}
              {/* Post Icon */}
              <Icon
                icon={iconPost}
                className={classNames(scss['icon'], scss['icon-post'])}
              />
            </div>
            {/* Change from Input to Button */}
            <button
              {...rest}
              type="submit" // Ensure type is 'submit'
              onClick={this.handleClick} // Ensure handleClick is not preventing form submission
              onFocus={this.fauxFocus}
              onBlur={this.fauxBlur}
              className={btnClassNames} // Pass button class names here if needed
            >
              {text} {/* Button label text */}
            </button>
          </div>
        );
      case 'button':
        return (
          <div className={btnClassNames}>
            <div aria-hidden="true">
              <Icon
                icon={iconPre}
                className={classNames(scss['icon'], scss['icon-pre'])}
              />
              {text || children}
              <Icon
                icon={iconPost}
                className={classNames(scss['icon'], scss['icon-post'])}
              />
            </div>
            <button
              {...rest}
              onClick={this.handleClick}
              onFocus={this.fauxFocus}
              onBlur={this.fauxBlur}
            >
              {text || children}
            </button>
          </div>
        );
      default:
        return (
          <SmartLink
            {...rest}
            href={destination || '#'}
            onClick={this.handleClick}
            className={btnClassNames}
            openInNewTab={openInNewTab}
            role="button"
          >
            <Icon
              icon={iconPre}
              className={classNames(scss['icon'], scss['icon-pre'])}
            />
            {text || children}
            <Icon
              icon={iconPost}
              className={classNames(scss['icon'], scss['icon-post'])}
            />
          </SmartLink>
        );
    }
  }
}

export default Button;
