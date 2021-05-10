import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(utc);
dayjs.extend(isToday);

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
 * Formats the input as a time string using the format "HH:mm".
 */
export function toOmrsTimeString24(date: DateInput) {
  return dayjs(date).format("HH:mm");
}

/**
 * Formats the input as a time string using the format "HH:mm A".
 */
export function toOmrsTimeString(date: DateInput) {
  return dayjs.utc(date).format("HH:mm A");
}

/**
 * Formats the input as a date string using the format "DD - MMM - YYYY".
 */
export function toOmrsDayDateFormat(date: DateInput) {
  return toOmrsDateFormat(date, "DD - MMM - YYYY");
}

/**
 * Formats the input as a date string using the format "DD-MMM".
 */
export function toOmrsYearlessDateFormat(date: DateInput) {
  return toOmrsDateFormat(date, "DD-MMM");
}

/**
 * Formats the input as a date string. By default the format "YYYY-MMM-DD" is used.
 */
export function toOmrsDateFormat(date: DateInput, format = "YYYY-MMM-DD") {
  return dayjs(date).format(format);
}
