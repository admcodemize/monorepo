import React from "react";
import { Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import { ConvexUsersAPIProps } from "@codemize/backend/Types";

import { useConvexUser } from "@/hooks/auth/useConvexUser";
import { useUserSettings } from "@/hooks/user/useUserSettings";
import { useCalendarEvents } from "@/hooks/calendar/useCalendarEvents";
import { useRuntime } from "@/hooks/user/useRuntime";
import { useLinkedMailAccounts } from "@/hooks/auth/useLinkedMailAccounts";
import { useIntegrations } from "@/hooks/integrations/useIntegrations";
import { getTimeZone } from "@/helpers/System";

import RootFooter from "@/components/layout/footer/RootFooter";
import LoadingScreen from "@/screens/private/LoadingScreen";

import DateTimeProvider from "@/context/DateTimeContext";
import UserProvider from "@/context/UserContext";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.5
 * @type */
type LoadedProps = {
  userSettingsFetchFinished: boolean;
  runtimeFetchFinished: boolean;
  eventsFetchFinished: boolean;
  integrationsFetchFinished: boolean;
  linkedMailAccountsFetchFinished: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.6 */
const PrivateLayout = () => { 
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
  const [isLoaded, setIsLoaded] = React.useState<LoadedProps>({ 
    userSettingsFetchFinished: false, 
    runtimeFetchFinished: false,
    eventsFetchFinished: false,
    integrationsFetchFinished: false,
    linkedMailAccountsFetchFinished: false
  });

  /**
   * @description Loads the user settings for the currently signed in user
   * @see {@link hooks/settings/useUserSettings} */
  const { settings } = useUserSettings({ convexUser: convexUser as ConvexUsersAPIProps, onFetchFinished: () => setIsLoaded((prev) => ({ ...prev, userSettingsFetchFinished: true })) });

  /**
   * @description Loads the runtime informations for the currently signed in user based on their license model
   * -> The runtime informations contain the template variables and the license features and counter (how many linked providers and workflows are allowed/etc..)
   * @see {@link hooks/user/useRuntime} */
  const { runtime } = useRuntime({ convexUser: convexUser as ConvexUsersAPIProps, onFetchFinished: () => setIsLoaded((prev) => ({ ...prev, runtimeFetchFinished: true })) });

  /** 
   * @description Returns the linked mail account for the currently signed in user 
   * @see {@link hooks/auth/useLinkedAccount} */
  const { linkedMailAccounts } = useLinkedMailAccounts({ onFetchFinished: () => setIsLoaded((prev) => ({ ...prev, linkedMailAccountsFetchFinished: true })) });

  /**
   * @description Loads the currently signed in and subscripted users events 
   * -> Handles the automatic refresh when a new custom event is added or some data in the database changes!
   * @see {@link hooks/calendar/useCalendarEvents} */
  useCalendarEvents({ convexUser: convexUser as ConvexUsersAPIProps, onFetchFinished: () => setIsLoaded((prev) => ({ ...prev, eventsFetchFinished: true })) });

  /**
   * @description Loads the currently signed in and subscripted users integrations
   * -> Handles the automatic refresh when a new integration is added or some data in the database changes!
   * @see {@link hooks/integrations/useIntegrations} */
  useIntegrations({ convexUser: convexUser as ConvexUsersAPIProps, onFetchFinished: () => setIsLoaded((prev) => ({ ...prev, integrationsFetchFinished: true })) });

  /** @description If not all the data is loaded, show the loading screen */
  if (!isLoaded.userSettingsFetchFinished || !isLoaded.eventsFetchFinished || !isLoaded.integrationsFetchFinished || !isLoaded.linkedMailAccountsFetchFinished) return <LoadingScreen />;
  
  return (
    <UserProvider 
      runtime={runtime}
      settings={settings} 
      linkedMailAccounts={linkedMailAccounts}
      times={[]}>
        <DateTimeProvider timeZone={getTimeZone()}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={isSignedIn || false}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(modal)/create" options={{ presentation: "fullScreenModal" }} />
              <Stack.Screen name="(modal)/account" options={{ presentation: "fullScreenModal" }} />
              <Stack.Screen name="(modal)/general" options={{ presentation: "fullScreenModal" }} />
              <Stack.Screen name="(modal)/configuration" options={{ presentation: "fullScreenModal" }} />
            </Stack.Protected>
          </Stack>  
        </DateTimeProvider>
       <RootFooter />
    </UserProvider>
  );
}

export default PrivateLayout;

/**
 * 
        { userId: "a" as Id<"users">, day: 3, type: "weekdays", start: "2025-10-28T23:00:00.000Z", end: "2025-10-29T07:00:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 3, type: "weekdays", start: "2025-10-29T09:00:00.000Z", end: "2025-10-29T10:30:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 1, type: "weekdays", start: "2025-10-28T23:00:00.000Z", end: "2025-10-29T06:00:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 2, type: "weekdays", start: "2025-10-28T23:00:00.000Z", end: "2025-10-29T04:00:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 1, type: "weekdays", start: "2025-10-29T16:00:00.000Z", end: "2025-10-29T23:00:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 5, type: "weekdays", start: "2025-10-29T04:00:00.000Z", end: "2025-10-29T09:00:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 6, type: "weekdays", start: "2025-10-29T13:00:00.000Z", end: "2025-10-29T15:00:00.000Z", isBlocked: true },
        { userId: "a" as Id<"users">, day: 4, type: "weekdays", start: "2025-10-28T23:00:00.000Z", end: "2025-10-29T05:00:00.000Z", isBlocked: true }
      
 */