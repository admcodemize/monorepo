import { TrayProvider } from "react-native-trays";
import { Stack } from "expo-router";

import { stackConfigs, trays } from "@/helpers/Trays";

import ConfigurationProvider from '@/context/ConfigurationContext';

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.4
 * @component */
const ModalConfigurationLayout = () => {
  return (
    <ConfigurationProvider>
      <TrayProvider 
        stackConfigs={stackConfigs}
        trays={{ ...trays.main, ...trays.modal }}>
          <Stack screenOptions={{ headerShown: false, presentation: "fullScreenModal" }}>
            <Stack.Screen name="integration" />
            <Stack.Screen name="workflow" />
          </Stack>
      </TrayProvider>
    </ConfigurationProvider>
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