import { DatesInWeekInfoProps } from "@codemize/helpers/DateTime";
import { View } from "react-native";
import TextBase from "@/components/typography/Text";
import TrayHeader from "@/components/container/TrayHeader";
import { STYLES } from "@codemize/constants/Styles";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import Divider from "@/components/container/Divider";
import { format } from "date-fns";
import { getLocalization } from "@/helpers/System";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.6
 * @version 0.0.1
 * @param {ScreenTrayCalendarDayProps} param0
 * @param {DatesInWeekInfoProps} param0.dateInWeek - The date in week information
 * @param {number} param0.dateInWeek.number - The number of the day
 * @param {Date} param0.dateInWeek.now - The date of the day
 * @param {number} param0.dateInWeek.day - The day of the week
 * @param {string} param0.dateInWeek.shortText - The short text of the day
 * @param {string} param0.dateInWeek.longText - The long text of the day
 * @component */
const ScreenTrayCalendarDay = ({ 
  now,
  longText,
}: DatesInWeekInfoProps) => {
  /** @description Used to get the theme based colors */
  const colors = useThemeColors();

  return (
    <View style={{ 
      padding: STYLES.paddingHorizontal, 
      backgroundColor: colors.primaryBgColor, 
      borderColor: colors.primaryBorderColor 
    }}>
      <View style={{ gap: STYLES.sizeGap }}>
        <TrayHeader
          title={longText}
          description={format(now, "EEEE, dd.MM.yyyy", { locale: getLocalization() })} />
        <Divider />
      </View>
    </View>
  );
};

export default ScreenTrayCalendarDay;