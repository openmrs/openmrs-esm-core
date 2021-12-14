import {
  toOmrsIsoString,
  toDateObjectStrict,
  isOmrsDateStrict,
} from "./omrs-dates";
import dayjs from "dayjs";
import timezoneMock from "timezone-mock";
import { formatDate, formatDatetime, formatTime } from ".";

describe("Openmrs Dates", () => {
  it("converts js Date object to omrs date string version", () => {
    var date = dayjs(
      "2018-03-19T00:05:03.999+0300",
      "YYYY-MM-DDTHH:mm:ss.SSSZZ"
    ).toDate();
    expect(toOmrsIsoString(date, true)).toEqual("2018-03-18T21:05:03.999+0000");
  });

  it("checks if a string is openmrs date", () => {
    expect(isOmrsDateStrict("2018-03-19T00:00:00.000+0300")).toEqual(true);
    expect(isOmrsDateStrict(" 2018-03-19T00:00:00.000+0300 ")).toEqual(true);
    // the exclusion test cases are important for strictness
    expect(isOmrsDateStrict("2018-03-19 00:00:00.000+0300")).toEqual(false);
    expect(isOmrsDateStrict("2018-03-19T00:00:00.000+03:00")).toEqual(false);
    expect(isOmrsDateStrict("2018-03-19T00:00:00.000 0300")).toEqual(false);
    expect(isOmrsDateStrict("2018-03-19T00:00:00 000+0300")).toEqual(false);
    expect(isOmrsDateStrict("2018-03-1")).toEqual(false);
    expect(isOmrsDateStrict("")).toEqual(false);
    expect(isOmrsDateStrict(null as any)).toEqual(false);
    expect(isOmrsDateStrict(undefined as any)).toEqual(false);
  });
  it("converts omrs date string version to js Date object", () => {
    expect(
      toDateObjectStrict("2018-03-19T00:00:00.000+0300")?.toUTCString()
    ).toEqual("Sun, 18 Mar 2018 21:00:00 GMT");
    expect(toDateObjectStrict("2018-03-19")).toEqual(null);
  });

  it("converts js Date object to omrs date string version", () => {
    var date = dayjs(
      "2018-03-19T00:05:03.999+0300",
      "YYYY-MM-DDTHH:mm:ss.SSSZZ"
    ).toDate();
    expect(toOmrsIsoString(date, true)).toEqual("2018-03-18T21:05:03.999+0000");
  });

  it("formats 'Today' with respect to the locale", () => {
    const testDate = new Date();
    window.i18next = { language: "en" };
    expect(formatDate(testDate)).toEqual("Today");
    expect(formatDate(testDate, "no day")).toEqual("Today");
    expect(formatDate(testDate, "no year")).toEqual("Today");
    expect(formatDate(testDate, "wide")).toEqual("Today");
    window.i18next = { language: "sw" };
    expect(formatDate(testDate)).toEqual("Leo");
    window.i18next = { language: "ru" };
    expect(formatDate(testDate)).toEqual("Сегодня");
  });

  it("formats dates with respect to the locale", () => {
    timezoneMock.register("UTC");
    const testDate = new Date("2021-12-09");
    window.i18next = { language: "en" };
    expect(formatDate(testDate)).toEqual("09-Dec-2021");
    expect(formatDate(testDate, "no day")).toEqual("Dec 2021");
    expect(formatDate(testDate, "no year")).toEqual("09 Dec");
    expect(formatDate(testDate, "wide")).toEqual("09 — Dec — 2021");
    window.i18next = { language: "fr" };
    expect(formatDate(testDate)).toEqual("09 déc. 2021");
    expect(formatDate(testDate, "no day")).toEqual("déc. 2021");
    expect(formatDate(testDate, "no year")).toEqual("09 déc.");
    expect(formatDate(testDate, "wide")).toEqual("09 — déc. — 2021");
    window.i18next = { language: "sw" };
    expect(formatDate(testDate)).toEqual("09 Des 2021");
    window.i18next = { language: "ru" };
    expect(formatDate(testDate, "wide")).toEqual("09 — дек. — 2021 г.");
  });

  it("formats times with respect to the locale", () => {
    timezoneMock.register("Australia/Adelaide");
    const testDate = new Date("2021-12-09T13:15:33");
    window.i18next = { language: "en" };
    expect(formatTime(testDate)).toEqual("01:15 PM");
    window.i18next = { language: "es-CO" };
    expect(formatTime(testDate)).toMatch(/1:15 p.\sm./); // it's not a normal space between the 'p.' and 'm.'
    window.i18next = { language: "es-MX" };
    expect(formatTime(testDate)).toEqual("13:15");
  });

  it("formats datetimes with respect to the locale", () => {
    timezoneMock.register("US/Pacific");
    const testDate = new Date("2022-02-09T13:15:33");
    const todayDate = new Date();
    todayDate.setHours(15);
    todayDate.setMinutes(20);
    window.i18next = { language: "en" };
    expect(formatDatetime(testDate)).toEqual("09-Feb-2022, 01:15 PM");
    expect(formatDatetime(todayDate)).toEqual("Today, 03:20 PM");
    window.i18next = { language: "ht" };
    expect(formatDatetime(testDate)).toEqual("09 févr. 2022, 13:15");
    expect(formatDatetime(todayDate)).toEqual("Aujourd’hui, 15:20");
  });
});
