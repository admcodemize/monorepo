import * as React from "react";

import { useQuery } from "convex/react";
import { api } from "../../../../packages/backend/convex/_generated/api";
import { Id } from "../../../../packages/backend/convex/_generated/dataModel";
import { ConvexWorkflowQueryAPIProps } from "@codemize/backend/Types";
import { ConvexUsersAPIProps } from "@codemize/backend/Types";

import { useConfigurationContextStore } from "@/context/ConfigurationContext";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.37
 * @version 0.0.2
 * @type */
type UseWorkflowsProps = {
  convexUser?: ConvexUsersAPIProps;
  onFetchFinished?: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description - Sets the workflows stored in convex
 * @since 0.0.37
 * @version 0.0.1 */
export function useWorkflows({
  convexUser,
  onFetchFinished = () => {},
}: UseWorkflowsProps) {
  /**
   * @description Handles the state update for displaying all the linked workflows for the signed in user
   * @see {@link context/CalendarContext} */
  const setWorkflows = useConfigurationContextStore((state) => state.setWorkflows);

  /**
  * @description Get workflows based on currently signed in user id
  * @see {@link convex/sync/events/query/get}*/
  const queriedWorkflows = useQuery(
    api.sync.workflow.query.get,
    convexUser?._id ? { _id: convexUser._id as Id<"users"> } : "skip"
  );

  const isReady = queriedWorkflows !== undefined && queriedWorkflows !== null;
  const workflows: ConvexWorkflowQueryAPIProps[] = Array.isArray(queriedWorkflows) ? queriedWorkflows : [];

  React.useEffect(() => {
    if (!isReady) return;
    /**
     * @description Update integrations based on convex selection */
    setWorkflows(workflows);
    onFetchFinished();
  }, [workflows, isReady, setWorkflows, onFetchFinished]);
}