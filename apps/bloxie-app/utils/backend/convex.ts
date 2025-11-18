import { ConvexReactClient } from "convex/react";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH
 * @description Used for connecting to the convex database
 * @since 0.0.8
 * @version 0.0.1
 * @function */
export const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, { unsavedChangesWarning: false });