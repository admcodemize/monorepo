import * as Sentry from '@sentry/react-native';

import { ConvexHandlerError } from '@codemize/backend/Fetch';

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH
 * @since 0.0.1
 * @version 0.0.1
 * @type
 * @global */
type CaptureExceptionProps = {
  err: ConvexHandlerError;
  level?: Sentry.SeverityLevel;
  transferToSentry?: boolean;
} 

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH
 * @since 0.0.1
 * @version 0.0.1
 * @type
 * @global */
export type InitSentryProps = {
  version: string;
}

/**
 * @public
 * @description Used for initializing the sentry error tracking service
 * @author Marc Stöckli - Codemize GmbH
 * @since 0.0.1
 * @version 0.0.1
 * @param {InitSentryProps} param0 - The properties for initializing the sentry error tracking service
 * @param {string} param0.version - The version of the app
 * @function
 * @global */
export const initSentry = ({
  version,
}: InitSentryProps) => {
  /**
   * @description Used for connecting to the sentry error tracking service */
  Sentry.init({
    dsn: 'https://3355542c11ab7c1625ae58fe3dd42763@o4508302707195904.ingest.de.sentry.io/4508302708703312',
    sendDefaultPii: true,
    environment: "development",
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 10000,
    release: `com.codemize.bloxie@${version}`,
    dist: "1",
  });

  /**
   * @private
   * @author Marc Stöckli - Codemize GmbH
   * @since 0.0.1
   * @version 0.0.1
   * @description Used for adding additional information to the sentry error tracking service
   * -> This is a workaround to get the error message from the exception and display it to the user
   * -> Callback called during the following capture methods:
   *    - Sentry.captureException
   *    - Sentry.captureMessage
   *    - Sentry.captureEvent
   *    - Sentry.captureMessage
   * @param {Sentry.Event} event - The event to be processed
   * @param {Sentry.EventHint} hint - The hint for the event */
  Sentry.addEventProcessor(function (event, hint) {
    return (event.extra?.transferToSentry || true) ? event : null;
  });
}

/**
 * @public
 * @description Used for capturing the error message in Sentry
 * @author Marc Stöckli - Codemize GmbH
 * @since 0.0.1
 * @version 0.0.1
 * @param {CaptureExceptionProps} param0 - The properties for capturing the error
 * @param {ConvexHandlerError} param0.err - The error to be captured
 * @param {Sentry.SeverityLevel} param0.level - The severity level of the error
 * @param {boolean} param0.alertToUser - Whether to alert the user to the error
 * @param {boolean} param0.transferToSentry - Whether to transfer the error to Sentry
 * @function
 * @global */
export const captureAsyncError = ({
  err,
  level = "error",
  transferToSentry = true
}: CaptureExceptionProps) => {
  /** 
   * @description Capture the error message in Sentry
   * -> The property transfertToSentry is used to prevent the error for transferring to sentry
   * -> This is a workaround to get the error message from the exception and display it to the user
   * -> The error handling is done in "Sentry.addEventProcessor"
   * @see {@link helpers/Sentry} */
  captureException(err, level, transferToSentry);
}

/**
 * @public
 * @description Used for capturing the error message in Sentry
 * @author Marc Stöckli - Codemize GmbH
 * @since 0.0.1
 * @version 0.0.1
 * @param {ConvexHandlerError} err - The error to be captured
 * @param {Sentry.SeverityLevel} level - The severity level of the error
 * @param {boolean} transferToSentry - Whether to transfer the error to Sentry 
 * @see {@link helpers/Sentry}
 * @function
 * @global */
export const captureException = (
  err: ConvexHandlerError|Error,
  level?: Sentry.SeverityLevel,
  transferToSentry?: boolean
) => Sentry.captureException(err, { level, extra: { transferToSentry } });