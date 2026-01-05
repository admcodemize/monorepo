import { useQuery } from "convex/react";
import { Id } from "../../../../packages/backend/convex/_generated/dataModel";
import { api } from "../../../../packages/backend/convex/_generated/api";

import { useConvexUser } from "@/hooks/auth/useConvexUser";
import { useUserContextStore } from "@/context/UserContext";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.40
 * @version 0.0.1
 * @description Hook to use the linked mail accounts for the currently signed in user */
export function useLinkedMailAccounts() {
  const { convexUser } = useConvexUser();
  const settings = useUserContextStore((state) => state.settings);

  /** @description Reads all the linked mail accounts for the currently signed in user */
  const linkedMailAccounts = useQuery(api.sync.integrations.query.linkedWithMailPermission, convexUser?._id
    ? { userId: convexUser._id as Id<"users"> }
    : "skip");

  const isReady = Array.isArray(linkedMailAccounts);

  /**
   * @description Returns the linked mail account for the currently signed in user or undefined if no linked mail account is found
   * @function */
  const linkedMailAccount =() => {
    if (!isReady || linkedMailAccounts.length === 0) return undefined;
    if (settings?.defaultMailAccount) {
      const preferred = linkedMailAccounts.find((account) => account.email === settings.defaultMailAccount);
      if (preferred) return preferred;
    }
    return linkedMailAccounts[0];
  };

  return { 
    linkedMailAccounts, 
    linkedMailAccount,
    isReady
  };
}