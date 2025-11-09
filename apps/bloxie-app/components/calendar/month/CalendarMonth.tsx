import React from "react";
import Animated, { runOnJS, SharedValue, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import CalendarMonthHeader from "@/components/calendar/month/CalendarMonthHeader";
import CalendarMonthList from "@/components/calendar/month/CalendarMonthList";

const COLLAPSED_HEIGHT = 0;
const EXPANDED_HEIGHT = 225;

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
  const height = useSharedValue(COLLAPSED_HEIGHT);

  /** @description Local state for the expanded state of the month calendar -> Used for re-rendering the month calendar when parent component updates the shared value */
  const [isExpandedInternal, setIsExpandedInternal] = React.useState<boolean>(false);

  /** @description Watch the shared value and update local state */
  useAnimatedReaction(
    () => isExpanded.value,
    (currentValue) => runOnJS(setIsExpandedInternal)(currentValue)
  );

  /** @description Update the height of the month calendar when the expanded state changes */
  React.useEffect(() => {
    height.value = withTiming(
      isExpandedInternal ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
      { duration: timingDuration });
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
      <CalendarMonthList />
    </Animated.View>
  );
};

export default CalendarMonth;