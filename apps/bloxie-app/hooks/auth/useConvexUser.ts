import { api } from "../../../../packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";

import { useUser } from "@clerk/clerk-expo";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the user object based on signed in clerk identification
 * @since 0.0.16
 * @version 0.0.1 */
export function useConvexUser() {
  /**
   * @description Hook is needed to get the convex user object
   * @see {@link clerk/clerk-expo} */
  const { user } = useUser();
  
  /** 
   * @description Returns the user object based on signed in clerk identification
   * @see {@link convex/auth/query} */
  const userQuery = useQuery(api.auth.query.getUserByClerkId, { clerkId: user?.id });
  const isReady = userQuery !== null && userQuery !== undefined;

  return { 
    convexUser: userQuery, 
    isReady 
  };
}