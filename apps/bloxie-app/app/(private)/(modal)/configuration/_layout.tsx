import { TrayProvider } from "react-native-trays";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { stackConfigs, trays } from "@/helpers/Trays";

import ConfigurationProvider from '@/context/ConfigurationContext';

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.5
 * @component */
const ModalConfigurationLayout = () => {
  return (
    <SafeAreaProvider>
      <ConfigurationProvider>
        <TrayProvider 
          stackConfigs={stackConfigs}
          trays={{ ...trays.main, ...trays.keyboard }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="availability" />
              <Stack.Screen name="eventType" />
              <Stack.Screen name="integration" />
              <Stack.Screen name="workflow" />
            </Stack>
        </TrayProvider>
      </ConfigurationProvider>
    </SafeAreaProvider>
  );
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.1
 * @component */
const RootLayout = () => <ModalConfigurationLayout />;

export default RootLayout;