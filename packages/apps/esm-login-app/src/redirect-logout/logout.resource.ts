import { mutate } from 'swr';
import { logout } from '@openmrs/esm-framework/src/internal';

export async function performLogout() {
  await logout();

  // clear the SWR cache on logout, do not revalidate
  // taken from the SWR docs
  mutate(() => true, undefined, { revalidate: false });
}
