import React from "react";
import { View } from "react-native";

import { getMonthWide } from "@codemize/helpers/DateTime";

import { useCalendarContextStore } from "@/context/CalendarContext";
import { getLocalization } from "@/helpers/System";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import { CalendarMonthHeaderViewEnum } from "@/components/calendar/month/CalendarMonthHeader";
import TouchableHapticText from "@/components/button/TouchableHapticText";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import CalendarMonthHeaderMonthStyle from "@/styles/components/calendar/month/CalendarMonthHeaderMonth";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarMonthHeaderMonthProps = {
  view: CalendarMonthHeaderViewEnum;
  onPress: () => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @param {CalendarHeaderMonthProps} param0
 * @param {Function} param0.onPress - The function to call when the month is pressed -> Handles the opening of the month calendar view with reanimated styling
 * @component */
const CalendarMonthHeaderMonth = ({
  view,
  onPress,
}: CalendarMonthHeaderMonthProps) => {
  const colors = useThemeColors();
  const locale = getLocalization();

  /**
   * @description Get the week from the calendar context store
   * @see {@link context/CalendarContext} */
  const week = useCalendarContextStore((state) => state.week);

  return (
    <View 
      style={[GlobalContainerStyle.rowCenterCenter, { gap: 6 }]}>
        <TouchableHapticText
          text={`${getMonthWide({ number: week.month, locale })}`}
          type="label"
          i18nTranslation={false}
          onPress={onPress}
          hasViewCustomStyle={true}
          viewCustomStyle={{ 
            ...(view === CalendarMonthHeaderViewEnum.MONTH ? { backgroundColor: colors.focusedBgColor } : {}), 
            ...CalendarMonthHeaderMonthStyle.viewCustomStyle
          }}
          textCustomStyle={{ 
            ...CalendarMonthHeaderMonthStyle.textCustomStyle, 
            ...(view === CalendarMonthHeaderViewEnum.MONTH ? { color: colors.focusedContentColor } : {}), 
          }} />
    </View>
  )
};

export default CalendarMonthHeaderMonth;