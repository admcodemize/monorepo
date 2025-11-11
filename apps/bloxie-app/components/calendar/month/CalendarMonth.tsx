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

  /** @description Local state for the expanded state of the month calendar -> Used for re-rendering the month calendar when parent component updates the shared value */
  const [isExpandedInternal, setIsExpandedInternal] = React.useState<boolean>(false);

  /** 
   * @description Updates the height of the month calendar
   * @param {number} weeks - The weeks count of the month
   * @see {@link @/components/calendar/month/CalendarMonthList} */
  const updateHeight = (weeks: number) => {
    const targetHeight = (weeks * WEEK_HEIGHT) + HEADER_HEIGHT + (weeks * 2.25);
    height.value = withTiming(isExpanded.value ? targetHeight : COLLAPSED_HEIGHT, {
      duration: timingDuration,
    });
  };

  /** 
   * @description Handles the weeks change event for updating the height of the month calendar
   * @param {number} weeks - The weeks count of the month
   * @see {@link @/components/calendar/month/CalendarMonthList} */
  const onWeeksChange = (weeks: number) => updateHeight(weeks);

  /** @description Watch the shared value and update local state */
  useAnimatedReaction(
    () => isExpanded.value,
    (currentValue) => runOnJS(setIsExpandedInternal)(currentValue)
  );

  /** @description Update the height of the month calendar when the expanded state changes */
  React.useEffect(() => {
    updateHeight(weeks.value);
  }, [isExpandedInternal]);
  
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