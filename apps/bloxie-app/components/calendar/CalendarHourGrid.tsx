import React from "react";
import { Dimensions, View } from "react-native";

import { STYLES } from "@codemize/constants/Styles";
import { KEYS } from "@/constants/Keys";
import { getHours } from "@codemize/helpers/DateTime";

import { getLocalization } from "@/helpers/System";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import CalendarHourGridStyle from "@/styles/components/calendar/CalendarHourGrid";
import { useCalendarContextStore } from "@/context/CalendarContext";

const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarHourGridProps = {
  numberOfDays?: number;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @description
 * @since 0.0.5
 * @version 0.0.1
 * @type */
type HourItemProps = {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description
 * @since 0.0.5
 * @version 0.0.1
 * @param {CalendarHourGridProps} param0
 * @param {number} param0.numberOfDays - Number of days to display in the calendar
 * @component */
const CalendarHourGrid = ({
  numberOfDays = 7
}: CalendarHourGridProps) => {
  const hours = React.useMemo(() => getHours(24, getLocalization()), []);

  return (
    <View style={[CalendarHourGridStyle.view, { 
      width: ((DIM.width - STYLES.calendarHourWidth) / numberOfDays) * numberOfDays,
      height: hours.length * STYLES.calendarHourHeight,
    }]}>
      {hours.map((hour) => <HourItem key={`${KEYS.calendarHourGrid}-${hour.idx}`} />)}
    </View>
  )
}

/**
| * @private
| * @author Marc Stöckli - Codemize GmbH 
| * @description Renders a single hour row with vertical day separators
| * @since 0.0.5
| * @version 0.0.2
| * @param {HourItemProps} param0
| * @component */
const HourItem = ({ 
}: HourItemProps) => {
  const colors = useThemeColors();

  const config = useCalendarContextStore((state) => state.config);

  return (
    <View style={[CalendarHourGridStyle.item, { 
      borderBottomColor: colors.primaryBorderColor, 
      height: STYLES.calendarHourHeight
    }]}>
      {Array.from({ length: config.numberOfDays }).map((_, dayIndex) => (
        <View 
          key={`${KEYS.calendarHourGridItem}-${dayIndex}`}
          style={[CalendarHourGridStyle.dayItem, { 
            width: config.width,
            borderRightWidth: dayIndex < config.numberOfDays - 1 ? 1 : 0,
            borderRightColor: colors.secondaryBorderColor 
          }]} 
        />
      ))}
    </View>
  )
}

export default CalendarHourGrid;
