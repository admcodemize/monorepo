import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../packages/backend/convex/_generated/api";
import { ConvexSettingsAPIProps, ConvexUsersAPIProps } from "@codemize/backend/Types";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.2
 * @type */
type UseEventSettingsProps = {
  convexUser?: ConvexUsersAPIProps;
  onFetchFinished: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description - Loads the settings for the currently signed in user
 * @since 0.0.15
 * @version 0.0.2
 * @param {Object} param0
 * @param {Function} param0.onFetchFinished - Callback function to handle the fetch finished event. */
export function useUserSettings({
  convexUser,
  onFetchFinished = () => {}
}: UseEventSettingsProps) {
  /**
   * @description Get settings based on currently signed in user id 
   * @see {@link convex/sync/settings/query/get} */
  const settingsQuery = useQuery(api.sync.settings.query.get, convexUser?._id ? { _id: convexUser._id } : "skip");
  const isReady = settingsQuery !== null && settingsQuery !== undefined;
  
  /** @description Call onFetchFinished only when real settings from DB are loaded */
  React.useEffect(() => {
    if (isReady) onFetchFinished();
  }, [settingsQuery, onFetchFinished]);

  return { 
    settings: settingsQuery as ConvexSettingsAPIProps, 
    isReady
  };
}