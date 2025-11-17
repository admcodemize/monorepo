import { Tabs } from "expo-router";

import RootHeader from "@/components/layout/header/private/RootHeader";
import { View } from "react-native";
import ViewBase from "@/components/container/View";
import React from "react";
import Calendar from "@/components/calendar/Calendar";
import TouchableFloationAction from "@/components/button/TouchableFloatingAction";
import DropdownOverlay from "@/components/container/DropdownOverlay";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.3 */
const TabLayout = () => {
  return (
    <ViewBase>
      <RootHeader />
      <Calendar />
      <TouchableFloationAction />
      <DropdownOverlay />
    </ViewBase>
  );
}

export default TabLayout;