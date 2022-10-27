export const encryption = true;

class EncryptionConfig {
  key: CryptoKey 
};

var encryptionConfig: EncryptionConfig = new EncryptionConfig(); 

async function getCryptoKey(password: string = "") {
  if(encryptionConfig.key) {
    return encryptionConfig.key;
  }
  else {
    encryptionConfig.key = await generateCryptoKey(password);
    return encryptionConfig.key;
  }
}

export async function encryptData(data: string) {
  let key = await getCryptoKey('password');
  return await encrypt(data, key);
}

export async function decryptData(data: ArrayBuffer, nonce: BufferSource | Algorithm) {
  let key = await getCryptoKey('password');
  return await decrypt(data, key, nonce);
}

/**
 * Returns the crypto object depending on browser support.
 * IE11 has support for the Crypto API, but it is in a different global scope.
 *
 * @returns The Crypto object.
 */
export function getCryptoObject(): Crypto {
  return self.crypto; // for IE 11
}

/**
 * Creates a Crypto Key from the input string.
 *
 * @param input The original key to start the encrypt process.
 * @returns A promise with the base Crypto Key.
 */
export function generateCryptoKey(input: string): Promise<CryptoKey> {
  let algorithm: string = 'AES-GCM';
  let keyUsages: KeyUsage[] = ['encrypt','decrypt'];
  let format: KeyFormat = 'raw';
  return Promise.resolve(
    getCryptoObject().subtle.importKey(
      format,
      encode(input),
      algorithm,
      false, // the original value will not be extractable
      keyUsages,
    )
  );
}

/**
 * Encrypt a value with the given Crypto Key and Algorithm
 *
 * @param data Value to be encrypted.
 * @param cryptoKey The Crypto Key to be used in encryption.
 * @returns A promise with the encrypted value and the used nonce, if used with the encryption algorithm.
 */
export function encrypt(data: string, cryptoKey: CryptoKey): Promise<[ArrayBuffer, BufferSource | null]> {
  let algorithm = { name: 'AES-GCM', iv: generateNonce() } as AesGcmParams;
  return Promise.resolve(
    getCryptoObject().subtle.encrypt(algorithm, cryptoKey, encode(data)),
  ).then(cryptoValue => [
    cryptoValue,
    algorithm ? algorithm.iv : null,
  ]);
}

/**
 * Decrypt a value with the given Crypto Key and Algorithm
 *
 * @param data Value to be encrypted.
 * @param cryptoKey The Crypto Key used in encryption.
 * @param nonceOrAlgorithm The nonce used for AES encryption or the custom algorithm.
 * @returns A promise with the decrypt value
 */
export function decrypt(
  data: ArrayBuffer,
  cryptoKey: CryptoKey,
  nonceOrAlgorithm: BufferSource | Algorithm,
): Promise<string> {
  const algorithm = isTypedArray(nonceOrAlgorithm)
    ? ({ name: 'AES-GCM', iv: nonceOrAlgorithm } as AesGcmParams)
    : nonceOrAlgorithm;
  return Promise.resolve((getCryptoObject().subtle.decrypt(algorithm, cryptoKey, data))
    .then((buffer) => decode(buffer)));
}

/**
 * Generates random value as a typed array of `Uint8Array`.
 *
 * @param byteSize The byte size of the generated random value.
 * @returns The random value.
 */
export function generateRandomValues(byteSize = 8): Uint8Array {
  return getCryptoObject().getRandomValues(new Uint8Array(byteSize));
}

/**
 * Generates random value to be used as nonce with encryption algorithms.
 *
 * @param byteSize The byte size of the generated random value.
 * @returns The random value.
 */
export function generateNonce(byteSize = 16): Uint8Array {
  // We should generate at least 16 bytes
  // to allow for 2^128 possible variations.
  return generateRandomValues(byteSize);
}

/**
 * Encode a string value to an ArrayBuffer.
 *
 * @param data Value to be encoded.
 * @returns The transformed given value as an ArrayBuffer.
 */
export function encode(data: string): ArrayBuffer {
  var arr = new Uint16Array(data.length);
  for (var i = data.length; i--; ) arr[i] = data.charCodeAt(i);
  return arr.buffer;
}

/**
 * Decode a ArrayBuffer value to a string.
 *
 * @param data Value to be decoded.
 * @returns The transformed given value as a string.
 */
export function decode(data: ArrayBuffer): string {
  var arr = new Uint16Array(data);
  var str = String.fromCharCode.apply(String, arr);
  return str;
}

/**
 * Type Guard to Typed Array.
 *
 * @param data Any data to be checked.
 * @returns Verify if the given data is a Typed Array.
 */
export function isTypedArray(data: unknown): data is BufferSource {
  return ArrayBuffer.isView(data) || data instanceof ArrayBuffer;
}

/**
 * Web Crypto Demo
 * 
//  /**
//  * Returns the crypto object depending on browser support.
//  * IE11 has support for the Crypto API, but it is in a different global scope.
//  *
//  * @returns The Crypto object.
//  */
// function getCryptoObject() {
//   return window.crypto; // for IE 11
// }

// /**
//  * Creates a Crypto Key from the input string.
//  *
//  * @param input The original key to start the encrypt process.
//  * @returns A promise with the base Crypto Key.
//  */
// function generateCryptoKey(input) {
//   let algorithm = "AES-GCM";
//   let keyUsages = ["encrypt", "decrypt"];
//   let format = "raw";
//   return Promise.resolve(
//     getCryptoObject().subtle.importKey(
//       format,
//       encode(input),
//       algorithm,
//       false, // the original value will not be extractable
//       keyUsages
//     )
//   );
// }

// /**
//  * Encrypt a value with the given Crypto Key and Algorithm
//  *
//  * @param data Value to be encrypted.
//  * @param cryptoKey The Crypto Key to be used in encryption.
//  * @returns A promise with the encrypted value and the used nonce, if used with the encryption algorithm.
//  */
// function encrypt(data, cryptoKey) {
//   let algorithm = { name: "AES-GCM", iv: generateNonce() };
//   return Promise.resolve(
//     getCryptoObject().subtle.encrypt(algorithm, cryptoKey, encode(data))
//   ).then((cryptoValue) => [cryptoValue, algorithm ? algorithm.iv : null]);
// }

// /**
//  * Decrypt a value with the given Crypto Key and Algorithm
//  *
//  * @param data Value to be encrypted.
//  * @param cryptoKey The Crypto Key used in encryption.
//  * @param nonceOrAlgorithm The nonce used for AES encryption or the custom algorithm.
//  * @returns A promise with the decrypt value
//  */
// function decrypt(data, cryptoKey, nonceOrAlgorithm) {
//   const algorithm = isTypedArray(nonceOrAlgorithm)
//     ? { name: "AES-GCM", iv: nonceOrAlgorithm }
//     : nonceOrAlgorithm;
//   return Promise.resolve(
//     getCryptoObject()
//       .subtle.decrypt(algorithm, cryptoKey, data)
//       .then((buffer) => decode(buffer))
//   );
// }

// /**
//  * Generates random value as a typed array of `Uint8Array`.
//  *
//  * @param byteSize The byte size of the generated random value.
//  * @returns The random value.
//  */
// function generateRandomValues(byteSize = 8) {
//   return getCryptoObject().getRandomValues(new Uint8Array(byteSize));
// }

// /**
//  * Generates random value to be used as nonce with encryption algorithms.
//  *
//  * @param byteSize The byte size of the generated random value.
//  * @returns The random value.
//  */
// function generateNonce(byteSize = 16) {
//   // We should generate at least 16 bytes
//   // to allow for 2^128 possible variations.
//   return generateRandomValues(byteSize);
// }

// /**
//  * Encode a string value to an ArrayBuffer.
//  *
//  * @param data Value to be encoded.
//  * @returns The transformed given value as an ArrayBuffer.
//  */
// function encode(data) {
//   var arr = new Uint16Array(data.length);
//   for (var i = data.length; i--; ) arr[i] = data.charCodeAt(i);
//   return arr.buffer;
// }

// /**
//  * Decode a ArrayBuffer value to a string.
//  *
//  * @param data Value to be decoded.
//  * @returns The transformed given value as a string.
//  */
// function decode(data) {
//   var arr = new Uint16Array(data);
//   var str = String.fromCharCode.apply(String, arr);
//   return str;
// }

// /**
//  * Type Guard to Typed Array.
//  *
//  * @param data Any data to be checked.
//  * @returns Verify if the given data is a Typed Array.
//  */
// function isTypedArray(data) {
//   return ArrayBuffer.isView(data) || data instanceof ArrayBuffer;
// }

// /**
//  * Encryption Demo
//  */
// var key = generateCryptoKey("password");
// key.then((key) => {
//   console.log("key", key);
//   var encryptResult = encrypt("Hello World", key);
//   encryptResult.then((encryptResult) => {
//     console.log("cipher", decode(encryptResult[0]));
//     console.log("nonce", decode(encryptResult[1]));

//     var decryptResult = decrypt(encryptResult[0], key, encryptResult[1]);
//     decryptResult.then((decryptResult) => {
//       console.log("decrypt", decryptResult);
//     });
//   });
// });

// var subtleCrypto = crypto.subtle;

// const key = async () => await window.crypto.subtle.generateKey(
//     {
//       name: "AES-GCM",
//       length: 256,
//     },
//     true,
//     ["encrypt", "decrypt"]
// );
// let localKey = await key();

// const iv = window.crypto.getRandomValues(new Uint8Array(12));
// const algorithm = { name: "AES-GCM", iv: iv };

// async function encrypt(message: string) {
//   const encodedMessage = new TextEncoder().encode(message);

//   var ciperText = await subtleCrypto
//     .encrypt(algorithm, localKey, encodedMessage)
//     .then((buffer) => arrayBufferToString(buffer));

//   return ciperText;
// }

// async function decrypt(cipher: string) {
//   var plainText = await subtleCrypto
//     .decrypt(algorithm, localKey, stringToArrayBuffer(cipher))
//     .then((buffer) => arrayBufferToString(buffer));

//   return plainText;
// }

// function stringToArrayBuffer(str: string) {
//   var arr = new Uint8Array(str.length);
//   for (var i = str.length; i--; ) arr[i] = str.charCodeAt(i);
//   return arr.buffer;
// }

// function arrayBufferToString(buffer: ArrayBuffer) {
//   var arr = new Uint8Array(buffer);
//   var str = String.fromCharCode.apply(String, arr);
//   return str;
// }
