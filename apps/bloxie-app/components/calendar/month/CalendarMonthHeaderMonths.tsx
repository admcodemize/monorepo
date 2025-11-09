import React from "react";
import { GestureResponderEvent } from "react-native";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import { getMonth } from "date-fns";

import { getMonths, MonthInfoObjProps } from "@codemize/helpers/DateTime";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { getLocalization } from "@/helpers/System";

import TouchableHapticText from "@/components/button/TouchableHaptichText";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @component */
const CalendarMonthHeaderMonths = () => {
  const locale = getLocalization();
  const colors = useThemeColors();

  /** @description Handles the highlighting of the selected month inside the list */
  const [selected, setSelected] = React.useState<number>(getMonth(new Date()));

  /** 
   * @description Loads the months from the helper with localization
   * @see {@link @codemize/helpers/DateTime} */
  const months = React.useMemo(() => {
    return getMonths(locale);
  }, [locale]);

  /** @description Calculate the initial scroll index based on the current month */
  const initialScrollIndex = React.useMemo(() => {
    return getMonth(new Date()); // 0-11 (Januar = 0, Dezember = 11)
  }, []);

  /** 
   * @description Handles the press event of the months
   * @param {number} number - The number of the month to select
   * @function */
  const onPress = React.useCallback(
    (number: number) => 
    (e: GestureResponderEvent) => setSelected(number), []);

  /** @description Key extractor for the months */
  const keyExtractor = React.useCallback((item: MonthInfoObjProps) => item.number.toString(), []);

  /** @description Render item for the months */
  const renderItem = React.useCallback(({ item }: LegendListRenderItemProps<MonthInfoObjProps>) => 
    <TouchableHapticText
      text={item.longText}
      i18nTranslation={false}
      hasViewCustomStyle={true}
      textCustomStyle={{ color: item.number === selected ? colors.focusedBgColor : colors.infoColor }}
      onPress={onPress(item.number)} />, [selected, colors.focusedBgColor, colors.infoColor, onPress]);

  return (
    <LegendList
      horizontal
      data={months}
      estimatedItemSize={100}
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialScrollIndex}
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

export default CalendarMonthHeaderMonths;