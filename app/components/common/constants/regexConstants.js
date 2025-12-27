export const REGEX_NUMBER = /[0-9]+/;
export const REGEX_NUMBERS_ONLY = /[0-9]/;
export const REGEX_NUMBERS_ZERO_ONLY = /^0+$/;
export const REGEX_NON_NUMBERS = /\D/g;
export const REGEX_NAME = /^[A-Za-zÀ-ÖØ-öø-ÿ '\-]*$/g;
export const REGEX_PHONE = /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$/;
export const REGEX_EMAIL =
  /^[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
export const REGEX_URL =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
export const REGEX_POSTAL_CODE = /^[0-9]{5}$/;
export const REGEX_POSTAL_CODE_CA =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
export const REGEX_POSTAL_CODE_LEGACY = /^\W*([a-zA-Z0-9]{0,3})\W*([a-zA-Z0-9]{0,3})/;
export const REGEX_UPC = /^(\s*|\d+)$/;
export const REGEX_COST = /^\$?[0-9]+(\.[0-9][0-9])?$/;
export const REGEX_NON_ALPHA_NUMERIC = /[^a-zA-Z0-9-]/g;
export const REGEX_SVG_IMAGE = /\.(svg)/i;
export const REGEX_OPEN_GRAPH_DESCRIPTION = /(<([^>]+)>)/gi;
export const REGEX_HTTPS = /^(?:[a-z]+:\/\/)/;
export const REGEX_IMAGE_PATH = /(http[s]?:\/\/.*\.(?:png|jpg|gif|svg|jpeg|webp))/i;
export const REGEX_ANCHOR_LINK = /^#\w+$/;
export const REGEX_WHITE_SPACE = /\s+/g;
export const REGEX_WHITE_SPACE_TWO_OCCURANCE = /\s{2,}/g;
export const REGEX_QUOTATION = /\"/g;
export const REGEX_OFF_SCREEN_TEXT = /\[\[(.*)\]\]/i;
export const REGEX_FORWARD_SLASH = /(\w)(\/)$/;
export const REGEX_HTML_TAG = /<[^>]*>/g;
export const REGEX_ENDS_WITH_HYPEN = /-$/;
export const REGEX_ANDROID_DEVICE = /Android/i;
export const REGEX_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
export const REGEX_TABLET = /iPad|Android/i;
export const REGEX_WEBVIEW =
  /(Version\/\d+.*\/\d+.0.0.0 Mobile|; ?wv|(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari))/i;

export const REGEX_COLOR_HEXCODE = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
