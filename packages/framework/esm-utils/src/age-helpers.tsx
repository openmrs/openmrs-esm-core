/** @module @category Utility */

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
  const monthsAgoStr = monthsAgo > 0 ? `${monthsAgo} mo` : "";

  // For patients less than a year old, we calculate the number of days/weeks they have been alive
  let totalDaysAgo = daysIntoYear(today) - daysIntoYear(birthDate);
  if (totalDaysAgo < 0) {
    totalDaysAgo += 365;
  }
  const weeksAgo = Math.floor(totalDaysAgo / 7);

  // The "remainder" number of days after the weeksAgo number of weeks
  const remainderDaysInWeek = totalDaysAgo - weeksAgo * 7;

  // Depending on their age, return a different representation of their age.
  if (age === 0) {
    if (isSameDay(today, birthDate)) {
      return `Today`;
    } else if (weeksAgo < 4) {
      return `${totalDaysAgo} day`;
    } else if (weeksAgo === 0) {
      return `${totalDaysAgo} day`;
    } else if (remainderDaysInWeek > 0) {
      return `${weeksAgo} wk ${remainderDaysInWeek} d`;
    } else {
      return `${weeksAgo} week`;
    }
  } else if (age < 2) {
    return `${monthsAgoStr} ${age} yr`.trim();
  } else if (age < 18) {
    return `${age} yr ${monthsAgoStr}`.trim();
  } else {
    return `${age} years`;
  }
}
