import React from "react";
import Animated, { runOnJS, SharedValue, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import CalendarMonthHeader from "@/components/calendar/month/CalendarMonthHeader";
import CalendarMonthList from "@/components/calendar/month/CalendarMonthList";
import { useCalendarContextStore } from "@/context/CalendarContext";

const COLLAPSED_HEIGHT = 0;
const WEEK_HEIGHT = 30;
const HEADER_HEIGHT = 60;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarMonthProps = {
  isExpanded: SharedValue<boolean>;
  timingDuration?: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @param {CalendarMonthProps} param0
 * @param {SharedValue<boolean>} param0.isExpanded - The shared value for the expanded state of the month calendar -> Opens the month calendar view with reanimated styling
 * @component */
const CalendarMonth = ({
  isExpanded,
  timingDuration = 300
}: CalendarMonthProps) => {
  const colors = useThemeColors();

  /** 
   * @description Get the current week and months from the context store for getting the map index of the month
   * @see {@link context/CalendarContext} */
  const week = useCalendarContextStore((state) => state.week);
  const months = useCalendarContextStore((state) => state.cached.months);

  /** @description Finds the index of the month in the months array for setting the correct weeks count */
  const index = Array.from(months.values()).findIndex(
    ({ year, month }) => year === week.year && month === week.month
  );

  const height = useSharedValue<number>(COLLAPSED_HEIGHT);
  const weeks = useSharedValue<number>(months.get(index)?.weeks.length ?? 5);

  /**
   * @description Handles the weeks change event by updating the shared value.
   * The animated reaction below will react to this change and adjust the height. */
  const onWeeksChange = (nextWeeks: number) => {
    weeks.value = nextWeeks;
  };

  React.useEffect(() => {
    const currentWeeks = months.get(index)?.weeks.length ?? 5;
    weeks.value = currentWeeks;
  }, [index, months, weeks]);
  
  /** @description Animated reaction to the weeks change event and adjust the height */
  useAnimatedReaction(
    () => ({ expanded: isExpanded.value, weekCount: weeks.value }),
    ({ expanded, weekCount }) => {
      const target = expanded
        ? weekCount * WEEK_HEIGHT + HEADER_HEIGHT + weekCount * 2.25
        : COLLAPSED_HEIGHT;
  
      height.value = withTiming(target, { duration: timingDuration });
    },
  );
  
  /** @description Animated style for the month calendar -> Used for the reanimated styling */
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      overflow: 'hidden',
    };
  });
  
  return (
    <Animated.View style={[animatedStyle, { 
      borderBottomWidth: 1,
      borderBottomColor: colors.primaryBorderColor,
    }]}>
      <CalendarMonthHeader />
      <CalendarMonthList onWeeksChange={onWeeksChange} />
    </Animated.View>
  );
};

export default CalendarMonth;