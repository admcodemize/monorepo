import { Stack } from "expo-router";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.1
 * @component */
const ConfigurationLayout = () => {
  return (
    <Stack
      screenOptions={{ 
        headerShown: false, 
        presentation: "fullScreenModal" 
      }}>
        <Stack.Screen name="integration" />
    </Stack>
  );
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.1
 * @component */
const RootLayout = () => <ConfigurationLayout />;

export default RootLayout;