import { deleteAllSynchronizationItems } from "../sync";

export async function clearEncryptedData() {
  await deleteAllSynchronizationItems();
}

export function clearCache() {

}