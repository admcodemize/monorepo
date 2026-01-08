import React from "react";
import { GestureResponderEvent, View } from "react-native";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faRectangleHistory, faStopwatch } from "@fortawesome/duotone-thin-svg-icons";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useDropdown } from "@/hooks/button/useDropdown";

import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";
import Divider from "@/components/container/Divider";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type TouchableDropdownBaseProps = {
  onPress: (itemKey: string|number) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @component */
const CalendarHeaderRight = () => {
  const colors = useThemeColors();

  const refTimezone = React.useRef<View|null>(null);
  const refCalendar = React.useRef<View|null>(null);

  /**
   * @description Get the dropdown functions for displaying the calendar views such as week, month, year, etc.
   * @see {@link hooks/button/useDropdown} */
  const { open } = useDropdown();

  /**
   * @description Used to open the dropdown component
   * @param {React.RefObject<View|any>} ref - The ref of the dropdown component for calculating the measurement position
   * @param {GestureResponderEvent} e - The event of the dropdown component
   * @function */
  const onPressDropdown = 
    (ref: React.RefObject<View|null>) =>
    (children: React.ReactNode) =>
    (_event: GestureResponderEvent) => {

    /** 
     * @description Open the dropdown component based on a calculated measurement template
     * @see {@link components/button/TouchableDropdown} */
    /*_open({
      refTouchable: ref,
      open,
      children,
    });*/
  };
  
  return (
    <View 
      style={[GlobalContainerStyle.rowCenterCenter, { gap: 10 }]}>
        <TouchableHapticDropdown
          ref={refTimezone}
          icon={faStopwatch as IconProp}
          text={`GMT+10`}
          backgroundColor={colors.tertiaryBgColor}
          hasViewCustomStyle={true}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4}}
          onPress={onPressDropdown(refTimezone)(<View  />)} />
        <Divider vertical />
        <TouchableHapticDropdown
          ref={refCalendar}
          icon={faRectangleHistory as IconProp}
          text={`Woche`}
          backgroundColor={colors.tertiaryBgColor}
          hasViewCustomStyle={true}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4}}
          onPress={onPressDropdown(refCalendar)(<View />)} />
    </View>
  )
}

export default CalendarHeaderRight;