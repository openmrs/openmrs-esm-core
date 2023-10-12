import {
  CalendarDate,
  EthiopicCalendar,
  toCalendar,
} from "@internationalized/date";
import dayjs from "dayjs";
import { FormatDateOptions } from "./omrs-dates";

const ethiopianCalendarMonths = {
  1: "Meskerem",
  2: "Tikimt",
  3: "Hidar",
  4: "Tahsas",
  5: "Tir",
  6: "Yekatit",
  7: "Megabit",
  8: "Meyazya",
  9: "Ginbot",
  10: "Sene",
  11: "Hamle",
  12: "Nehase",
  13: "Puagme",
};

export function convertToEthiopianDate(date, options: FormatDateOptions) {
  const parsedDate = dayjs(date);
  if (parsedDate != null) {
    let yearValue = parsedDate.get("year");
    let monthValue = parsedDate.get("month") + 1;
    let dayValue = parsedDate.get("date");
    let gregorianDate = new CalendarDate(yearValue, monthValue, dayValue);
    let ethiopianDate = toCalendar(gregorianDate, new EthiopicCalendar());
    return formatDate(ethiopianDate, options);
  }
  return null;
}

function formatDate(ethiopianDate, options) {
  let formattedDate =
    ethiopianDate.day +
    "-" +
    ethiopianCalendarMonths[ethiopianDate.month] +
    "-" +
    ethiopianDate.year;

  if (options.day === false) {
    formattedDate =
      ethiopianCalendarMonths[ethiopianDate.month] + " " + ethiopianDate.year;
  }
  if (options.year === false) {
    formattedDate =
      ethiopianDate.day + " " + ethiopianCalendarMonths[ethiopianDate.month];
  }
  if (options.mode === "wide") {
    formattedDate =
      ethiopianDate.day +
      " — " +
      ethiopianCalendarMonths[ethiopianDate.month] +
      " — " +
      ethiopianDate.year;
    if (options.year === false) {
      formattedDate =
        ethiopianDate.day +
        " — " +
        ethiopianCalendarMonths[ethiopianDate.month];
    }
  }

  return formattedDate;
}
