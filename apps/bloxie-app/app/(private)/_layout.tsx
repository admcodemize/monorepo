import { Stack } from "expo-router";

import { getTimeZone } from "@/helpers/System";
import CalendarProvider from "@/context/CalendarContext";
import DateTimeProvider from "@/context/DateTimeContext";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.2 */
const PrivateLayout = () => { 
  /**
   * @description Handles the authentication state of the user
   * @see {@link @clerk/clerk-expo} */

  return (
    <CalendarProvider now={new Date()}>
    <DateTimeProvider timeZone={getTimeZone()}>
      <Stack
        screenOptions={{ 
          headerShown: false 
        }}>
          {/*<Stack.Protected guard={(isSignedIn && isLoaded) || true}>*/}
          <Stack.Protected guard={true}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(modal)/action/booking" options={{ presentation: "fullScreenModal" }} />
            <Stack.Screen name="(modal)/action/meeting" options={{ presentation: "fullScreenModal" }} />
            <Stack.Screen name="(modal)/action/type" options={{ presentation: "fullScreenModal" }} />
            <Stack.Screen name="(modal)/action/team" options={{ presentation: "fullScreenModal" }} />
            <Stack.Screen name="(modal)/action/poll" options={{ presentation: "fullScreenModal" }} />
            <Stack.Screen name="(modal)/configuration/availability" options={{ presentation: "fullScreenModal" }} />
            <Stack.Screen name="(modal)/configuration/workflow" options={{ presentation: "fullScreenModal" }} />
          </Stack.Protected>
      </Stack>  
    </DateTimeProvider>
    </CalendarProvider>
  );
}

export default PrivateLayout;