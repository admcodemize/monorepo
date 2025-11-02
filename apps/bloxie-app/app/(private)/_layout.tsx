import { Stack } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Id } from "../../../../packages/backend/convex/_generated/dataModel";

import { getTimeZone } from "@/helpers/System";

import CalendarProvider from "@/context/CalendarContext";
import DateTimeProvider from "@/context/DateTimeContext";
import UserProvider from "@/context/UserContext";

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
    <BottomSheetModalProvider>
    <UserProvider 
      settings={{ userId: "a" as Id<"users"> }} 
      times={[
        { userId: "a" as Id<"users">, day: 3, type: "weekdays", start: "2025-10-28T23:00:00.000Z", end: "2025-10-29T07:00:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 3, type: "weekdays", start: "2025-10-29T09:00:00.000Z", end: "2025-10-29T10:30:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 1, type: "weekdays", start: "2025-10-28T23:00:00.000Z", end: "2025-10-29T06:00:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 2, type: "weekdays", start: "2025-10-28T23:00:00.000Z", end: "2025-10-29T04:00:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 1, type: "weekdays", start: "2025-10-29T16:00:00.000Z", end: "2025-10-29T23:00:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 5, type: "weekdays", start: "2025-10-29T04:00:00.000Z", end: "2025-10-29T09:00:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 6, type: "weekdays", start: "2025-10-29T13:00:00.000Z", end: "2025-10-29T15:00:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 4, type: "weekdays", start: "2025-10-28T23:00:00.000Z", end: "2025-10-29T05:00:00.000Z", isBlocked: true }
      ]}>
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
    </UserProvider>
    </BottomSheetModalProvider>
  );
}

export default PrivateLayout;