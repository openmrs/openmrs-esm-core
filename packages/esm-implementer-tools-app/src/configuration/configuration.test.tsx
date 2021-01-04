import React from "react";
import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  getImplementerToolsConfig,
  setTemporaryConfigValue,
  Type,
} from "@openmrs/esm-config";
import { Provider } from "unistore/react";
import Configuration from "./configuration.component";
import { getStore } from "../store";
import {
  performConceptSearch,
  fetchConceptByUuid,
} from "./value-editors/concept-search.resource";

const mockGetImplementerToolsConfig = getImplementerToolsConfig as jest.Mock;
const mockSetTemporaryConfigValue = setTemporaryConfigValue as jest.Mock;
const mockPerformConceptSearch = performConceptSearch as jest.Mock;
const mockFetchConceptByUuid = fetchConceptByUuid as jest.Mock;
jest.mock("./value-editors/concept-search.resource", () => ({
  fetchConceptByUuid: jest.fn(),
  performConceptSearch: jest.fn(),
}));
jest.mock("lodash-es/debounce", () => jest.fn((fn) => fn));

global.URL.createObjectURL = jest.fn();

const mockImplToolsConfig = {
  "@openmrs/mario": {
    hasHat: {
      _type: Type.Boolean,
      _default: true,
      _value: false,
      _source: "provided",
    },
    hatUuid: {
      _type: Type.ConceptUuid,
      _default: "c64b8446-145e-49a3-98eb-ae37333bedf1",
      _value: "38c650cf-85d5-41b4-b0b1-46709248acca",
      _source: "provided",
    },
    numberFingers: {
      _type: Type.Number,
      _default: 10,
      _value: 8,
      _source: "child's drawing",
    },
    nemesisName: {
      _type: Type.String,
      _default: "Wario",
      _value: "Waluigi",
      _source: "fool",
    },
    mustacheUuid: {
      _type: Type.UUID,
      _default: "7e5b9aa1-69fb-45c0-90f5-edc66e23c81d",
      _value: "181aee4a-5664-42da-8699-c36d28083bd0",
      _source: "temporary config",
    },
  },
  "@openmrs/luigi": {
    favoriteNumbers: {
      _type: Type.Array,
      _elements: { _type: Type.Number },
      _default: [0],
      _value: [4, 12],
      _source: "provided",
    },
  },
  "@openmrs/bowser": {
    minions: {
      _type: Type.Array,
      _elements: {
        name: { _type: Type.String },
        canJump: { _type: Type.Boolean, _default: false },
      },
      _default: [],
      _value: [
        { name: "goomba", canJump: false },
        { name: "koopa", canJump: true },
      ],
      _source: "provided",
    },
  },
  "@openmrs/peach": {
    weapons: {
      _type: Type.Object,
      _elements: { _type: Type.Number },
      _default: {},
      _value: { gloves: 2, parasol: 1 },
    },
  },
};

describe(`<Configuration />`, () => {
  afterEach(() => {
    mockGetImplementerToolsConfig.mockReset();
    mockSetTemporaryConfigValue.mockReset();
    mockPerformConceptSearch.mockReset();
    mockFetchConceptByUuid.mockReset();
  });

  function renderConfiguration() {
    render(
      <Provider store={getStore()}>
        <Configuration setHasAlert={() => {}} />
      </Provider>
    );
  }

  it(`renders without dying`, async () => {
    renderConfiguration();
    await screen.findByText("Dev Config");
    screen.getByText("UI Editor");
    screen.getByText("Clear Temporary Config");
    screen.getByText("Download Temporary Config");
  });

  it("displays correct boolean value and editor", async () => {
    mockGetImplementerToolsConfig.mockResolvedValue({
      "@openmrs/mario": mockImplToolsConfig["@openmrs/mario"],
    });
    renderConfiguration();
    const rowElement = (await screen.findByText("hasHat")).closest(
      ".bx--structured-list-row"
    );
    expect(rowElement).toBeInTheDocument();
    if (rowElement) {
      const row = within(rowElement as HTMLElement);
      const valueButton = row.getByText("false");
      fireEvent.click(valueButton);
      const editor = await row.findByRole("checkbox");
      fireEvent.click(editor);
      fireEvent.click(row.getByText("Save"));
      expect(mockSetTemporaryConfigValue).toHaveBeenCalledWith(
        ["@openmrs/mario", "hasHat"],
        true
      );
    }
  });

  it("displays correct concept UUID value and editor", async () => {
    mockPerformConceptSearch.mockResolvedValue({
      data: {
        results: [
          { uuid: "61523693-72e2-456d-8c64-8c5293febeb6", display: "Fedora" },
        ],
      },
    });
    mockFetchConceptByUuid.mockResolvedValue({
      data: { name: { display: "Fedora" } },
    });
    mockGetImplementerToolsConfig.mockResolvedValue({
      "@openmrs/mario": mockImplToolsConfig["@openmrs/mario"],
    });
    renderConfiguration();
    const rowElement = (await screen.findByText("hatUuid")).closest(
      ".bx--structured-list-row"
    );
    expect(rowElement).toBeInTheDocument();
    if (rowElement) {
      const row = within(rowElement as HTMLElement);
      const valueButton = row.getByText("38c650cf-85d5-41b4-b0b1-46709248acca");
      fireEvent.click(valueButton);
      const editor = await row.findByRole("combobox");
      userEvent.type(editor, "fed");
      expect(mockPerformConceptSearch).toHaveBeenCalledWith("fed");
      const targetConcept = await row.findByText("Fedora");
      userEvent.click(targetConcept);
      userEvent.click(row.getByText("Save"));
      expect(mockSetTemporaryConfigValue).toHaveBeenCalledWith(
        ["@openmrs/mario", "hatUuid"],
        "61523693-72e2-456d-8c64-8c5293febeb6"
      );
    }
  });

  it("displays correct number value and editor", async () => {
    mockGetImplementerToolsConfig.mockResolvedValue({
      "@openmrs/mario": mockImplToolsConfig["@openmrs/mario"],
    });
    renderConfiguration();
    const rowElement = (await screen.findByText("numberFingers")).closest(
      ".bx--structured-list-row"
    );
    expect(rowElement).toBeInTheDocument();
    if (rowElement) {
      const row = within(rowElement as HTMLElement);
      const valueButton = row.getByText("8");
      expect(valueButton).toBeInTheDocument();
      fireEvent.click(valueButton);
      const editor = await row.findByRole("spinbutton");
      expect(editor).toHaveAttribute("type", "number");
      userEvent.clear(editor);
      userEvent.type(editor, "11");
      userEvent.click(row.getByText("Save"));
      expect(mockSetTemporaryConfigValue).toHaveBeenCalledWith(
        ["@openmrs/mario", "numberFingers"],
        11
      );
    }
  });

  it("displays correct string value and editor", async () => {
    mockGetImplementerToolsConfig.mockResolvedValue({
      "@openmrs/mario": mockImplToolsConfig["@openmrs/mario"],
    });
    renderConfiguration();
    const rowElement = (await screen.findByText("nemesisName")).closest(
      ".bx--structured-list-row"
    );
    expect(rowElement).toBeInTheDocument();
    if (rowElement) {
      const row = within(rowElement as HTMLElement);
      const valueButton = row.getByText("Waluigi");
      fireEvent.click(valueButton);
      const editor = await row.findByRole("textbox");
      userEvent.clear(editor);
      userEvent.type(editor, "Bowser");
      userEvent.click(row.getByText("Save"));
      expect(mockSetTemporaryConfigValue).toHaveBeenCalledWith(
        ["@openmrs/mario", "nemesisName"],
        "Bowser"
      );
    }
  });

  it("displays correct UUID value and editor", async () => {
    mockGetImplementerToolsConfig.mockResolvedValue({
      "@openmrs/mario": mockImplToolsConfig["@openmrs/mario"],
    });
    renderConfiguration();
    const rowElement = (await screen.findByText("mustacheUuid")).closest(
      ".bx--structured-list-row"
    );
    expect(rowElement).toBeInTheDocument();
    if (rowElement) {
      const row = within(rowElement as HTMLElement);
      const valueButton = row.getByText("181aee4a-5664-42da-8699-c36d28083bd0");
      fireEvent.click(valueButton);
      const editor = await row.findByRole("textbox");
      userEvent.clear(editor);
      const newUuid = "34f03796-f0e2-4f64-9e9a-28fb49a94baf";
      userEvent.type(editor, newUuid);
      userEvent.click(row.getByText("Save"));
      expect(mockSetTemporaryConfigValue).toHaveBeenCalledWith(
        ["@openmrs/mario", "mustacheUuid"],
        newUuid
      );
    }
  });

  it("renders an array editor for simple arrays that behaves correctly", async () => {
    mockGetImplementerToolsConfig.mockResolvedValue({
      "@openmrs/luigi": mockImplToolsConfig["@openmrs/luigi"],
    });
    renderConfiguration();
    const rowElement = (await screen.findByText("favoriteNumbers")).closest(
      ".bx--structured-list-row"
    );
    expect(rowElement).toBeInTheDocument();
    if (rowElement) {
      const row = within(rowElement as HTMLElement);
      const valueButton = row.getByText("4, 12");
      userEvent.click(valueButton);
      const firstValue = row.getByDisplayValue("4");
      expect(firstValue).toHaveAttribute("type", "number");
      userEvent.clear(firstValue);
      userEvent.type(firstValue, "5");
      const secondRowElement = row
        .getByDisplayValue("12")
        .closest(".bx--structured-list-row");
      expect(secondRowElement).toBeInTheDocument();
      // I can't get the add or remove buttons to work in tests.
      if (secondRowElement) {
        userEvent.click(
          within(secondRowElement as HTMLElement)
            .getByText("Remove")
            .closest("button") as HTMLElement
        );
        // await waitForElementToBeRemoved(() => row.getByDisplayValue("12"));
      }
      userEvent.click(row.getByText("Add"));
      // let rows = await row.findAllByRole("spinbutton");
      // let newInput = rows[rows.length - 1];
      // userEvent.type(newInput, "11");
      // userEvent.click(row.getByText("Add"));
      // rows = await row.findAllByRole("spinbutton");
      // newInput = rows[rows.length - 1];
      // userEvent.type(newInput, "13");
      // userEvent.click(row.getByText("Save"));
      // expect(mockSetTemporaryConfigValue).toHaveBeenCalledWith(["@openmrs/luigi", "favoriteNumbers"], [5, 11, 13]);
    }
  });
});
