import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import Calendar from "@/components/calendar/Calendar";
import DropdownOverlay from "@/components/container/DropdownOverlay";
import ViewBase from "@/components/container/View";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.3
 * @component */
const TabCalendar = () => {
  const refContainer = React.useRef<Animated.View>(null);
  return (
    <ViewBase ref={refContainer as React.RefObject<Animated.View>}>
      <Calendar refContainer={refContainer as React.RefObject<Animated.View>} />
      {/*<DropdownOverlay />*/}
    </ViewBase>
  );
}

export default TabCalendar;