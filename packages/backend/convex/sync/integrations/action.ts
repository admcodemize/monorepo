"use node";
import { v } from "convex/values";
import { internalAction } from "../../_generated/server";
import crypto from "node:crypto";

import { EncryptedTokenProps } from "../../../Types";

const ALGO = "aes-256-gcm";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Encrypted token type
 * @since 0.0.9
 * @version 0.0.1
 * @type */
export type EncryptedToken = {
  iv: string;
  value: string;
  tag: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Converts a token to an encrypted string
 * @since 0.0.9
 * @version 0.0.2
 * @param {string} token - The token to convert */
export const encryptedToken = internalAction({
  args: { token: v.string() },
  handler: async (ctx, { token }): Promise<EncryptedToken> => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, convertToBase64Key(process.env.PROVIDER_CRYPTO_KEY), iv);
    return encryptedCipher(cipher, iv, token);
  }
});

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Converts an encrypted token to a decrypted string
 * @since 0.0.9
 * @version 0.0.2
 * @param {EncryptedTokenProps} encryptedToken - The encrypted token to convert */
export const decryptedToken = internalAction({
  args: { encryptedToken: v.object({
    iv: v.string(),
    value: v.string(),
    tag: v.string(),
  }) },
  handler: async (ctx, { encryptedToken }): Promise<string> => {
    const iv = Buffer.from(encryptedToken.iv, "base64");
    const decipher = crypto.createDecipheriv(ALGO, convertToBase64Key(process.env.PROVIDER_CRYPTO_KEY), iv);
    return decryptedCipher(decipher, encryptedToken);
  }
});  

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Converts a payload to an encrypted string
 * @since 0.0.21
 * @version 0.0.1
 * @param {string} payload - The payload to convert */
export const encryptedPayload = internalAction({
  args: { payload: v.string() },
  handler: async (ctx, { payload }): Promise<EncryptedToken> => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, convertToBase64Key(process.env.PAYLOAD_CRYPTO_KEY), iv);
    return encryptedCipher(cipher, iv, payload);
  }
});

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Converts an encrypted payload to a decrypted string
 * @since 0.0.21
 * @version 0.0.1
 * @param {EncryptedTokenProps} encryptedPayload - The encrypted payload to convert */
export const decryptedPayload = internalAction({
  args: { encryptedPayload: v.object({
    iv: v.string(),
    value: v.string(),
    tag: v.string(),
  }) },
  handler: async (ctx, { encryptedPayload }): Promise<string> => {
    const iv = Buffer.from(encryptedPayload.iv, "base64");
    const decipher = crypto.createDecipheriv(ALGO, convertToBase64Key(process.env.PAYLOAD_CRYPTO_KEY), iv);
    return decryptedCipher(decipher, encryptedPayload);
  }
});  

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Converts a key to a base64 string
 * @since 0.0.9
 * @version 0.0.1
 * @param {string} key - The key to convert */
const convertToBase64Key = (key: string): Buffer => Buffer.from(key, "base64");

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @description Encrypts a token using a cipher
 * @since 0.0.21
 * @version 0.0.1
 * @param {crypto.CipherGCM} cipher - The cipher to use -> An algorithm or set of rules used in cryptography to encrypt (scramble) and decrypt (unscramble) data
 * @param {Buffer} iv - The iv to use -> nitialization Vector (IV) is a non-secret, random (or unique) input that makes encryption stronger by ensuring identical plaintexts produce different ciphertexts, preventing pattern analysis by attackers
 * @param {string} token - The token to encrypt
 * @function */
const encryptedCipher = (
  cipher: crypto.CipherGCM, 
  iv: Buffer, 
  token: string
) => {
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString("base64"),
    value: encrypted.toString("base64"),
    tag: authTag.toString("base64"),
  };
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @description Decrypts a token using a decipher
 * @since 0.0.21
 * @version 0.0.1
 * @param {crypto.DecipherGCM} decipher - The decipher to use -> An algorithm or set of rules used in cryptography to decrypt (unscramble) data
 * @param {EncryptedTokenProps} encrypted - The encrypted token to decrypt
 * @function */
const decryptedCipher = (
  decipher: crypto.DecipherGCM,
  encrypted: EncryptedTokenProps,
) => {
  const _encrypted = Buffer.from(encrypted.value, "base64");
  const authTag = Buffer.from(encrypted.tag, "base64");
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(_encrypted), decipher.final()]);
  return decrypted.toString("utf8");  
}