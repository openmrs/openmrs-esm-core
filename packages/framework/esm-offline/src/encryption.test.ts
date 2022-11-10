import { setCryptoKey, clearPasswordData, isPasswordExpired } from '@openmrs/esm-offline/src/encryption';
import { setPasswordData } from "./encryption";

const crypto = require('crypto');
Object.defineProperty(self, 'crypto', {
  value: {
    subtle: crypto.webcrypto.subtle,
    getRandomValues: (arr) => crypto.randomBytes(arr.length)
  }
});

describe("setPasswordData", () => {
    it("sets encryption reference and time in local storage", async () => {
        let localStorageSet = jest.spyOn(window.localStorage.__proto__, 'setItem');
        let key = await setCryptoKey("password");
        await setPasswordData(key);
        expect(localStorageSet).toHaveBeenCalledWith("encryptedReferenceContent", expect.anything());
        expect(localStorageSet).toHaveBeenCalledWith("encryptedReferenceNonce", expect.anything());
        expect(localStorageSet).toHaveBeenCalledWith("encryptedKeyCreationTime", expect.anything());
        expect(localStorageSet).toHaveBeenCalledTimes(3);
        localStorageSet.mockRestore();
    })
})

describe("clearPasswordData", () => {
    it("clears encryption reference and time in local storage", async () => {
        let localStorageRemove = jest.spyOn(window.localStorage.__proto__, 'removeItem');
        clearPasswordData();
        expect(localStorageRemove).toHaveBeenCalledWith("encryptedReferenceContent");
        expect(localStorageRemove).toHaveBeenCalledWith("encryptedReferenceNonce");
        expect(localStorageRemove).toHaveBeenCalledWith("encryptedKeyCreationTime");
        expect(localStorageRemove).toHaveBeenCalledTimes(3);
    })
})

describe("isPasswordExpired", () => {
    it("returns true if password expiry time is not set", async () => {
        jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(null);
        let result = isPasswordExpired();
        expect(result).toBe(true);
    })

    it("returns false if password expiry time has not passed", async () => {
        jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(Date.now().toString());
        let result = isPasswordExpired();
        expect(result).toBe(false);
    })

    it("returns true if password expiry time has passed", async () => {
        let expiredDate = new Date(Date.now() - 3600000 * 9);
        jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(expiredDate.getTime());
        let result = isPasswordExpired();
        expect(result).toBe(true);
    })
})