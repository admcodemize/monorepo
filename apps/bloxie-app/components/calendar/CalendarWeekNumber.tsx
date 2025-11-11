import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useCalendarContextStore } from "@/context/CalendarContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import CalendarWeekNumberStyle from "@/styles/components/calendar/CalendarWeekNumber";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Calendar week number component
 * @since 0.0.2
 * @version 0.0.2
 * @component */
const CalendarWeekNumber = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();

  /** @description Current week number for display in the header */
  const number = useCalendarContextStore((state) => state.week.number);

  return (
    <View style={[GlobalContainerStyle.columnCenterStart, CalendarWeekNumberStyle.number, { 
      borderRightColor: `${colors.secondaryBorderColor}60`,
      height: STYLES.calendarHeaderHeight,
      paddingVertical: 7,
      gap: 4
    }]}>
      <TextBase text={t("i18n.calendar.week")} style={[GlobalTypographyStyle.headerSubtitle, { fontSize: 9, color: colors.infoColor }]} />
      <TextBase text={number.toString()} style={[GlobalTypographyStyle.headerSubtitle, { fontSize: 10, color: colors.infoColor, height: 16 }]} />
    </View>
  );
};

export default CalendarWeekNumber;