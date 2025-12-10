import { ConvexError } from "convex/values";
import { ConvexActionReturnProps, ConvexActionServerityEnum } from "./Types";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH
 * @description Convex handler promise props which is used for returning errors from actions
 * @since 0.0.1
 * @version 0.0.1
 * @type
 * @global */
export type ConvexHandlerPromiseProps = { 
  hasErr: boolean;
  err?: ConvexHandlerError|ConvexHandlerError[];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Convex handler error object which is used for returning errors from actions
 * @since 0.0.1
 * @version 0.0.2
 * @type
 * @global */
export type ConvexHandlerError = {
  code?: number;
  info?: string;
  severity?: string;
  name?: string;
  _id?: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Data fetching with generic type 
 * @since 0.0.1
 * @version 0.0.1 */
export const fetchTyped = async <T, E extends new (message?: string) => Error>(
  promise: Promise<T>,
  catchErrors?: E[]
): Promise<[undefined, T]|[InstanceType<E>]> => {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T]
    })
    .catch((err) => {
      if (catchErrors === undefined) return [err];
      if (catchErrors && catchErrors.some((e) => err instanceof e)) return [err];
      return [err];
    })
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Data fetching with generic type and convex error
 * @since 0.0.1
 * @version 0.0.2 */
export const fetchTypedConvex = async <T>(
  promise: Promise<T>,
  name?: string
): Promise<[ConvexError<ConvexHandlerError> | undefined, T | undefined]> => {
  try {
    const data = await promise;
    return [undefined, data];
  } catch (err: any) {
    if (err instanceof ConvexError) return [err, undefined];
    return [new ConvexError(convexError({ code: 500 })), undefined];
  }
};

/**
 * @public
 * @since 0.0.21
 * @version 0.0.1
 * @description Creates a convex error object
 * @param {ConvexHandlerError} param0
 * @param {number} param0.code - The code of the error
 * @param {string} param0.info - The info of the error
 * @param {string} param0.severity - The severity of the error
 * @param {string} param0.name - The name of the error -> Used for identifying the error in the codebase and within sentry.io
 * @function */
export const convexError = ({
  code = 400,
  info = "BLOXIE_E00",
  severity = ConvexActionServerityEnum.ERROR,
  name = "UnexpectedError",
}: ConvexHandlerError): ConvexHandlerError => ({ code, severity, name, info });

/**
 * @public
 * @since 0.0.21
 * @version 0.0.1
 * @description Handles the response for all the convex actions and mutations
 * @todo Add a message object to a notificiations schema which contains typed messages such as internal, etc..
 * @param {ConvexActionReturnProps<T>} param0
 * @function */
export const convexResponse = <T>({
  data = null as T,
  convex,
}: ConvexActionReturnProps<T>): Response => new Response(JSON.stringify({
  data,
  convex: convex ?? {
    code: 400,
    severity: ConvexActionServerityEnum.ERROR,
  },
}), { status: convex?.code ?? 400 });