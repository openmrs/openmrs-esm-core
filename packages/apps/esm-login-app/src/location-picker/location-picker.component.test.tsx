import "@testing-library/jest-dom";
import React from "react";
import LocationPicker from "./location-picker.component";
import { act } from "react-dom/test-utils";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { useConfig } from "@openmrs/esm-framework";
import { mockConfig } from "../../__mocks__/config.mock";

const loginLocations = {
  data: {
    entry: [
      { resource: { id: "111", name: "Earth" } },
      { resource: { id: "222", name: "Mars" } },
    ],
  },
};

const mockedUseConfig = useConfig as jest.Mock;

jest.mock("lodash-es/debounce", () => jest.fn((fn) => fn));

describe(`<LocationPicker />`, () => {
  let searchInput,
    marsInput,
    submitButton,
    locationEntries,
    onChangeLocation,
    searchLocations;

  beforeEach(async () => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "111"),
        setItem: jest.fn(),
      },
      writable: true,
    });

    mockedUseConfig.mockReturnValue(mockConfig);

    // reset mocks
    locationEntries = loginLocations.data.entry;
    onChangeLocation = jest.fn(() => {});
    searchLocations = jest.fn(() => Promise.resolve([]));

    // prepare components
    render(
      <LocationPicker
        loginLocations={locationEntries}
        onChangeLocation={onChangeLocation}
        searchLocations={searchLocations}
        currentUser=""
        isLoginEnabled={true}
      />
    );

    searchInput = screen.getByRole("searchbox");
    submitButton = screen.getByText("Confirm", { selector: "button" });
  });

  it("trigger search on typing", async () => {
    searchLocations = jest.fn(() => Promise.resolve(loginLocations));

    render(
      <LocationPicker
        loginLocations={locationEntries}
        onChangeLocation={onChangeLocation}
        searchLocations={searchLocations}
        currentUser=""
        isLoginEnabled={true}
      />
    );

    fireEvent.change(searchInput, { target: { value: "mars" } });

    await waitFor(() => {
      expect(screen.getByLabelText("Mars")).not.toBeNull();
    });
  });

  it(`disables/enables the submit button when input is invalid/valid`, async () => {
    act(() => {
      fireEvent.change(searchInput, { target: { value: "Mars" } });
    });

    await waitFor(() => {
      expect(screen.queryByText("Mars")).not.toBeNull();
      marsInput = screen.getByLabelText("Mars");
    });

    act(() => {
      fireEvent.click(marsInput);
    });

    await waitFor(() => {
      expect(submitButton).not.toHaveAttribute("disabled");
    });
  });

  it(`makes an API request when you submit the form`, async () => {
    expect(onChangeLocation).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(searchInput, { target: { value: "Mars" } });
    });

    await waitFor(() => {
      expect(screen.queryByText("Mars")).not.toBeNull();
      marsInput = screen.getByLabelText("Mars");
    });

    fireEvent.click(marsInput);
    fireEvent.click(submitButton);

    await waitFor(() => expect(onChangeLocation).toHaveBeenCalled());
  });

  it(`send the user to the home page on submit`, async () => {
    expect(onChangeLocation).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(searchInput, { target: { value: "Mars" } });
    });

    await waitFor(() => {
      expect(screen.queryByText("Mars")).not.toBeNull();
      marsInput = screen.getByLabelText("Mars");
    });

    fireEvent.click(marsInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onChangeLocation).toHaveBeenCalled();
    });
  });

  it(`send the user to the redirect page on submit`, async () => {
    expect(onChangeLocation).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(searchInput, { target: { value: "Mars" } });
    });

    await waitFor(() => {
      expect(screen.queryByText("Mars")).not.toBeNull();
      marsInput = screen.getByLabelText("Mars");
    });

    submitButton = screen.getByText("Confirm", { selector: "button" });

    fireEvent.click(marsInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onChangeLocation).toHaveBeenCalled();
    });
  });

  it("search term input should have autofocus on render", async () => {
    expect(searchInput).toEqual(document.activeElement);
  });

  it("should deselect active location when user searches for a location", async () => {
    const locationRadioButton: HTMLElement = await screen.getByRole("radio", {
      name: /Earth/,
    });
    fireEvent.click(locationRadioButton);
    expect(locationRadioButton).toHaveProperty("checked", true);
    fireEvent.change(searchInput, { target: { value: "Mars" } });
    expect(locationRadioButton).toHaveProperty("checked", false);
  });

  it("shows error message when no matching locations can be found", async () => {
    fireEvent.change(searchInput, { target: { value: "doof" } });

    await waitFor(() => {
      expect(
        screen.getByText("Sorry, no matching location was found")
      ).not.toBeNull();
    });
    expect(submitButton).toHaveAttribute("disabled");
  });

  it("should get user Default location on render and auto select the location", async () => {
    expect(
      window.localStorage.getItem("userDefaultLoginLocationKeyDemo")
    ).toEqual("111");
    const locationRadioButton: HTMLElement = await screen.getByRole("radio", {
      name: /Earth/,
    });
    expect(locationRadioButton).toHaveProperty("checked", true);
  });

  it("should set user Default location when location is changed", async () => {
    const locationRadioButton: HTMLElement = await screen.findByLabelText(
      /Earth/
    );
    fireEvent.click(locationRadioButton);
    expect(window.localStorage.setItem).toHaveBeenCalled();
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "userDefaultLoginLocationKey",
      "111"
    );
  });

  it("should display the correct pageSize", async () => {
    expect(screen.getByText(/Showing 2 of 2 locations/i)).toBeInTheDocument();

    const loginLocations: any = {
      data: {
        entry: [
          { resource: { id: "111", name: "Earth" } },
          { resource: { id: "222", name: "Mars" } },
          { resource: { id: "333", name: "Mercury" } },
        ],
      },
    };

    render(
      <LocationPicker
        loginLocations={loginLocations.data.entry}
        onChangeLocation={onChangeLocation}
        searchLocations={searchLocations}
        currentUser=""
        isLoginEnabled={true}
      />
    );

    expect(screen.getByText(/Showing 3 of 3 locations/i)).toBeInTheDocument();
  });
});
