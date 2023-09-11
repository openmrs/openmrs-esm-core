/** @module @category Utility */

import { getLocale } from "./omrs-dates";

/**
 * Gets the number of days in the year of the given date.
 * @param date The date to compute the days within the year.
 * @returns The number of days.
 */
export function daysIntoYear(date: Date) {
  return (
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      Date.UTC(date.getUTCFullYear(), 0, 0)) /
    24 /
    60 /
    60 /
    1000
  );
}

/**
 * Checks if two dates are representing the same day.
 * @param firstDate The first date.
 * @param secondDate The second date.
 * @returns True if both are located on the same day.
 */
export function isSameDay(firstDate: Date, secondDate: Date) {
  const firstISO = firstDate.toISOString();
  const secondISO = secondDate.toISOString();
  return (
    firstISO.slice(0, firstISO.indexOf("T")) ===
    secondISO.slice(0, secondISO.indexOf("T"))
  );
}

/**
 * Gets a human readable age represention of the provided date string.
 * @param dateString The stringified date.
 * @returns A human-readable string version of the age.
 */
export function age(dateString: string): string {
  // Based on http://www.gregoryschmidt.ca/writing/patient-age-display-ehr-conventions,
  // which is different from npm packages such as https://www.npmjs.com/package/timeago

  // First calculate the age in years
  const today = new Date();
  const birthDate = new Date(dateString);
  const monthDifference = today.getUTCMonth() - birthDate.getUTCMonth();
  const dateDifference = today.getUTCDate() - birthDate.getUTCDate();
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  if (monthDifference < 0 || (monthDifference === 0 && dateDifference < 0)) {
    age--;
  }

  // Now calculate the number of months in addition to the year's age
  let monthsAgo = monthDifference >= 0 ? monthDifference : monthDifference + 12;
  if (dateDifference < 0) {
    monthsAgo--;
  }

  // For patients less than a year old, we calculate the number of days/weeks they have been alive
  let totalDaysAgo = daysIntoYear(today) - daysIntoYear(birthDate);
  if (totalDaysAgo < 0) {
    totalDaysAgo += 365;
  }
  const weeksAgo = Math.floor(totalDaysAgo / 7);

  // The "remainder" number of days after the weeksAgo number of weeks
  const remainderDaysInWeek = totalDaysAgo - weeksAgo * 7;

  const rtf = new Intl.RelativeTimeFormat(getLocale(), { numeric: "auto" });

  const totalDaysAgoStr =
    totalDaysAgo > 0
      ? new Intl.NumberFormat(getLocale(), {
          style: "unit",
          unit: "day",
          unitDisplay: "short",
        }).format(totalDaysAgo)
      : "";

  const remainderDaysAgoStr = remainderDaysInWeek
    ? new Intl.NumberFormat(getLocale(), {
        style: "unit",
        unit: "day",
        unitDisplay: "short",
      }).format(remainderDaysInWeek)
    : "";

  const weeksAgoStr =
    weeksAgo > 0
      ? new Intl.NumberFormat(getLocale(), {
          style: "unit",
          unit: "week",
          unitDisplay: "short",
        }).format(weeksAgo)
      : "";

  const monthsAgoStr =
    monthsAgo > 0
      ? new Intl.NumberFormat(getLocale(), {
          style: "unit",
          unit: "month",
          unitDisplay: "short",
        }).format(monthsAgo)
      : "";

  const yearsAgoStr =
    age > 0
      ? new Intl.NumberFormat(getLocale(), {
          style: "unit",
          unit: "year",
          unitDisplay: "short",
        }).format(age)
      : "";

  // Depending on their age, return a different representation of their age.
  if (age === 0) {
    if (isSameDay(today, birthDate)) {
      return rtf.format(0, "day");
    } else if (weeksAgo < 4) {
      return totalDaysAgoStr;
    } else {
      return `${weeksAgoStr} ${remainderDaysAgoStr}}`.trim();
    }
  } else if (age < 18) {
    return `${yearsAgoStr} ${monthsAgoStr}`.trim();
  } else {
    return yearsAgoStr;
  }
}
