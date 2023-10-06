import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ChangeLocale } from "./change-locale.component";
import type {
  PostSessionLocale,
  PostUserProperties,
} from "./change-locale.resource";
import { useSession } from "@openmrs/esm-framework";

jest.mock("@openmrs/esm-framework", () => ({
  ...(jest.requireActual("@openmrs/esm-framework") as any),
  useSession: jest.fn(),
}));

const allowedLocales = ["en", "fr", "it", "pt"];
const user: any = {
  uuid: "uuid",
  userProperties: {
    defaultLocale: "fr",
  },
};

describe(`<ChangeLocale />`, () => {
  let postUserPropertiesMock: PostUserProperties = jest.fn(() =>
    Promise.resolve()
  );
  let postSessionLocaleMock: PostSessionLocale = jest.fn(() =>
    Promise.resolve()
  );

  it("should have user's defaultLocale as initial value", async () => {
    postUserPropertiesMock = jest.fn(() => Promise.resolve());
    postSessionLocaleMock = jest.fn(() => Promise.resolve());
    (useSession as jest.Mock).mockReturnValue({
      locale: "en",
      allowedLocales,
      user,
    });

    render(
      <ChangeLocale
        postUserProperties={postUserPropertiesMock}
        postSessionLocale={postSessionLocaleMock}
      />
    );
    expect(screen.getByLabelText(/Select locale/)).toHaveValue("fr");
  });

  it("should have session locale as initial value if no defaultLocale for user found", async () => {
    postUserPropertiesMock = jest.fn(() => Promise.resolve());
    postSessionLocaleMock = jest.fn(() => Promise.resolve());
    (useSession as jest.Mock).mockReturnValue({
      locale: "en",
      allowedLocales,
      user: {
        ...user,
        userProperties: {},
      },
    });
    const wrapper = render(
      <ChangeLocale
        postUserProperties={postUserPropertiesMock}
        postSessionLocale={postSessionLocaleMock}
      />
    );
    expect(wrapper.getByLabelText(/Select locale/)).toHaveValue("en");
  });

  it("should change user locale", async () => {
    postUserPropertiesMock = jest.fn(() => Promise.resolve());
    postSessionLocaleMock = jest.fn(() => Promise.resolve());
    (useSession as jest.Mock).mockReturnValue({
      locale: "en",
      allowedLocales: allowedLocales,
      user: user,
    });
    render(
      <ChangeLocale
        postUserProperties={postUserPropertiesMock}
        postSessionLocale={postSessionLocaleMock}
      />
    );
    expect(screen.getByLabelText(/Select locale/)).toHaveValue("fr");
    fireEvent.change(screen.getByLabelText(/Select locale/i), {
      target: { value: "en" },
    });
    await waitFor(() => {
      expect(postUserPropertiesMock).toHaveBeenCalledWith(
        user.uuid,
        { defaultLocale: "en" },
        expect.anything()
      );
      expect(postSessionLocaleMock).toHaveBeenCalledWith(
        "en",
        expect.anything()
      );
    });
  });
});
