import * as SecureStore from "expo-secure-store";
import { TokenCache } from "@clerk/clerk-expo";

import { fetchTyped } from "@codemize/backend/Fetch";

import { isWeb } from "@/helpers/System";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the stored token cache (active user session) by clerk
 * @since 0.0.8
 * @version 0.0.1
 * @function */
const createTokenCache = (): TokenCache => {
  return {
    /**
     * @author Marc Stöckli - Codemize GmbH 
     * @description Returns an existing token if found */
    getToken: async (key: string) => {
      const [err, item] = await fetchTyped(SecureStore.getItemAsync(key));
      if (err) {
        await fetchTyped(SecureStore.deleteItemAsync(key));
        return null;
      }

      return item;
    },
    /**
     * @author Marc Stöckli - Codemize GmbH 
     * @description Creates a new token */
    saveToken: (key: string, token: string) => SecureStore.setItemAsync(key, token),
  }
}

/**
 * @public
 * @description SecureStore is not supported on the web
 * @since 0.0.8
 * @version 0.0.1
 * @function */
export const tokenCache = isWeb() ? undefined : createTokenCache()