"use node";
import { v } from "convex/values";
import { internalAction } from "../../_generated/server";
import crypto from "node:crypto";

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
 * @version 0.0.1
 * @param {string} token - The token to convert */
export const encryptedToken = internalAction({
  args: { token: v.string() },
  handler: async (ctx, { token }): Promise<EncryptedToken> => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, convertToBase64Key(process.env.PROVIDER_CRYPTO_KEY), iv);
    const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
      iv: iv.toString("base64"),
      value: encrypted.toString("base64"),
      tag: authTag.toString("base64"),
    };
  }
});

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Converts an encrypted token to a decrypted string
 * @since 0.0.9
 * @version 0.0.1
 * @param {EncryptedTokenProps} encryptedToken - The encrypted token to convert */
export const decryptedToken = internalAction({
  args: { encryptedToken: v.object({
    iv: v.string(),
    value: v.string(),
    tag: v.string(),
  }) },
  handler: async (ctx, { encryptedToken }): Promise<string> => {
    const iv = Buffer.from(encryptedToken.iv, "base64");
    const encrypted = Buffer.from(encryptedToken.value, "base64");
    const authTag = Buffer.from(encryptedToken.tag, "base64");
    const decipher = crypto.createDecipheriv(ALGO, convertToBase64Key(process.env.PROVIDER_CRYPTO_KEY), iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");  
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
