import { createGlobalStore } from "@openmrs/esm-state";
import {
  LoggedInUser,
  getSession,
  createSession,
  deleteSession,
  updateUser,
  UnauthenticatedUser,
} from "@openmrs/esm-api";

export interface CurrentUserSession {
  sessionId: string;
  allowedLocals: Array<string>;
  locale: string;
  user: LoggedInUser;
  location?: {
    uuid: string;
    display: string;
  };
  provider: {
    uuid: string;
    display: string;
  };
}

interface UserState {
  session?: CurrentUserSession;
  lastRefresh?: number;
  credentials?: {
    name: string;
    pass: string;
  };
}

const state = createGlobalStore<UserState>("globalUserState", {});
const checkInterval = 1 * 60 * 1000; // every minute
const outdatedTime = 5 * 60 * 1000; // five minutes

setInterval(() => {
  const { lastRefresh } = state.getState();
  const now = Date.now();

  if (lastRefresh && lastRefresh + outdatedTime < now) {
    refreshExistingSession();
  }
}, checkInterval);

function refreshExistingSession() {
  const { session, credentials } = state.getState();

  if (credentials && session) {
    return getSession()
      .catch(() => createNewSession(credentials.name, credentials.pass))
      .then((res) => {
        state.setState({
          session: toSession(res),
          lastRefresh: Date.now(),
          credentials,
        });
      });
  }

  return Promise.resolve();
}

function createNewSession(name: string, pass: string) {
  const token = btoa(`${name}:${pass}`);
  return createSession(token);
}

function toSession(res: UnauthenticatedUser) {
  const {
    user,
    sessionId,
    allowedLocals,
    locale,
    sessionLocation,
    currentProvider,
  } = res;
  return (
    user && {
      sessionId,
      user,
      allowedLocals,
      locale,
      location: sessionLocation || undefined,
      provider: currentProvider,
    }
  );
}

export function logoutUser() {
  return deleteSession().then(() => {
    state.setState({
      session: undefined,
      lastRefresh: undefined,
      credentials: undefined,
    });
  });
}

export function loginUser(name: string, pass: string) {
  return createNewSession(name, pass).then((res) => {
    state.setState({
      session: toSession(res),
      lastRefresh: Date.now(),
      credentials: { name, pass },
    });
    return res.authenticated;
  });
}

export function getCurrentUser() {
  return state.getState().session?.user;
}

export function getCurrentUserSession() {
  return state.getState().session;
}

export function updateCurrentUser(properties: any) {
  const { session } = state.getState();

  if (session) {
    return updateUser(session.user.uuid, properties).then(
      refreshExistingSession
    );
  }

  return Promise.resolve();
}

export function subscribeCurrentUser(
  cb: (user: LoggedInUser | undefined) => void
) {
  cb(getCurrentUser());
  return state.subscribe(({ session }) => cb(session?.user));
}

export function subscribeCurrentUserSession(
  cb: (user: CurrentUserSession | undefined) => void
) {
  cb(getCurrentUserSession());
  return state.subscribe(({ session }) => cb(session));
}
