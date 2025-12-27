import { REGEX_OFF_SCREEN_TEXT } from "@/app/components/common/constants/regexConstants";

export const PLACEMENT = {
  prefix: "prefix",
  suffix: "suffix"
};

export default function getOffScreenText(str) {
  let placement = "";
  let offScreenText = "";
  let textWithoutOffScreenText = str;
  let offScreenTextRegextResult = str.match(REGEX_OFF_SCREEN_TEXT);
  if (offScreenTextRegextResult) {
    offScreenText = offScreenTextRegextResult[1];
    textWithoutOffScreenText = str.replace(REGEX_OFF_SCREEN_TEXT, "").trim();

    const offScreenIndex = offScreenTextRegextResult.index;
    const textIndex = str.indexOf(textWithoutOffScreenText);
    placement = offScreenIndex < textIndex ? PLACEMENT.prefix : PLACEMENT.suffix;
  }
  return [offScreenText, textWithoutOffScreenText, placement];
}
