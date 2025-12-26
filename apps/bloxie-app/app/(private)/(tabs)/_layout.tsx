import React from "react";
import { View } from "react-native";

import ViewBase from "@/components/container/View";
import Calendar from "@/components/calendar/Calendar";
import DropdownOverlay from "@/components/container/DropdownOverlay";

import TabsLayoutStyle from "@/styles/app/private/tabs/layout";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.6 */
const TabLayout = () => {
  return (
    <ViewBase style={TabsLayoutStyle.view} >
      <View style={TabsLayoutStyle.container}>
        <Calendar />
        <DropdownOverlay />
      </View>
    </ViewBase>
  );
}

export default TabLayout;