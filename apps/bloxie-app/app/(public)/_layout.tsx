import { Stack } from "expo-router";

import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Public layout component
 * @since 0.0.1
 * @version 0.0.1 */
const PublicLayout = () => {  
  return (
    <SafeAreaContextViewBase>
      <Stack screenOptions={{
          animation: "fade", 
          animationDuration: 400,
          headerShown: false,
        }}>
          <Stack.Screen name="index"/>       
      </Stack>
    </SafeAreaContextViewBase>
  );
}

export default PublicLayout;