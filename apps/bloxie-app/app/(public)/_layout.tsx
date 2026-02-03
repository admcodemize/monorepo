import { Stack } from "expo-router";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Public layout component
 * @since 0.0.1
 * @version 0.0.1 */
const PublicLayout = () => {  
  return (
    <Stack screenOptions={{
        animation: "fade", 
        animationDuration: 400,
        headerShown: false,
      }}>
        <Stack.Screen name="index"/>       
    </Stack>
  );
}

export default PublicLayout;