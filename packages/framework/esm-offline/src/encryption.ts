export const encryption = true;

export const encryptionConfig = {
  updated: false,
  password: ""
};

function encrypt(data: string) {
  return btoa(data);
}

function decrypt(data: string) {
  return atob(data);
}

/**
 * Encrypts data for dynamic caching
 * @param json response json data
 */
export function encryptCache(json: JSON) {
  let data = JSON.stringify(json);
  let encryptedData = encrypt(data);
  let encryptedJson = { content: encryptedData };

  return JSON.stringify(encryptedJson);
}

/**
 * Decrypts data for dynamic caching
 * @param json response json data
 */
export function decryptCache(json: JSON) {
  let data = json["content"];
  let decryptedData = decrypt(data);
  let decryptedJson = JSON.parse(decryptedData);

  return JSON.stringify(decryptedJson);
}

/**
 * Encrypts data for offline sync
 * @param json content json data
 */
export function encryptSyncData(json: JSON) {
  let data = JSON.stringify(json);

  return encrypt(data);
}

/**
 * Decrypts data for offline sync
 * @param data content string data
 */
export function decryptSyncData(data: string) {
  let decryptedData = decrypt(data);

  return JSON.parse(decryptedData);
}
