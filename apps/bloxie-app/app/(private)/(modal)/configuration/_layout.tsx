import { TrayProvider } from "react-native-trays";
import { Stack } from "expo-router";

import { stackConfigs, trays } from "@/helpers/Trays";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.4
 * @component */
const ModalConfigurationLayout = () => {
  return (
    <TrayProvider 
      stackConfigs={stackConfigs}
      trays={trays.modal}>
      <Stack screenOptions={{ headerShown: false, presentation: "fullScreenModal" }}>
        <Stack.Screen name="integration" />
        <Stack.Screen name="workflow" />
      </Stack>
    </TrayProvider>
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