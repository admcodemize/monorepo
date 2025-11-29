import React from "react";
import { Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Id } from "../../../../packages/backend/convex/_generated/dataModel";

import { ConvexUsersAPIProps } from "@codemize/backend/Types";

import { useConvexUser } from "@/hooks/auth/useConvexUser";
import { useUserSettings } from "@/hooks/settings/useUserSettings";
import { useCalendarEvents } from "@/hooks/calendar/useCalendarEvents";
import { useIntegrations } from "@/hooks/integrations/useIntegrations";
import { getTimeZone } from "@/helpers/System";

import LoadingScreen from "@/screens/private/LoadingScreen";

import DateTimeProvider from "@/context/DateTimeContext";
import UserProvider from "@/context/UserContext";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.3
 * @type */
type LoadedProps = {
  userSettingsFetchFinished: boolean;
  eventsFetchFinished: boolean;
  integrationsFetchFinished: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.3 */
const PrivateLayout = () => { 
  /** 
   * @description Will be used to handle the visibility of the custom splashscreen which will be shown until
   * all the ressources are loaded */
  const loadedRef = React.useRef<LoadedProps>({
    userSettingsFetchFinished: false,
    eventsFetchFinished: false,
    integrationsFetchFinished: false,
  });

  /**
   * @description Marks the given key as loaded
   * @param {keyof LoadedProps} key - The key to mark as loaded
   * @see {@link LoadedProps} */
  const setFetchFinished = (key: keyof LoadedProps) => {
    if (loadedRef.current[key]) return;
    loadedRef.current = { ...loadedRef.current, [key]: true };
    setIsLoaded(loadedRef.current);
  };

  /**
   * @description Handles the authentication state of the user
   * @see {@link @clerk/clerk-expo} */
  const { isSignedIn, getToken } = useAuth();
  const { convexUser } = useConvexUser();

  //const token = await getToken();
  //console.log("token", token);

  /**
   * @description Will be used to handle the visibility of the custom splashscreen which will be shown until
   * all the ressources are loaded */
  const [isLoaded, setIsLoaded] = React.useState<LoadedProps>(loadedRef.current);

  /**
   * @description Loads the user settings for the currently signed in user
   * @see {@link hooks/settings/useUserSettings} */
  const { settings } = useUserSettings({ convexUser: convexUser as ConvexUsersAPIProps, onFetchFinished: () => setFetchFinished("userSettingsFetchFinished") });

  /**
   * @description Loads the currently signed in and subscripted users events 
   * -> Handles the automatic refresh when a new custom event is added or some data in the database changes!
   * @see {@link hooks/calendar/useCalendarEvents} */
  useCalendarEvents({ convexUser: convexUser as ConvexUsersAPIProps, onFetchFinished: () => setFetchFinished("eventsFetchFinished") });

  /**
   * @description Loads the currently signed in and subscripted users integrations
   * -> Handles the automatic refresh when a new integration is added or some data in the database changes!
   * @see {@link hooks/integrations/useIntegrations} */
  useIntegrations({ convexUser: convexUser as ConvexUsersAPIProps, onFetchFinished: () => setFetchFinished("integrationsFetchFinished") });

  /** @description If not all the data is loaded, show the loading screen */
  if (!isLoaded.userSettingsFetchFinished || !isLoaded.eventsFetchFinished || !isLoaded.integrationsFetchFinished) return <LoadingScreen />;

  return (
    <UserProvider 
      settings={settings} 
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
        <DateTimeProvider timeZone={getTimeZone()}>
          <Stack
            screenOptions={{ 
              headerShown: false 
            }}>
              <Stack.Protected guard={isSignedIn || false}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(modal)/action/booking" options={{ presentation: "fullScreenModal" }} />
                <Stack.Screen name="(modal)/action/meeting" options={{ presentation: "fullScreenModal" }}  />
                <Stack.Screen name="(modal)/action/type" options={{ presentation: "fullScreenModal" }} />
                <Stack.Screen name="(modal)/action/team" options={{ presentation: "fullScreenModal" }} />
                <Stack.Screen name="(modal)/action/poll" options={{ presentation: "fullScreenModal" }} />
                <Stack.Screen name="(modal)/configuration/availability" options={{ presentation: "fullScreenModal" }} />
                <Stack.Screen name="(modal)/configuration/workflow" options={{ presentation: "fullScreenModal" }} />
                <Stack.Screen name="(modal)/configuration/integration" options={{ presentation: "fullScreenModal" }} />
              </Stack.Protected>
          </Stack>  
        </DateTimeProvider>
    </UserProvider>
  );
}

export default PrivateLayout;