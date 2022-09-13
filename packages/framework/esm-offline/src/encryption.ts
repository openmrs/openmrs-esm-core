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
  var data = JSON.stringify(json);
  var encryptedData = encrypt(data);
  var encryptedJson = { content: encryptedData };

  return JSON.stringify(encryptedJson);
}

/**
 * Decrypts data for dynamic caching
 * @param json response json data
 */
export function decryptCache(json: JSON) {
  var data = json["content"];
  var decryptedData = decrypt(data);
  var decryptedJson = JSON.parse(decryptedData);

  return JSON.stringify(decryptedJson);
}

/**
 * Encrypts data for offline sync
 * @param json content json data
 */
export function encryptSyncData(json: JSON) {
  var data = JSON.stringify(json);

  return encrypt(data);
}

/**
 * Decrypts data for offline sync
 * @param data content string data
 */
export function decryptSyncData(data: string) {
  var decryptedData = decrypt(data);

  return JSON.parse(decryptedData);
}
