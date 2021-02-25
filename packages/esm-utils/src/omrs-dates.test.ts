import { toOmrsIsoString } from "./omrs-dates";
import dayjs from "dayjs";

describe("Openmrs Dates", () => {
  it("converts js Date object to omrs date string version", () => {
    var date = dayjs(
      "2018-03-19T00:05:03.999+0300",
      "YYYY-MM-DDTHH:mm:ss.SSSZZ"
    ).toDate();
    expect(toOmrsIsoString(date, true)).toEqual("2018-03-18T21:05:03.999+0000");
  });
});
