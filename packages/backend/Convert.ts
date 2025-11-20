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
 * @description Returns a javascript based date
 * @since 0.0.2
 * @version 0.0.1
 * @param {Date} now - Initial start/end date */
export const convertFromConvex = (now: string) => new Date(now);