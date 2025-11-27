import { ConvexError } from "convex/values";

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
 * @version 0.0.1
 * @type
 * @global */
export type ConvexHandlerError = {
  code: number;
  info: string;
  severity: string;
  name: string;
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
 * @version 0.0.1 */
export const fetchTypedConvex = async <T>(
  promise: Promise<T>
): Promise<[ConvexError<ConvexHandlerError> | undefined, T | undefined]> => {
  try {
    const data = await promise;
    return [undefined, data];
  } catch (err: any) {
    if (err instanceof ConvexError) return [err, undefined];
    return [new ConvexError({
      code: 500,
      info: "Unexpected error occurred",
      severity: "error",
      name: "UnexpectedError"
    }), undefined];
  }
};