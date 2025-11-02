import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import { TRAY_ACTION_ITEMS } from "@/constants/Models";

import ViewBase from "@/components/container/View";
import Calendar from "@/components/calendar/Calendar";
import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";
import StackModalHeader from "@/components/container/StackModalHeader";
import DropdownOverlay from "@/components/container/DropdownOverlay";

const KEY = "meeting";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.2
 * @component */
const ModalActionMeeting = () => {
  const refContainer = React.useRef<View>(null);
  const tray = TRAY_ACTION_ITEMS.find((item) => item.key === KEY);

  return (
    <ViewBase ref={refContainer as React.RefObject<Animated.View>}>
      <SafeAreaContextViewBase 
        style={{ gap: 10 }}>
        <StackModalHeader
          title={tray!.title}
          description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."} />
            <Calendar refContainer={refContainer as React.RefObject<Animated.View>} />
        <DropdownOverlay />
      </SafeAreaContextViewBase>
    </ViewBase>
  )
}

export default ModalActionMeeting;