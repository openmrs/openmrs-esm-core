import {
  toOmrsIsoString,
  toDateObjectStrict,
  isOmrsDateStrict,
} from "./omrs-dates";
import dayjs from "dayjs";

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
});
