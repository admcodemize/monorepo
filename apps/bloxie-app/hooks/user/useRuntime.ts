import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../packages/backend/convex/_generated/api";
import { ConvexRuntimeAPIProps, ConvexUsersAPIProps } from "@codemize/backend/Types";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @type */
type UseRuntimeProps = {
  convexUser?: ConvexUsersAPIProps;
  onFetchFinished: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description - Loads the runtime informations for the currently signed in user based on their license model
 * -> The runtime informations contain the template variables and the license features and counter (how many linked providers and workflows are allowed/etc..)
 * @since 0.0.38
 * @version 0.0.1
 * @param {Object} param0
 * @param {Function} param0.onFetchFinished - Callback function to handle the fetch finished event. */
export function useRuntime({
  convexUser,
  onFetchFinished = () => {}
}: UseRuntimeProps) {
  /**
   * @description Get runtime based on currently signed in user license
   * @see {@link convex/sync/settings/query/get} */
  const runtimeQuery = useQuery(api.sync.runtime.query.get, convexUser?._id ? { license: convexUser.license } : "skip");
  const isReady = runtimeQuery !== null && runtimeQuery !== undefined;
  
  /** @description Call onFetchFinished only when real runtime from DB are loaded */
  React.useEffect(() => {
    if (isReady) onFetchFinished();
    console.log("runtimeQuery", runtimeQuery);
  }, [runtimeQuery, onFetchFinished]);

  return { 
    runtime: runtimeQuery as ConvexRuntimeAPIProps, 
    isReady 
  };
}