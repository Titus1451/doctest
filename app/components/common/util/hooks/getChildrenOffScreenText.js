'use client';
import React, { useCallback, useEffect, useState } from 'react';
import getOffScreenText, { PLACEMENT } from '../getOffScreenText';

// Custom hook name must start with "use"
const useChildrenOffScreenText = (children) => {
  const [offScreenText, setOffScreenText] = useState();
  const [offScreenTextPlacement, setOffScreenTextPlacement] = useState();
  const [updatedChildren, setUpdatedChildren] = useState();

  const updateChild = useCallback((child) => {
    if (typeof child === 'string') {
      const [_offScreenText, textWithoutOffScreenText, placement] =
        getOffScreenText(child);
      setOffScreenText(_offScreenText);
      setOffScreenTextPlacement(placement);
      child = textWithoutOffScreenText;
    }
    return child;
  }, []);

  const updatedChildrenWithOffScreenText = useCallback(() => {
    if (Array.isArray(children)) {
      const updatedList = [];
      children.forEach((child) => {
        updatedList.push(updateChild(child));
      });
      setUpdatedChildren(updatedList);
    } else if (typeof children === 'string') {
      setUpdatedChildren(updateChild(children));
    }
  }, [children, updateChild]);

  useEffect(() => {
    updatedChildrenWithOffScreenText();
  }, [updatedChildrenWithOffScreenText]);

  const childrenWithOffScreenText = (
    <>
      {offScreenTextPlacement === PLACEMENT.prefix && (
        <span className="sr-only">{offScreenText}</span>
      )}
      {updatedChildren || children}
      {offScreenTextPlacement === PLACEMENT.suffix && (
        <span className="sr-only">{offScreenText}</span>
      )}
    </>
  );

  return [
    childrenWithOffScreenText,
    updatedChildren,
    offScreenText,
    offScreenTextPlacement,
  ];
};

export default useChildrenOffScreenText;
