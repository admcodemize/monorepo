import * as React from "react";

import { useQuery } from "convex/react";
import { api } from "../../../../packages/backend/convex/_generated/api";
import { Id } from "../../../../packages/backend/convex/_generated/dataModel";
import { ConvexCalendarQueryAPIProps } from "../../../../packages/backend/Types";
import { ConvexUsersAPIProps } from "../../../../packages/backend/Types";

import { useIntegrationContextStore } from "@/context/IntegrationContext";

/**
 * @private
 * @description Props for the useIntegrations hook
 * @since 0.0.13
 * @version 0.0.2
 * @type */
type UseIntegrationsProps = {
  convexUser: ConvexUsersAPIProps|undefined;
  onFetchFinished: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description - Sets the integrations stored in convex
 * @since 0.0.13
 * @version 0.0.1 */
export function useIntegrations({
  convexUser,
  onFetchFinished = () => {},
}: UseIntegrationsProps) {
  /**
   * @description Handles the state update for displaying all the linked integrations for the signed in user
   * @see {@link context/CalendarContext} */
  const setIntegrations = useIntegrationContextStore((state) => state.setIntegrations);

  /**
  * @description Get integrations based on currently signed in user id
  * @see {@link convex/sync/events/query/get}*/
  const queriedIntegrations = useQuery(api.sync.integrations.query.get, { 
    userId: convexUser?._id as Id<"users">,
  });

  const isReady = queriedIntegrations !== undefined && queriedIntegrations !== null;
  const integrations: ConvexCalendarQueryAPIProps[] = Array.isArray(queriedIntegrations) ? queriedIntegrations : [];

  React.useEffect(() => {
    if (integrations instanceof Array && integrations.length > 0) {
      integrations.forEach((integration) => {
        setIntegrations([...integrations, integration]);
      });

      /**
       * @description Update integrations based on convex selection */
      setIntegrations(integrations);
    } if (isReady) onFetchFinished();
  }, [integrations, isReady, setIntegrations, onFetchFinished]);
}