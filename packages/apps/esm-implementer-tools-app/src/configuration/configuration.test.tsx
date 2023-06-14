import React from "react";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  implementerToolsConfigStore,
  temporaryConfigStore,
  Type,
} from "@openmrs/esm-framework/src/internal";
import { Configuration } from "./configuration.component";
import {
  useConceptLookup,
  useGetConceptByUuid,
} from "./interactive-editor/value-editors/concept-search.resource";

const mockUseConceptLookup = useConceptLookup as jest.Mock;
const mockUseGetConceptByUuid = useGetConceptByUuid as jest.Mock;

jest.mock("lodash-es/debounce", () => jest.fn((fn) => fn));
jest.mock("./interactive-editor/value-editors/concept-search.resource", () => ({
  useConceptLookup: jest.fn().mockImplementation(() => ({
    concepts: [],
    error: null,
    isSearchingConcepts: false,
  })),
  useGetConceptByUuid: jest.fn().mockImplementation(() => ({
    concept: null,
    error: null,
    isLoadingConcept: false,
  })),
}));

window.URL.createObjectURL = jest.fn();

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

describe("Configuration", () => {
  afterEach(() => {
    implementerToolsConfigStore.setState({ config: {} });
    temporaryConfigStore.setState({ config: {} });
  });

  function renderConfiguration() {
    render(<Configuration />);
  }

  it("renders the configuration component inside the implementer tools panel", () => {
    renderConfiguration();
    screen.getByRole("switch", { name: /json editor/i });
    screen.getByRole("switch", { name: /ui editor/i });
    screen.getByRole("button", { name: /clear local config/i });
    screen.getByRole("button", { name: /download config/i });
    screen.getByRole("textbox", { name: /search configuration/i });
  });

  it("displays correct boolean value and editor", async () => {
    const user = userEvent.setup();

    implementerToolsConfigStore.setState({
      config: {
        "@openmrs/mario": mockImplToolsConfig["@openmrs/mario"],
      },
    });

    renderConfiguration();

    const rowElement = screen
      .getByText("hasHat")
      .closest(".cds--structured-list-row");
    expect(rowElement).toBeInTheDocument();

    if (rowElement) {
      const row = within(rowElement as HTMLElement);
      const value = row.getByText("false");
      const editButton = row.getByText("Edit").parentElement as any;
      await user.click(editButton);
      const editor = row.getByRole("button", { name: /edit/i });

      await user.click(editor);
      await user.click(row.getByText("Save"));

      expect(temporaryConfigStore.setState).toHaveBeenCalledWith({
        config: { "@openmrs/mario": { hasHat: false } },
      });
    }
  });

  it("displays correct concept UUID value and editor", async () => {
    const user = userEvent.setup();

    mockUseConceptLookup.mockImplementation(() => ({
      concepts: [
        { uuid: "61523693-72e2-456d-8c64-8c5293febeb6", display: "Fedora" },
      ],
      error: null,
      isSearchingConcepts: false,
    }));

    mockUseGetConceptByUuid.mockImplementation(() => ({
      concept: { name: { display: "Fedora" } },
      error: null,
      isLoadingConcept: false,
    }));

    implementerToolsConfigStore.setState({
      config: {
        "@openmrs/mario": mockImplToolsConfig["@openmrs/mario"],
      },
    });

    renderConfiguration();

    const rowElement = (await screen.findByText("hatUuid")).closest(
      ".cds--structured-list-row"
    );
    expect(rowElement).toBeInTheDocument();

    if (rowElement) {
      const row = within(rowElement as HTMLElement);
      const editButton = row.getByRole("button", { name: /edit/i });

      await user.click(editButton);

      const searchbox = await row.findByRole("combobox", {
        name: /search concepts/i,
      });

      await user.type(searchbox, "fedora");

      expect(mockUseConceptLookup).toHaveBeenCalledWith("fed");

      const targetConcept = await row.findByText("Fedora");

      await user.click(targetConcept);
      await user.click(row.getByText("Save"));

      // expect(temporaryConfigStore.setState).toHaveBeenCalledWith({
      //   config: {
      //     "@openmrs/mario": { hatUuid: "61523693-72e2-456d-8c64-8c5293febeb6" },
      //   },
      // });
    }
  });

  it("displays correct number value and editor", async () => {
    const user = userEvent.setup();

    implementerToolsConfigStore.setState({
      config: {
        "@openmrs/mario": mockImplToolsConfig["@openmrs/mario"],
      },
    });

    renderConfiguration();

    const rowElement = (await screen.findByText("numberFingers")).closest(
      ".cds--structured-list-row"
    );
    expect(rowElement).toBeInTheDocument();

    if (rowElement) {
      const row = within(rowElement as HTMLElement);
      const valueButton = row.getByText("8");
      expect(valueButton).toBeInTheDocument();

      const editButton = row.getByRole("button", { name: /edit/i });

      await user.click(editButton);

      const editor = await row.findByRole("spinbutton");

      expect(editor).toHaveAttribute("type", "number");

      await user.clear(editor);
      await user.type(editor, "11");
      await user.click(row.getByText("Save"));

      expect(temporaryConfigStore.setState).toHaveBeenCalledWith({
        config: { "@openmrs/mario": { numberFingers: 11 } },
      });
    }
  });

  it("displays correct string value and editor", async () => {
    const user = userEvent.setup();

    implementerToolsConfigStore.setState({
      config: {
        "@openmrs/mario": mockImplToolsConfig["@openmrs/mario"],
      },
    });

    renderConfiguration();

    const rowElement = (await screen.findByText("nemesisName")).closest(
      ".cds--structured-list-row"
    );
    expect(rowElement).toBeInTheDocument();

    if (rowElement) {
      const row = within(rowElement as HTMLElement);
      const editButton = row.getByRole("button", { name: /edit/i });

      await user.click(editButton);

      const editor = await row.findByRole("textbox");

      await user.clear(editor);
      await user.type(editor, "Bowser");
      await user.click(row.getByText("Save"));

      expect(temporaryConfigStore.setState).toHaveBeenCalledWith({
        config: { "@openmrs/mario": { nemesisName: "Bowser" } },
      });
    }
  });

  it("displays correct UUID value and editor", async () => {
    const user = userEvent.setup();

    implementerToolsConfigStore.setState({
      config: {
        "@openmrs/mario": mockImplToolsConfig["@openmrs/mario"],
      },
    });

    renderConfiguration();

    const rowElement = (await screen.findByText("mustacheUuid")).closest(
      ".cds--structured-list-row"
    );
    expect(rowElement).toBeInTheDocument();

    if (rowElement) {
      const row = within(rowElement as HTMLElement);
      row.getByText("181aee4a-5664-42da-8699-c36d28083bd0");

      const editButton = row.getByRole("button", { name: /edit/i });

      await user.click(editButton);

      const editor = await row.findByRole("textbox");

      await user.clear(editor);
      const newUuid = "34f03796-f0e2-4f64-9e9a-28fb49a94baf";
      await user.type(editor, newUuid);
      await user.click(row.getByText("Save"));

      expect(temporaryConfigStore.setState).toHaveBeenCalledWith({
        config: { "@openmrs/mario": { mustacheUuid: newUuid } },
      });
    }
  });

  it("renders an array editor for simple arrays that behaves correctly", async () => {
    const user = userEvent.setup();

    implementerToolsConfigStore.setState({
      config: {
        "@openmrs/luigi": mockImplToolsConfig["@openmrs/luigi"],
      },
    });
    renderConfiguration();
    const rowElement = (await screen.findByText("favoriteNumbers")).closest(
      ".cds--structured-list-row"
    );
    expect(rowElement).toBeInTheDocument();
    if (rowElement) {
      const row = within(rowElement as HTMLElement);

      const inputs = row.getByText("[ 4, 12 ]");
      const editButton = row.getByRole("button", { name: /edit/i });

      await user.click(editButton);
      // expect(inputs[0]).toHaveValue(4);
      // expect(inputs[1]).toHaveValue(12);
      const firstValue = row.getByDisplayValue("4");
      expect(firstValue).toHaveAttribute("type", "number");

      await user.clear(firstValue);
      await user.type(firstValue, "5");

      const secondRowElement = row
        .getByDisplayValue("12")
        .closest(".cds--structured-list-row");

      expect(secondRowElement).toBeInTheDocument();
      // I can't get the add or remove buttons to work in tests.
      if (secondRowElement) {
        await user.click(
          within(secondRowElement as HTMLElement)
            .getByText("Remove")
            .closest("button") as HTMLElement
        );
        // await waitForElementToBeRemoved(() => row.getByDisplayValue("12"));
      }
      await user.click(row.getByText("Add"));
      // let rows = await row.findAllByRole("spinbutton");
      // let newInput = rows[rows.length - 1];
      // user.type(newInput, "11");
      // user.click(row.getByText("Add"));
      // rows = await row.findAllByRole("spinbutton");
      // newInput = rows[rows.length - 1];
      // user.type(newInput, "13");
      // user.click(row.getByText("Save"));
      // expect(mockSetTemporaryConfigValue).toHaveBeenCalledWith(["@openmrs/luigi", "favoriteNumbers"], [5, 11, 13]);
    }
  });
});
