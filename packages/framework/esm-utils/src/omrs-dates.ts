import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(utc);
dayjs.extend(isToday);

declare global {
  interface Window {
    i18next: {
      language: string;
    };
  }
}

export type DateInput = string | number | Date;

const isoFormat = "YYYY-MM-DDTHH:mm:ss.SSSZZ";

/**
 * This function is STRICT on checking whether a date string is the openmrs format.
 * The format should be YYYY-MM-DDTHH:mm:ss.SSSZZ
 */
export function isOmrsDateStrict(omrsPayloadString: string): boolean {
  // omrs format 2018-03-19T00:00:00.000+0300
  if (
    omrsPayloadString === null ||
    omrsPayloadString === undefined ||
    omrsPayloadString.trim().length !== 28
  ) {
    return false;
  }
  omrsPayloadString = omrsPayloadString.trim();

  // 11th character will always be T
  if (omrsPayloadString[10] !== "T") {
    return false;
  }

  // checking time format
  if (
    omrsPayloadString[13] !== ":" ||
    omrsPayloadString[16] !== ":" ||
    omrsPayloadString[19] !== "."
  ) {
    return false;
  }

  // checking UTC offset format
  if (!(omrsPayloadString[23] === "+" && omrsPayloadString[26] !== ":")) {
    return false;
  }

  return dayjs(omrsPayloadString, isoFormat).isValid();
}

/**
 *
 * @param date Checks if the provided date is today.
 */
export function isOmrsDateToday(date: DateInput) {
  return dayjs(date).isToday();
}

/**
 * Converts the object to a date object if it is a valid ISO date time string.
 */
export function toDateObjectStrict(omrsDateString: string): Date | null {
  if (!isOmrsDateStrict(omrsDateString)) {
    return null;
  }

  return dayjs(omrsDateString, isoFormat).toDate();
}

/**
 * Formats the input as a date time string using the format "YYYY-MM-DDTHH:mm:ss.SSSZZ".
 */
export function toOmrsIsoString(date: DateInput, toUTC = false): string {
  let d = dayjs(date);

  if (toUTC) {
    d = d.utc();
  }

  return d.format(isoFormat);
}

/**
 * @deprecated use `formatTime`
 * Formats the input as a time string using the format "HH:mm".
 */
export function toOmrsTimeString24(date: DateInput) {
  return dayjs(date).format("HH:mm");
}

/**
 * @deprecated use `formatTime`
 * Formats the input as a time string using the format "HH:mm A".
 */
export function toOmrsTimeString(date: DateInput) {
  return dayjs.utc(date).format("HH:mm A");
}

/**
 * @deprecated use `formatDate(date, DATE_FORMAT_YYYY_MMM_D)`
 * Formats the input as a date string using the format "DD - MMM - YYYY".
 */
export function toOmrsDayDateFormat(date: DateInput) {
  return toOmrsDateFormat(date, "DD - MMM - YYYY");
}

/**
 * @deprecated use `formatDate(date, DATE_FORMAT_MMM_D)`
 * Formats the input as a date string using the format "DD-MMM".
 */
export function toOmrsYearlessDateFormat(date: DateInput) {
  return toOmrsDateFormat(date, "DD-MMM");
}

/**
 * @deprecated use `formatDate(date, DATE_FORMAT_YYYY_MMM_D)`
 * Formats the input as a date string. By default the format "YYYY-MMM-DD" is used.
 */
export function toOmrsDateFormat(date: DateInput, format = "YYYY-MMM-DD") {
  return dayjs(date).format(format);
}

export const DATE_FORMAT_YYYY_MMM_D: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};
export const DATE_FORMAT_YYYY_MMM: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
};
export const DATE_FORMAT_MMM_D: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
};
export const DATE_FORMAT_YYYY_MMMM_D: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};
export const DATE_FORMAT_YYYY_MM_DD: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};
export const DATE_FORMAT_YY_MM_DD: Intl.DateTimeFormatOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
};

/**
 * Formats the input date according to the current locale and the
 * given format. The default format has a 4-digit year and an
 * abbreviated month name.
 *
 * Documentation for the `options` parameter, which is a
 * DateTimeFormat object, can be found here:
 * https://tc39.es/ecma402/#datetimeformat-objects
 *
 * @param date The date to be formatted
 * @param options A DateTimeFormat object
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = DATE_FORMAT_YYYY_MMM_D
) {
  return date.toLocaleDateString(getLocale(), options);
}

/**
 * Formats the input as a time, according to the current locale.
 * 12-hour or 24-hour clock depends on locale.
 *
 * @param date
 */
export function formatTime(date: Date) {
  return date.toLocaleTimeString(getLocale(), {
    hour: "numeric",
    minute: "2-digit",
  });
}

export const DATETIME_FORMAT_YYYY_MMM_D: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

export function formatDatetime(
  date: Date,
  options: Intl.DateTimeFormatOptions = DATETIME_FORMAT_YYYY_MMM_D
) {
  return date.toLocaleString(getLocale(), options);
}

function getLocale() {
  let language = window.i18next.language;
  language = language.replace("_", "-");
  // hack for `ht` until https://unicode-org.atlassian.net/browse/CLDR-14956 is fixed
  if (language === "ht") {
    language = "fr-HT";
  }
  return language;
}
