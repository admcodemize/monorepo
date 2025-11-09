import React from "react";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import Animated from "react-native-reanimated";

import { STYLES } from "@codemize/constants/Styles";
import { getHours, HoursProps } from "@codemize/helpers/DateTime";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { getLocalization } from "@/helpers/System";
import { KEYS } from "@/constants/Keys";

import ListItemHour from "@/components/calendar/list/ListItemHour";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import TextBase from "../typography/Text";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarWeekVerticalHoursListProps = {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
} 

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description
 * @since 0.0.5
 * @version 0.0.1
 * @param {CalendarWeekVerticalHoursListProps} param0
 * @param {NativeSyntheticEvent<NativeScrollEvent>} param0.onScroll - Callback function to handle the scroll event
 * @component */
const CalendarWeekVerticalHoursList = React.forwardRef<Animated.ScrollView, CalendarWeekVerticalHoursListProps>(({
  onScroll,
}, ref) => { 
  const colors = useThemeColors();
  const hours: HoursProps[] = React.useMemo(() => getHours(24, getLocalization()), []);

  return (
    <View>

{/*<View style={{
        height: 30,
        flexDirection: 'row',
        borderBottomColor: colors.primaryBorderColor,
        borderBottomWidth: 1
      }}>
        {/* Linke graue Spalte (analog zur Stundenliste) *
        <View style={{
          width: STYLES.calendarHourWidth,
          backgroundColor: "#fcfcfc",
          justifyContent: "center",
          alignItems: "center",
          borderRightColor: colors.primaryBorderColor,
          borderRightWidth: 1
        }}>
            <TextBase
              text="Ganztags"
              style={[GlobalTypographyStyle.labelText, { fontSize: 8, color: colors.infoColor }]} />
        </View>


      </View>*/}


      <Animated.ScrollView
        ref={ref}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={false}
        snapToInterval={STYLES.calendarHourHeight / 2}
        style={{ width: STYLES.calendarHourWidth }}>
        {hours.map((item, idx) => <HourItem 
          key={`${KEYS.calendarHours}-${idx}`} 
          {...item} />)}
      </Animated.ScrollView>
    </View>
  );
});

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @description
 * @since 0.0.5
 * @version 0.0.1
 * @param {HoursProps} param0
 * @param {number} param0.idx - Index of the hour -> Is equal to the hour of the day (0-23)
 * @param {string} param0.hour - Hour of the day (0-23)
 * @component */
const HourItem = ({
  idx,
  hour
}: HoursProps) => {
  const colors = useThemeColors();
  return (
    <View style={[GlobalContainerStyle.columnCenterStart, { 
      maxWidth: STYLES.calendarHourWidth,
      borderRightWidth: STYLES.calendarHourBorderHeight,    
      borderColor: `${colors.secondaryBorderColor}60`,
      borderBottomWidth: 1, 
      height: STYLES.calendarHourHeight,
      paddingTop: 4
    }]}>
      <ListItemHour
        idx={idx}
        hour={hour} />        
    </View>
  )
}

export default CalendarWeekVerticalHoursList;