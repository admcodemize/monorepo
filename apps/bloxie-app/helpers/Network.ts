import * as Network from "expo-network";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Adds a network state listener for displaying a toast if the network is not connected
 * @since 0.0.1
 * @version 0.0.1 */
Network.addNetworkStateListener((state) => {
  console.log('Network state changed:', state);
});

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Checks if the network is connected
 * @since 0.0.1
 * @version 0.0.1 */
export const isNetworkConnected = async () => await Network.getNetworkStateAsync();

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Checks if airplane mode is enabled
 * @since 0.0.1
 * @version 0.0.1 */
export const isAirplaneModeEnabled = async () => await Network.isAirplaneModeEnabledAsync();

export default Network;
