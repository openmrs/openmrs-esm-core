import {
  toOmrsIsoString,
  toDateObjectStrict,
  isOmrsDateStrict,
} from "./omrs-dates";
import dayjs from "dayjs";
import timezoneMock from "timezone-mock";
import {
  DATE_FORMAT_MMM_D,
  DATE_FORMAT_YYYY_MMM,
  DATE_FORMAT_YYYY_MMMM_D,
  DATE_FORMAT_YYYY_MMM_D,
  DATE_FORMAT_YYYY_MM_DD,
  DATE_FORMAT_YY_MM_DD,
  formatDate,
  formatTime,
} from ".";

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

  it("formats dates with respect to the locale", () => {
    timezoneMock.register("UTC");
    window.i18next = { language: "fr" };
    const testDate = new Date("2021-12-09");
    expect(formatDate(testDate, DATE_FORMAT_YYYY_MMM_D)).toEqual("9 déc. 2021");
    expect(formatDate(testDate, DATE_FORMAT_YYYY_MMM)).toEqual("déc. 2021");
    expect(formatDate(testDate, DATE_FORMAT_MMM_D)).toEqual("9 déc.");
    expect(formatDate(testDate, DATE_FORMAT_YYYY_MMMM_D)).toEqual(
      "9 décembre 2021"
    );
    expect(formatDate(testDate, DATE_FORMAT_YYYY_MM_DD)).toEqual("09/12/2021");
    expect(formatDate(testDate, DATE_FORMAT_YY_MM_DD)).toEqual("09/12/21");
    window.i18next = { language: "sw" };
    expect(formatDate(testDate, DATE_FORMAT_YYYY_MMM_D)).toEqual("9 Des 2021");
  });

  it("formats times with respect to the locale", () => {
    timezoneMock.register("Australia/Adelaide");
    const testDate = new Date("2021-12-09T13:15:33");
    window.i18next = { language: "es-CO" };
    expect(formatTime(testDate)).toMatch(/1:15 p.\sm./); // it's not a normal space between the 'p.' and 'm.'
    window.i18next = { language: "es-MX" };
    expect(formatTime(testDate)).toMatch(/13:15/);
  });
});
