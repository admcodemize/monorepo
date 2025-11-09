import React from "react";
import { GestureResponderEvent } from "react-native";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import { getYear } from "date-fns";

import { getYears } from "@codemize/helpers/DateTime";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { WEEKS_IN_FUTURE, WEEKS_IN_PAST } from "@/context/CalendarContext";

import TouchableHapticText from "@/components/button/TouchableHaptichText";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @component */
const CalendarMonthHeaderYears = () => {
  const colors = useThemeColors();

  /** @description Handles the highlighting of the selected year inside the list */
  const [selected, setSelected] = React.useState<number>(getYear(new Date()));

  /** 
   * @description Loads the years from the helper
   * @see {@link @codemize/helpers/DateTime/getYears} */
  const years = React.useMemo(() => getYears({ 
    now: new Date(), 
    yearsInPast: (WEEKS_IN_PAST / 52),
    yearsInFuture: (WEEKS_IN_FUTURE / 52)
  }), []);

  /** 
   * @description Handles the press event of the years
   * @param {number} year - The year to select
   * @function */
  const onPress = React.useCallback(
    (year: number) => 
    (e: GestureResponderEvent) => setSelected(year), []);

  /** @description Key extractor for the years */
  const keyExtractor = React.useCallback((item: number) => item.toString(), []);

  /** @description Render item for the years */
  const renderItem = React.useCallback(({ item }: LegendListRenderItemProps<number>) => 
    <TouchableHapticText
      text={item.toString()}
      i18nTranslation={false}
      hasViewCustomStyle={true}
      textCustomStyle={{ color: item === selected ? colors.focusedBgColor : colors.infoColor }}
      onPress={onPress(item)} />, [selected, colors.focusedBgColor, colors.infoColor, onPress]);

  return (
    <LegendList
      horizontal
      data={years}
      estimatedItemSize={80}
      showsHorizontalScrollIndicator={false}
      snapToAlignment="start"
      decelerationRate="fast"
      bounces={false}
      overScrollMode="never"
      contentContainerStyle={{ gap: 10 }}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      extraData={selected}
    />
  )
}

export default CalendarMonthHeaderYears;