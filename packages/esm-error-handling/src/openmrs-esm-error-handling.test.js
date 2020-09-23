jest.mock("./index");
const { reportError } = jest.requireActual("./index");

jest.useFakeTimers();
describe("error handler", () => {
  it("transfrom the input in valid error object if it is not already an error obejct", () => {
    expect(() => {
      reportError("error");
      jest.runAllTimers();
    }).toThrow("error");

    expect(() => {
      reportError({ error: "error" });
      jest.runAllTimers();
    }).toThrow('Object thrown as error: {"error":"error"}');

    expect(() => {
      reportError(null);
      jest.runAllTimers();
    }).toThrow("'null' was thrown as an error");

    expect(() => {
      reportError(undefined);
      jest.runAllTimers();
    }).toThrow("'undefined' was thrown as an error");
  });
});
