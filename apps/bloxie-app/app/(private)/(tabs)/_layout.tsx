import React from "react";

import RootHeader from "@/components/layout/header/private/RootHeader";
import ViewBase from "@/components/container/View";
import Calendar from "@/components/calendar/Calendar";
import TouchableFloatingAction from "@/components/button/TouchableFloatingAction";
import DropdownOverlay from "@/components/container/DropdownOverlay";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.4 */
const TabLayout = () => {
  return (
    <ViewBase>
      <RootHeader />
      <Calendar />
      <TouchableFloatingAction />
      <DropdownOverlay />
    </ViewBase>
  );
}

export default TabLayout;