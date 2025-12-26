import { Stack } from "expo-router";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.3
 * @component */
const ModalConfigurationLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: "fullScreenModal" }}>
      <Stack.Screen name="integration" />
      <Stack.Screen name="workflow" />
    </Stack>
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