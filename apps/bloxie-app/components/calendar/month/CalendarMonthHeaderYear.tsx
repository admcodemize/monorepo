import React from "react";
import { View } from "react-native";

import { useCalendarContextStore } from "@/context/CalendarContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHapticText from "@/components/button/TouchableHaptichText";
import { CalendarMonthHeaderViewEnum } from "@/components/calendar/month/CalendarMonthHeader";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import CalendarMonthHeaderYearStyle from "@/styles/components/calendar/month/CalendarMonthHeaderYear";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarMonthHeaderYearProps = {
  view: CalendarMonthHeaderViewEnum;
  onPress: () => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @param {CalendarHeaderYearProps} param0
 * @param {Function} param0.onPress - The function to call when the month is pressed -> Handles the opening of the month calendar view with reanimated styling
 * @component */
const CalendarMonthHeaderYear = ({
  view,
  onPress,
}: CalendarMonthHeaderYearProps) => {
  const colors = useThemeColors();

  /**
   * @description Get the week from the calendar context store
   * @see {@link context/CalendarContext} */
  const week = useCalendarContextStore((state) => state.week);

  return (
    <View 
      style={[GlobalContainerStyle.rowCenterCenter, { gap: 6 }]}>
        <TouchableHapticText
          text={`${week.year.toString()}`}
          type="label"
          i18nTranslation={false}
          onPress={onPress}
          hasViewCustomStyle={true}
          viewCustomStyle={{ 
            ...(view === CalendarMonthHeaderViewEnum.YEAR ? { backgroundColor: colors.focusedBgColor } : {}),   
            ...CalendarMonthHeaderYearStyle.viewCustomStyle
          }}
          textCustomStyle={{ 
            ...CalendarMonthHeaderYearStyle.textCustomStyle, 
            ...(view === CalendarMonthHeaderViewEnum.YEAR ? { color: colors.focusedContentColor } : {}), 
          }} />
    </View>
  )
};

export default CalendarMonthHeaderYear;