import React from "react";
import { View } from "react-native";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCalendarRange } from "@fortawesome/duotone-thin-svg-icons";

import { getMonthWide } from "@codemize/helpers/DateTime";

import { useCalendarContextStore } from "@/context/CalendarContext";
import { getLocalization } from "@/helpers/System";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarHeaderMonthProps = {
  onPress: () => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @param {CalendarHeaderMonthProps} param0
 * @param {Function} param0.onPress - The function to call when the month is pressed -> Handles the opening of the month calendar view with reanimated styling
 * @component */
const CalendarHeaderLeft = ({
  onPress,
}: CalendarHeaderMonthProps) => {
  const colors = useThemeColors();
  const locale = getLocalization();

  /**
   * @description Get the week from the calendar context store
   * @see {@link context/CalendarContext} */
  const week = useCalendarContextStore((state) => state.week);

  return (
    <View 
      style={[GlobalContainerStyle.rowCenterCenter, { gap: 6 }]}>
        <TouchableHapticDropdown
          icon={faCalendarRange as IconProp}
          text={`${week.startOfWeek.getDate()} - ${week.endOfWeek.getDate()} ${getMonthWide({ number: week.month, locale })} ${week.year.toString().substring(2)}`}
          backgroundColor={colors.tertiaryBgColor}
          hasViewCustomStyle={true}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
          hasAngleChange={true}
          onPress={onPress} />
    </View>
  )
};

export default CalendarHeaderLeft;