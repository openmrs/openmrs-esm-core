import { request } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Where each session's cookies are written. A spec that ends its session needs its own, or it logs
 * out the session every other spec is using and they fail wherever the run happens to have got to.
 *
 * https://playwright.dev/docs/auth#reuse-signed-in-state
 */
export const storageStatePaths = {
  shared: 'e2e/storageState.json',
  logout: 'e2e/storageState.logout.json',
};

/** Logs in over the API and saves the session, so specs do not each pay for an interactive login. */
async function createSession(path: string) {
  const requestContext = await request.newContext();
  const token = Buffer.from(`${process.env.E2E_USER_ADMIN_USERNAME}:${process.env.E2E_USER_ADMIN_PASSWORD}`).toString(
    'base64',
  );
  await requestContext.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/session`, {
    data: {
      sessionLocation: process.env.E2E_LOGIN_DEFAULT_LOCATION_UUID,
      locale: 'en',
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
  });
  await requestContext.storageState({ path });
  await requestContext.dispose();
}

async function globalSetup() {
  for (const path of Object.values(storageStatePaths)) {
    await createSession(path);
  }
}

export default globalSetup;
