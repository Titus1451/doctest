import smoothscroll from "smoothscroll-polyfill";
import { delay } from "@/app/components/common/util/timeUtils";

const getHeaderHeight = () => {
  const headerElem = document.getElementById("header");
  const headerHeight = headerElem == null ? 0 : headerElem.clientHeight;
  return headerHeight;
};

const scrollToElement = async DOMElement => {
  history.scrollRestoration = "manual"; // prevent browser scroll restoration
  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = DOMElement.getBoundingClientRect().top;
  const offsetPosition = elementRect - bodyRect - getHeaderHeight();
  smoothscroll.polyfill();
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });
  await delay(1000);
  if (offsetPosition !== elementRect - bodyRect - getHeaderHeight()) {
    scrollToElement(DOMElement);
    DOMElement.setAttribute("tabindex", "-1");
    DOMElement.focus();
    return;
  }
};

const scrollElementIntoView = DOMElement => {
  // needed for chrome and ie
  // smoothscroll.polyfill();
  if (DOMElement && DOMElement.scrollIntoView) {
    DOMElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }
};

const focusElement = DOMElement => {
  if (DOMElement) {
    delay(100).then(() => {
      scrollToElement(DOMElement);
      DOMElement.setAttribute("tabindex", "-1");
      DOMElement.focus();
    });
  }
};

export default scrollElementIntoView;
export { scrollToElement, getHeaderHeight, focusElement };
