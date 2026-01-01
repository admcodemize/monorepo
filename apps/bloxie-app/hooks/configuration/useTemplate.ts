import * as React from "react";

import { useQuery } from "convex/react";
import { api } from "../../../../packages/backend/convex/_generated/api";
import { Id } from "../../../../packages/backend/convex/_generated/dataModel";
import { ConvexTemplateAPIProps } from "@codemize/backend/Types";
import { ConvexUsersAPIProps } from "@codemize/backend/Types";

import { useConfigurationContextStore } from "@/context/ConfigurationContext";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.37
 * @version 0.0.1
 * @type */
type UseTemplatesProps = {
  convexUser?: ConvexUsersAPIProps;
  onFetchFinished: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description - Sets the templates stored in convex
 * @since 0.0.37
 * @version 0.0.1 */
export function useTemplates({
  convexUser,
  onFetchFinished = () => {},
}: UseTemplatesProps) {
  /**
   * @description Handles the state update for displaying all the templates for the signed in user
   * @see {@link context/CalendarContext} */
  const setTemplates = useConfigurationContextStore((state) => state.setTemplates);

  /**
  * @description Get templates based on currently signed in user id and also the templates declared by the system as global
  * @see {@link convex/sync/events/query/get}*/
  const queriedUserTemplates = useQuery(
    api.sync.template.query.get,
    convexUser?._id ? { _id: convexUser._id as Id<"users"> } : "skip"
  );

  const isReady = queriedUserTemplates !== undefined && queriedUserTemplates !== null;
  const templates: ConvexTemplateAPIProps[] = Array.isArray(queriedUserTemplates) ? queriedUserTemplates : [];

  React.useEffect(() => {
    if (!isReady) return;

    /**
     * @description Update templates based on convex selection */
    setTemplates(templates);
    onFetchFinished();
  }, [templates, isReady, setTemplates, onFetchFinished]);
}