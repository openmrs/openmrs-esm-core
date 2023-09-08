import {
  toOmrsIsoString,
  toDateObjectStrict,
  isOmrsDateStrict,
} from "./omrs-dates";
import dayjs from "dayjs";
import timezoneMock from "timezone-mock";
import { formatDate, formatDatetime, formatTime } from ".";
import { i18n } from "i18next";

window.i18next = { language: "en" } as i18n;

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
    testDate.setHours(15);
    testDate.setMinutes(22);
    window.i18next.language = "en";
    expect(formatDate(testDate)).toMatch(/Today,\s+03:22\sPM/);
    expect(formatDate(testDate, { day: false })).toMatch(/Today,\s03:22\sPM/);
    expect(formatDate(testDate, { year: false })).toMatch(/Today,\s03:22\sPM/);
    expect(formatDate(testDate, { mode: "wide" })).toMatch(/Today,\s03:22\sPM/);
    window.i18next.language = "sw";
    expect(formatDate(testDate)).toEqual("Leo, 15:22");
    window.i18next.language = "ru";
    expect(formatDate(testDate)).toEqual("Сегодня, 15:22");
  });

  it("formats dates with respect to the locale", () => {
    timezoneMock.register("UTC");
    const testDate = new Date("2021-12-09T13:15:33");
    window.i18next.language = "en";
    expect(formatDate(testDate)).toEqual("09-Dec-2021");
    expect(formatDate(testDate, { day: false })).toEqual("Dec 2021");
    expect(formatDate(testDate, { year: false })).toEqual("09 Dec");
    expect(formatDate(testDate, { mode: "wide" })).toEqual("09 — Dec — 2021");
    expect(formatDate(testDate, { mode: "wide", year: false })).toEqual(
      "09 — Dec"
    );
    window.i18next.language = "am";
    expect(formatDate(testDate)).toEqual("30-Hidar-2014");
    expect(formatDate(testDate, { day: false })).toEqual("Hidar 2014");
    expect(formatDate(testDate, { year: false })).toEqual("30 Hidar");
    expect(formatDate(testDate, { mode: "wide" })).toEqual("30 — Hidar — 2014");
    expect(formatDate(testDate, { mode: "wide", year: false })).toEqual(
      "30 — Hidar"
    );
    window.i18next.language = "fr";
    expect(formatDate(testDate)).toEqual("09 déc. 2021");
    expect(formatDate(testDate, { day: false })).toEqual("déc. 2021");
    expect(formatDate(testDate, { year: false })).toEqual("09 déc.");
    expect(formatDate(testDate, { mode: "wide" })).toEqual("09 — déc. — 2021");
    window.i18next.language = "sw";
    expect(formatDate(testDate)).toEqual("09 Des 2021");
    window.i18next.language = "ru";
    expect(formatDate(testDate, { mode: "wide" })).toMatch(
      /09\s—\sдек\.\s—\s2021\sг\./
    );
  });

  it("respects the `time` option", () => {
    timezoneMock.register("UTC");
    const testDate = new Date("2021-12-09T13:15:33");
    const today = new Date();
    today.setHours(15);
    today.setMinutes(22);
    window.i18next.language = "en";
    expect(formatDate(testDate)).toEqual("09-Dec-2021");
    expect(formatDate(testDate, { time: true })).toMatch(
      /09-Dec-2021,\s01:15\sPM/
    );
    expect(formatDate(testDate, { time: false })).toEqual("09-Dec-2021");
    expect(formatDate(testDate, { time: "for today" })).toEqual("09-Dec-2021");
    expect(formatDate(today, { time: true })).toMatch(/Today,\s03:22\sPM/);
    expect(formatDate(today, { time: false })).toEqual("Today");
    expect(formatDate(today, { time: "for today" })).toMatch(
      /Today, 03:22\sPM/
    );
  });

  it("formats times with respect to the locale", () => {
    timezoneMock.register("Australia/Adelaide");
    const testDate = new Date("2021-12-09T13:15:33");
    window.i18next.language = "en";
    expect(formatTime(testDate)).toMatch(/01:15\sPM/i);
    window.i18next.language = "es-CO";
    expect(formatTime(testDate)).toMatch(/1:15\sp.\sm./); // it's not a normal space between the 'p.' and 'm.'
    window.i18next.language = "es-MX";
    expect(formatTime(testDate)).toEqual("13:15");
  });

  it("formats datetimes with respect to the locale", () => {
    timezoneMock.register("US/Pacific");
    const testDate = new Date("2022-02-09T13:15:33");
    const todayDate = new Date();
    todayDate.setHours(15);
    todayDate.setMinutes(20);
    window.i18next.language = "en";
    expect(formatDatetime(testDate)).toMatch(/09-Feb-2022,\s01:15\sPM/i);
    expect(formatDatetime(todayDate)).toMatch(/Today,\s03:20\sPM/i);
    window.i18next.language = "ht";
    expect(formatDatetime(testDate)).toEqual("09 févr. 2022, 13:15");
    expect(formatDatetime(todayDate)).toEqual("Aujourd’hui, 15:20");
  });

  it("does not handle today specially when `noToday` is passed", () => {
    const testDate = new Date();
    testDate.setHours(15);
    testDate.setMinutes(22);
    window.i18next.language = "en";
    const expected =
      testDate
        .toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
        .replace(/ /g, "-") + ", 03:22 PM";
    expect(formatDate(testDate, { noToday: true })).toEqual(expected);
  });
});
