import { Tabs } from "expo-router";

import RootHeader from "@/components/layout/header/private/RootHeader";
import ScreenTabs from "@/components/layout/ScreenTabs";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.2 */
const TabLayout = () => {
  return (
    <>
    <RootHeader />
    <Tabs 
      tabBar={(props) => <ScreenTabs {...props} />}
      screenOptions={{
        headerShown: false,
        animation: "shift"
      }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="calendar" />
        <Tabs.Screen name="contact" />
        <Tabs.Screen name="team" />
    </Tabs>
    </>
  );
}

export default TabLayout;