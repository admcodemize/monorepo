import * as React from "react";
import { View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { format, getDay } from "date-fns"

import { useThemeColors } from "@/hooks/theme/useThemeColor"
import { useCalendarContextStore } from "@/context/CalendarContext";
import { getTimePosition } from "@codemize/helpers/DateTime"
import { getLocalization } from "@/helpers/System"

import TextBase from "@/components/typography/Text"

import CalendarTimeIndicatorStyle from "@/styles/components/calendar/CalendarTimeIndicator"
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarTimeIndicatorProps = {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description
 * @since 0.0.5
 * @version 0.0.1
 * @param {Object} param0 */
const CalendarTimeIndicator = ({
}: CalendarTimeIndicatorProps) => {
  const colors = useThemeColors();

  /** 
   * @description Get the config from the context for setting the width of the indicator and the absolute left position
   * which indicates the current day in the week
   * @see {@link context/CalendarContext} */
  const config = useCalendarContextStore((state) => state.config);

  const [now, setNow] = React.useState<Date>(new Date());

  /** @description Used to set the top position of the indicator for starting the animation */
  const top = useSharedValue(getTimePosition(now));

  /**
   * @description Handles the positioning of the indicator based on time 
   * @param {boolean} withAnimation - If true, the animation will be used
   * @function */
  const handleTimePosition = (
    withAnimation: boolean = true
  ) => {
    const _now = new Date();
    setNow(_now);

    top.value = withAnimation ? withTiming(getTimePosition(_now), { 
      duration: 300 
    }) : getTimePosition();
  };

  React.useEffect(() => {
    /** @description Starts the initial positioning */
    handleTimePosition(false);

    /**
     * @description Will be executed every minute which handles the indicators animation */
    const interval = window.setInterval(() => handleTimePosition(), 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  const animatedTopStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: top.value }]
  }))

  /** @description Calculate the position of the current day in the week (0 = Monday, 6 = Sunday) */
  const todayDayIndex = getDay(now) === 0 ? 6 : getDay(now) - 1;

  return (
    <Animated.View style={[CalendarTimeIndicatorStyle.animated, animatedTopStyle, {
      left: 0,
      width: config.totalWidth
    }]}>
      <View style={{ backgroundColor: colors.todayBgColor, height: 1, width: "100%" }} />
      <View style={[CalendarTimeIndicatorStyle.view, { 
        backgroundColor: colors.todayBgColor,
        width: config.width,
        left: config.width * todayDayIndex
     }]}>
        <TextBase 
          text={format(now, "p", { locale: getLocalization() })}
          i18nTranslation={false}
          style={[GlobalTypographyStyle.labelSubtitle, { color: colors.focusedContentColor, fontSize: 10 }]} />
      </View>
    </Animated.View>
  ) 
}

export default CalendarTimeIndicator;