import * as React from "react";
import { ReactAction, useAction, useQuery } from "convex/react";
import { api } from "../../../../packages/backend/convex/_generated/api";
import { ConvexSettingsAPIProps, ConvexUsersAPIProps } from "@codemize/backend/Types";

import { getDefaultSettingsObject } from "@/helpers/User";
import { handleConvexError } from "@/helpers/Convex";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.1
 * @type */
type UseEventSettingsProps = {
  convexUser: ConvexUsersAPIProps;
  onFetchFinished: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description - Loads the settings for the currently signed in user
 * @since 0.0.15
 * @version 0.0.1
 * @param {Object} param0
 * @param {Function} param0.onFetchFinished - Callback function to handle the fetch finished event. */
export function useUserSettings({
  convexUser,
  onFetchFinished = () => {}
}: UseEventSettingsProps) {

    /** 
   * @description Creates the settings object for the currently signed in user if it doesn't exist
   * @see {@link convex/sync/settings/actions.ts} */
  const create: ReactAction<typeof api.sync.settings.action.create> = useAction(api.sync.settings.action.create);
  
  /**
   * @description Returns the user object based on signed in clerk identification
   * @see {@link convex/auth/query} */
  //const { userQuery, isReadyUser } = useConvexUser();

  /**
   * @description Get settings based on currently signed in user id 
   * @see {@link convex/sync/settings/query/get} */
  const settingsQuery = useQuery(api.sync.settings.query.get, { _id: convexUser._id });

  /**
   * @description Create the settings object for the currently signed in user if it doesn't exist
   * -> The useQuery will return an unique object, so if the following code block is failing or called multiple times, 
   * the settings object will be created multiple times and we will get an convex error during the query process!
   * @see {@link convex/sync/settings/actions.ts} */
  React.useEffect(() => {
    if (convexUser._id && settingsQuery === null) {
      create({ ...getDefaultSettingsObject(convexUser._id) })
        .then(({ hasErr, err }) => hasErr && handleConvexError(err));
    }
  }, [convexUser._id, settingsQuery]);
  
  /**
   * @description Call onFetchFinished only when real settings from DB are loaded */
  React.useEffect(() => {
    if (settingsQuery !== null) onFetchFinished();
  }, [settingsQuery, onFetchFinished]);

  return { 
    settings: settingsQuery as ConvexSettingsAPIProps, 
    isReady: settingsQuery !== null
  };
}