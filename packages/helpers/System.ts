/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a promise which will be resolved when condition is equal to true
 * @since 0.0.1
 * @version 0.0.1
 * @function */
export const waitUntil = (condition: Function) => {
  const poll = (resolve: () => Promise<void>) => {
    if(condition()) resolve();
    else setTimeout((_: any) => poll(resolve), 400);
  }

  // @ts-ignore
  return new Promise(poll);
}