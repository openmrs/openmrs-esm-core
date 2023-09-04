/**
 * @module
 * @category Date and Time
 */
import { i18n } from "i18next";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(utc);
dayjs.extend(isToday);

declare global {
  interface Window {
    i18next: i18n;
  }
}

export type DateInput = string | number | Date;

const isoFormat = "YYYY-MM-DDTHH:mm:ss.SSSZZ";

/**
 * This function checks whether a date string is the OpenMRS ISO format.
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
 * Converts the object to a date object if it is an OpenMRS ISO date time string.
 * Otherwise returns null.
 */
export function toDateObjectStrict(omrsDateString: string): Date | null {
  if (!isOmrsDateStrict(omrsDateString)) {
    return null;
  }

  return dayjs(omrsDateString, isoFormat).toDate();
}

/**
 * Formats the input to OpenMRS ISO format: "YYYY-MM-DDTHH:mm:ss.SSSZZ".
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
 * @deprecated use `formatDate(date, "wide")`
 * Formats the input as a date string using the format "DD - MMM - YYYY".
 */
export function toOmrsDayDateFormat(date: DateInput) {
  return toOmrsDateFormat(date, "DD - MMM - YYYY");
}

/**
 * @deprecated use `formatDate(date, "no year")`
 * Formats the input as a date string using the format "DD-MMM".
 */
export function toOmrsYearlessDateFormat(date: DateInput) {
  return toOmrsDateFormat(date, "DD-MMM");
}

/**
 * @deprecated use `formatDate(date)`
 * Formats the input as a date string. By default the format "YYYY-MMM-DD" is used.
 */
export function toOmrsDateFormat(date: DateInput, format = "YYYY-MMM-DD") {
  return dayjs(date).format(format);
}

/**
 * Utility function to parse an arbitrary string into a date.
 * Uses `dayjs(dateString)`.
 */
export function parseDate(dateString: string) {
  return dayjs(dateString).toDate();
}

export type FormatDateMode = "standard" | "wide";

export type FormatDateOptions = {
  /**
   * - `standard`: "03 Feb 2022"
   * - `wide`:     "03 — Feb — 2022"
   */
  mode: FormatDateMode;
  /**
   * Whether the time should be included in the output always (`true`),
   * never (`false`), or only when the input date is today (`for today`).
   */
  time: true | false | "for today";
  /** Whether to include the day number */
  day: boolean;
  /** Whether to include the year */
  year: boolean;
  /**
   * Disables the special handling of dates that are today. If false
   * (the default), then dates that are today will be formatted as "Today"
   * in the locale language. If true, then dates that are today will be
   * formatted the same as all other dates.
   */
  noToday: boolean;
};

const defaultOptions: FormatDateOptions = {
  mode: "standard",
  time: "for today",
  day: true,
  year: true,
  noToday: false,
};

/**
 * Formats the input date according to the current locale and the
 * given options.
 *
 * Default options:
 *  - mode: "standard",
 *  - time: "for today",
 *  - day: true,
 *  - year: true
 *  - noToday: false
 *
 * If the date is today then "Today" is produced (in the locale language).
 * This behavior can be disabled with `noToday: true`.
 *
 * When time is included, it is appended with a comma and a space. This
 * agrees with the output of `Date.prototype.toLocaleString` for *most*
 * locales.
 *
 * TODO: Shouldn't throw on null input
 */
export function formatDate(date: Date, options?: Partial<FormatDateOptions>) {
  const { mode, time, day, year, noToday }: FormatDateOptions = {
    ...defaultOptions,
    ...options,
  };
  const formatterOptions: Intl.DateTimeFormatOptions = {
    year: year ? "numeric" : undefined,
    month: "short",
    day: day ? "2-digit" : undefined,
  };
  let locale = getLocale();
  let localeString: string;
  const isToday = dayjs(date).isToday();
  if (isToday && !noToday) {
    // This produces the word "Today" in the language of `locale`
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    localeString = rtf.format(0, "day");
    localeString =
      localeString[0].toLocaleUpperCase(locale) + localeString.slice(1);
  } else {
    if (locale == "en") {
      // This locale override is here rather than in `getLocale`
      // because Americans should see AM/PM for times.
      locale = "en-GB";
    }
    localeString = date.toLocaleDateString(locale, formatterOptions);
    if (locale == "en-GB" && mode == "standard" && year && day) {
      // Custom formatting for English. Use hyphens instead of spaces.
      localeString = localeString.replace(/ /g, "-");
    }
    if (mode == "wide") {
      localeString = localeString.replace(/ /g, " — "); // space-emdash-space
      if (/ru.*/.test(locale)) {
        // Remove the extra em-dash that gets added between the year and the suffix 'r.'
        const len = localeString.length;
        localeString =
          localeString.slice(0, len - 5) +
          localeString.slice(len - 5).replace(" — ", " ");
      }
    }
  }
  if (time === true || (isToday && time === "for today")) {
    localeString += `, ${formatTime(date)}`;
  }
  return localeString;
}

/**
 * Formats the input as a time, according to the current locale.
 * 12-hour or 24-hour clock depends on locale.
 */
export function formatTime(date: Date) {
  return date.toLocaleTimeString(getLocale(), {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats the input into a string showing the date and time, according
 * to the current locale. The `mode` parameter is as described for
 * `formatDate`.
 *
 * This is created by concatenating the results of `formatDate`
 * and `formatTime` with a comma and space. This agrees with the
 * output of `Date.prototype.toLocaleString` for *most* locales.
 */
export function formatDatetime(
  date: Date,
  options?: Partial<Omit<FormatDateOptions, "time">>
) {
  return formatDate(date, { ...options, time: true });
}

export function getLocale() {
  let language = window.i18next.language;
  language = language.replace("_", "-"); // just in case
  // hack for `ht` until https://unicode-org.atlassian.net/browse/CLDR-14956 is fixed
  if (language === "ht") {
    language = "fr-HT";
  }
  return language;
}
