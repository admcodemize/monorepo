import { TrayProvider } from "react-native-trays";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { stackConfigs, trays } from "@/helpers/Trays";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.5
 * @component */
const ModalAccountLayout = () => {
  return (
    <SafeAreaProvider>
      <TrayProvider 
        stackConfigs={stackConfigs}
        trays={{ ...trays.main, ...trays.keyboard }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="setting" />
            <Stack.Screen name="user" />
          </Stack>
      </TrayProvider>
    </SafeAreaProvider>
  );
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.1
 * @component */
const RootLayout = () => <ModalAccountLayout />;

export default RootLayout;