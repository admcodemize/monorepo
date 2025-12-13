import * as Sentry from '@sentry/react-native';
import * as React from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TrayProvider } from 'react-native-trays';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ConvexProviderWithClerk } from "convex/react-clerk";

import { initSentry } from "@codemize/helpers/Sentry";
import { initNotification } from "@/helpers/Notification";

import { Inter_100Thin, Inter_300Light, Inter_500Medium, Inter_600SemiBold, Inter_800ExtraBold, useFonts } from '@expo-google-fonts/inter';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from 'expo-status-bar';

import { isNetworkConnected } from "@/helpers/Network";
import { stackConfigs, trays } from "@/helpers/Trays";
import { getVersion } from '@/helpers/System';
import { tokenCache } from '@/utils/auth/cache';
import { convex } from '@/utils/backend/convex';

import SafeAreaContextViewBase from '@/components/container/SafeAreaContextView';

import CalendarProvider from '@/context/CalendarContext';
import DropdownProvider from "@/context/DropdownContext";
import IntegrationProvider from '@/context/IntegrationContext';
import ToastProvider from "@/context/ToastContext";

import "@/i18n";
import 'react-native-reanimated';

/** 
 * @public
 * @description Fixes while using a deeplink for getting the stack back button */
export const unstable_settings = {
  /** @description Since our context is already pointing to app/mobile, routes are relative to that */
  initialRouteName: '(public)',
};

/** @description Prevent the splash screen from auto-hiding before asset loading is complete. */
SplashScreen.preventAutoHideAsync();

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH
 * @description Slot will render the current child route, think of this like the children prop in React. 
 * This component can be wrapped with other components to create a layout. 
 * @since 0.0.1
 * @version 0.0.2
 * @component */
const StartSlot = () => {
  /**
   * @description Hook is needed to check if user data has been loaded and of course if user is signed in
   * @see {@link clerk/clerk-expo} */
  const { isSignedIn, isLoaded } = useAuth();

  /** @description Used for imperative routing after user is signed in */
  const router = useRouter();
  
  /** @description Segment with the group syntax "(...)" will be used to prevent showing up in the url */
  const segments = useSegments();

  React.useEffect((): void => {
    if (!isLoaded) return;

    if (isSignedIn && !segments[0].includes("(private)")) router.replace("/(private)/(tabs)")
    else if (!isSignedIn) router.replace("/(public)")
  }, [isSignedIn, isLoaded]);

  return (
    <SafeAreaContextViewBase>
      <DropdownProvider>
        <TrayProvider 
          stackConfigs={stackConfigs}
          trays={trays}>
            <Slot /> 
        </TrayProvider>
      </DropdownProvider>
    </SafeAreaContextViewBase>
  )
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH
 * @description Root layout component
 * @since 0.0.1
 * @version 0.0.2 */
const RootLayout = () => {
  initSentry({ version: getVersion() || "0.0.1" });
  initNotification();
  
  const [isAppReady, setIsAppReady] = React.useState(false);

  /** @description Load custom fonts */
  const [hasFontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_300Light,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_800ExtraBold
  });

  React.useEffect(() => {
    if (!hasFontsLoaded) return;
    (async () => setIsAppReady(true))();
  }, [hasFontsLoaded]);

  /**
   * @description This tells the splash screen to hide immediately! If we call this after
   * `setAppIsReady`, then we may see a blank screen while the app is
   * loading its initial state and rendering its first pixels. So instead,
   * we hide the splash screen once we know the root view has already
   * performed layout.
   * @since 0.0.1
   * @version 0.0.1 */
  const onLayoutRootView = React.useCallback(async () => {
    if (!isAppReady || !isNetworkConnected()) return;
    await SplashScreen.hideAsync();
  }, [isAppReady]);

  if (!isAppReady) return null;

  return (
    <SafeAreaProvider
      onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <GestureHandlerRootView>
          <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
              <ClerkLoaded>
                <ConvexProviderWithClerk
                  client={convex} 
                  useAuth={useAuth}>
                <IntegrationProvider>
                <ToastProvider>
                <CalendarProvider now={new Date()}>
                  <StartSlot />
                </CalendarProvider>
                </ToastProvider>
                </IntegrationProvider>
                </ConvexProviderWithClerk>
              </ClerkLoaded>
          </ClerkProvider>
        </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(RootLayout);