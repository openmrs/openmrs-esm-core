import React, { Suspense } from "react";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSession, __cleanup } from "./useSession.tsx";
import { createGlobalStore } from "@openmrs/esm-state";
import { SessionStore } from "@openmrs/esm-api";

const mockSessionStore = createGlobalStore<SessionStore>("mockSessionStore", {
  loaded: false,
  session: null,
});

jest.mock("@openmrs/esm-api", () => ({
  getSessionStore: jest.fn(() => mockSessionStore),
}));

function Component() {
  const session = useSession();
  return <div>{JSON.stringify(session)}</div>;
}

describe("useSession", () => {
  beforeEach(() => {
    __cleanup();
    mockSessionStore.setState({ loaded: false, session: null });
  });

  it("should suspend and then resolve to the session", async () => {
    render(
      <Suspense fallback={"suspended"}>
        <Component />
      </Suspense>
    );

    expect(screen.getByText("suspended")).toBeInTheDocument();
    act(() => {
      mockSessionStore.setState({
        loaded: true,
        session: { authenticated: false, sessionId: "test1" },
      });
    });
    await screen.findByText(/"authenticated":false/);
  });

  it("should resolve immediately when the session is present", async () => {
    mockSessionStore.setState({
      loaded: true,
      session: { authenticated: false, sessionId: "test2" },
    });
    render(
      <Suspense fallback={"suspended"}>
        <Component />
      </Suspense>
    );
    expect(screen.getByText(/"authenticated":false/)).toBeInTheDocument();
  });

  it("should not return stale data when re-created", async () => {
    const { unmount } = render(
      <Suspense fallback={"suspended"}>
        <Component />
      </Suspense>
    );
    expect(screen.getByText("suspended")).toBeInTheDocument();
    act(() => {
      mockSessionStore.setState({
        loaded: true,
        session: { authenticated: true, sessionId: "test3" },
      });
    });
    await screen.findByText(/"authenticated":true/);
    unmount();
    mockSessionStore.setState({
      loaded: true,
      session: { authenticated: false, sessionId: "test3" },
    });
    render(
      <Suspense fallback={"suspended"}>
        <Component />
      </Suspense>
    );
    expect(screen.getByText(/"authenticated":false/)).toBeInTheDocument();
  });
});
