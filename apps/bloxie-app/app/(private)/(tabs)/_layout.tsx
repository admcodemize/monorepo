import { Tabs } from "expo-router";

import RootHeader from "@/components/layout/header/private/RootHeader";
import { View } from "react-native";
import ViewBase from "@/components/container/View";
import React from "react";
import Animated from "react-native-reanimated";
import Calendar from "@/components/calendar/Calendar";
import TouchableFloationAction from "@/components/button/TouchableFloatingAction";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.3 */
const TabLayout = () => {
  const refContainer = React.useRef<Animated.View>(null);
  return (
    <ViewBase>
      <RootHeader />
      <Calendar refContainer={refContainer as React.RefObject<Animated.View>} />
      <TouchableFloationAction />
    </ViewBase>
  );
}

export default TabLayout;