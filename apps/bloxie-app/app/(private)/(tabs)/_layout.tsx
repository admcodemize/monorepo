import React from "react";
import { Dimensions, View } from "react-native";

import RootHeader from "@/components/layout/header/private/RootHeader";
import RootFooter from "@/components/layout/footer/RootFooter";
import ViewBase from "@/components/container/View";
import Calendar from "@/components/calendar/Calendar";
import DropdownOverlay from "@/components/container/DropdownOverlay";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.4 */
const TabLayout = () => {
  return (
    <ViewBase style={{ position: "relative" }} >
      <RootFooter />
      <View style={{ zIndex: 1, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, height: Dimensions.get("window").height - 120, overflow: "hidden" }}>
        {/*<RootHeader />*/}
        <Calendar />
        <DropdownOverlay />
      </View>
      {/*<TouchableFloatingAction />*/}
    </ViewBase>
  );
}

export default TabLayout;