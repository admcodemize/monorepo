
import { ConvexHandlerError } from "@codemize/backend/Fetch";
import { captureAsyncError } from "@codemize/helpers/Sentry";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description - Function to handle a convex error
 * @since 0.0.15
 * @version 0.0.1
 * @param {ConvexHandlerError} err - The error to handle
 * @function */
export const handleConvexError = (
  err: ConvexHandlerError|ConvexHandlerError[]|undefined,
) => {
  if (!err) return;

  /**
   * @description Capture the error message in Sentry
   * -> The property transferToSentry is used to prevent the error for transferring to sentry
   * -> This is a workaround to get the error message from the exception and display it to the user
   * -> The error handling is done in "Sentry.addEventProcessor"
   * @see {@link helpers/Sentry} */
  if (Array.isArray(err)) err.forEach((e) => _captureConvexError(e));
  else _captureConvexError(err);

  /**
   * @description Open the toast with the error message
   * @todo
   * @see {@link components/container/ToastRoot} */
  /*open({
    data: {
      title: Array.isArray(err) ? `${err[0].code} - ${err[0].name}` : `${err.code} - ${err.name}`,
      description: Array.isArray(err) ? err[0].info : err.info,
      icon
    }
  });*/
};

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @description - Function to capture a convex error
 * @since 0.0.15
 * @version 0.0.1
 * @param {ConvexHandlerError} err - The error to capture
 * @function */
const _captureConvexError = (
  err: ConvexHandlerError|undefined
) => {
  captureAsyncError({
    err: err!,
    level: "log",
    transferToSentry: false
  });
};