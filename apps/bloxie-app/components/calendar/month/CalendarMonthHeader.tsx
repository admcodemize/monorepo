import React from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import Animated, { FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { getMonths, getWeeks } from "@codemize/helpers/DateTime";

import { useThemeColor, useThemeColors } from "@/hooks/theme/useThemeColor";
import { getLocalization } from "@/helpers/System";
import { KEYS } from "@/constants/Keys";

import TextBase from "@/components/typography/Text";
import CalendarMonthHeaderMonth from "@/components/calendar/month/CalendarMonthHeaderMonth";
import CalendarMonthHeaderYear from "@/components/calendar/month/CalendarMonthHeaderYear";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import CalendarMonthHeaderStyle from "@/styles/components/calendar/month/CalendarMonthHeader";
import Divider from "@/components/container/Divider";
import CalendarMonthHeaderMonths from "./CalendarMonthHeaderMonths";
import CalendarMonthHeaderYears from "./CalendarMonthHeaderYears";
import ViewBase from "@/components/container/View";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarMonthHeaderProps = {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @enum */
export enum CalendarMonthHeaderViewEnum {
  MONTH = "month",
  YEAR = "year",
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
type CalendarMonthHeaderDayProps = {
  text: string;
  viewStyle?: ViewStyle;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @param {CalendarMonthHeaderProps} param0
 * @component */
const CalendarMonthHeader = ({
}: CalendarMonthHeaderProps) => {
  const colors = useThemeColors();
  const locale = getLocalization();
  
  /** 
   * @description Get the days of the week with localized short text
   * @see {@link @codemize/helpers/DateTime/getWeeks} */
  const days = React.useMemo(() => {
    return getWeeks({ 
      now: new Date(), 
      weeksInPast: 0, 
      weeksInFuture: 0, 
      locale 
    }).flatMap((week) => week.datesInWeek);
  }, [locale]);

  /** @description Handles the visibility of the view inside the top header (month or year is displayed) */
  const [view, setView] = React.useState<CalendarMonthHeaderViewEnum>(CalendarMonthHeaderViewEnum.MONTH);
  
  /** @description Shared value for smooth opacity animation */
  const isMonthView = useSharedValue(1); // 1 = month, 0 = year

  const onPressMonth = React.useCallback(() => {
    setView(CalendarMonthHeaderViewEnum.MONTH);
    isMonthView.value = withTiming(1, { duration: 200 });
  }, []);

  const onPressYear = React.useCallback(() => {
    setView(CalendarMonthHeaderViewEnum.YEAR);
    isMonthView.value = withTiming(0, { duration: 200 });
  }, []);

  /** @description Animated style for months list */
  const monthsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: isMonthView.value
  }));

  /** @description Animated style for years list */
  const yearsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - isMonthView.value
  }));

  return (
    <View>
      <View style={[GlobalContainerStyle.rowCenterBetween, CalendarMonthHeaderStyle.top, {
        backgroundColor: "#f9f9f9",
      }]}>
        <View style={{ position: 'relative', flex: 1 }}>
          <Animated.View style={[
            monthsAnimatedStyle,
            { 
              position: view === CalendarMonthHeaderViewEnum.MONTH ? 'relative' : 'absolute',
              pointerEvents: view === CalendarMonthHeaderViewEnum.MONTH ? 'auto' : 'none',
              width: '100%'
            }
          ]}>
            <CalendarMonthHeaderMonths />
          </Animated.View>
          <Animated.View style={[
            yearsAnimatedStyle,
            {
              position: view === CalendarMonthHeaderViewEnum.YEAR ? 'relative' : 'absolute',
              pointerEvents: view === CalendarMonthHeaderViewEnum.YEAR ? 'auto' : 'none',
              width: '100%'
            }
          ]}>
            <CalendarMonthHeaderYears />
          </Animated.View>
        </View>
        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 6 }]}>
          <Divider vertical />
          <CalendarMonthHeaderMonth 
            view={view}
            onPress={onPressMonth} />
          <CalendarMonthHeaderYear 
            view={view}
            onPress={onPressYear} />
        </View>
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, CalendarMonthHeaderStyle.bottom, {
        borderTopColor: colors.primaryBorderColor,
      }]}>
        <View style={[GlobalContainerStyle.rowCenterCenter]}>
          <CalendarMonthHeaderDay text="KW" viewStyle={{ width: STYLES.calendarHourWidth }} />
          {days.map((day, idx) => <CalendarMonthHeaderDay 
            key={`${KEYS.calendarMonthHeaderDay}-${idx}`} 
            text={day.shortText} />)}
        </View>
      </View>
    </View>
  )
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @param {CalendarMonthHeaderDayProps} param0
 * @param {string} param0.text - The text to display in the day
 * @component */
const CalendarMonthHeaderDay = ({ 
  text, 
  viewStyle = {},
}: CalendarMonthHeaderDayProps) => {
  const infoColor = useThemeColor("info");
  return (
    <View style={[GlobalContainerStyle.rowCenterCenter, CalendarMonthHeaderStyle.days, viewStyle]}>
      <TextBase
        text={text}
        i18nTranslation={false}
        type="label"
        style={[GlobalTypographyStyle.headerSubtitle, CalendarMonthHeaderStyle.day, { 
          color: infoColor,     
        }]} />
    </View>
  );
};

export default CalendarMonthHeader;