import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ChangeLocale } from "./change-locale.component";
import type {
  PostSessionLocale,
  PostUserProperties,
} from "./change-locale.resource";

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

  beforeEach(() => {
    postUserPropertiesMock = jest.fn(() => Promise.resolve());
    postSessionLocaleMock = jest.fn(() => Promise.resolve());

    render(
      <ChangeLocale
        allowedLocales={allowedLocales}
        user={user}
        postUserProperties={postUserPropertiesMock}
        postSessionLocale={postSessionLocaleMock}
      />
    );
  });

  it("should have user's defaultLocale as initial value", async () => {
    expect(screen.getByLabelText(/Select locale/)).toHaveValue("fr");
  });

  it("should change user locale", async () => {
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
