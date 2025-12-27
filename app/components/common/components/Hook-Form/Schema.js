import * as yup from "yup";

// import error messages
import {
  MESSAGE_REQUIRED,
  MESSAGE_EMAIL,
  MESSAGE_PHONE,
  MESSAGE_MOBILE_EMAIL,
  MESSAGE_SPECIAL_CHARS,
  MESSAGE_URL,
  MESSAGE_UPC,
  MESSAGE_DOLLAR
} from "common/constants/formMessages";

// import regex constant
import {
  REGEX_NUMBER,
  REGEX_PHONE,
  REGEX_EMAIL,
  REGEX_NAME,
  REGEX_POSTAL_CODE,
  REGEX_POSTAL_CODE_CA,
  REGEX_URL,
  REGEX_UPC,
  REGEX_COST
} from "common/constants/regexConstants";

export const email = yup.string().required(MESSAGE_REQUIRED).email(MESSAGE_EMAIL);

export const phone = yup.string().required(MESSAGE_REQUIRED).matches(REGEX_PHONE, MESSAGE_PHONE);

export const mobile_email = yup
  .string()
  .required(MESSAGE_REQUIRED)
  .test("mobile_email_validation", MESSAGE_MOBILE_EMAIL, function (value) {
    let isMobileValid = REGEX_PHONE.test(value);
    let isEmailValid = REGEX_EMAIL.test(value);
    if (!isMobileValid && !isEmailValid) {
      return false;
    }
    return true;
  });

export const required = yup.string().required(MESSAGE_REQUIRED);

export const first_name = yup
  .string()
  .required(MESSAGE_REQUIRED)
  .max(30, "Ensure this field has no more than 30 characters.")
  .matches(REGEX_NAME, MESSAGE_SPECIAL_CHARS);

export const last_name = yup
  .string()
  .max(50, "Ensure this field has no more than 50 characters.")
  .matches(REGEX_NAME, MESSAGE_SPECIAL_CHARS);

export const password = yup
  .string()
  .required(MESSAGE_REQUIRED)
  .min(8, "Password requires a minimum of 8 characters")
  .matches(REGEX_NUMBER, "Password requires an uppercase letter");

export const postal_code = yup
  .string()
  .required(MESSAGE_REQUIRED)
  .matches(REGEX_POSTAL_CODE, "Invalid zip code, enter a 5 digit area code");

export const postal_code_ca = yup
  .string()
  .required(MESSAGE_REQUIRED)
  .matches(REGEX_POSTAL_CODE_CA, "Invalid postal code");

export const tnc = yup
  .bool()
  .required(MESSAGE_REQUIRED)
  .oneOf(
    [true],
    "You must accept the Terms and Conditions and Privacy Policy to join the program."
  );

// Emerging Form

export const url = yup.string().matches(REGEX_URL, MESSAGE_URL);

export const upc = yup
  .string()
  .test("len", MESSAGE_UPC, val => val.length === 16 || val.length === 0)
  .matches(REGEX_UPC, MESSAGE_UPC);

export const cost = yup.string().required(MESSAGE_REQUIRED).matches(REGEX_COST, MESSAGE_DOLLAR);
