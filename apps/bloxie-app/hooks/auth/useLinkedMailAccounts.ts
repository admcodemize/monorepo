import React from "react";
import { useQuery } from "convex/react";
import { Id } from "../../../../packages/backend/convex/_generated/dataModel";
import { api } from "../../../../packages/backend/convex/_generated/api";

import { useConvexUser } from "@/hooks/auth/useConvexUser";
import { ConvexLinkedAPIProps } from "@codemize/backend/Types";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.45
 * @version 0.0.1
 * @type */
export type UseLinkedMailAccountsProps = {
  onFetchFinished: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.40
 * @version 0.0.2
 * @description Hook to use the linked mail accounts for the currently signed in user */
export function useLinkedMailAccounts({
  onFetchFinished = () => {}
}: UseLinkedMailAccountsProps) {
  const { convexUser } = useConvexUser();

  /** @description Reads all the linked mail accounts for the currently signed in user */
  const linkedMailAccounts = useQuery(api.sync.integrations.query.linkedWithMailPermission, convexUser?._id
    ? { userId: convexUser._id as Id<"users"> }
    : "skip");

  const isReady = Array.isArray(linkedMailAccounts);

  /** @description Call onFetchFinished only when real linked mail accounts from DB are loaded */
  React.useEffect(() => {
    if (isReady) onFetchFinished();
  }, [linkedMailAccounts, onFetchFinished]);

  return { 
    linkedMailAccounts: linkedMailAccounts as ConvexLinkedAPIProps[], 
    isReady
  };
}