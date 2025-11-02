import { View } from "react-native";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";

import CalendarDayListStyle from "@/styles/components/calendar/day/CalendarDayList";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ListRenderItemHourProps = {
  idx: number;
  hour: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description
 * @since 0.0.2
 * @version 0.0.1
 * @param {Object} param0
 * @param {number} param0.idx - Index of the hour -> Is equal to the hour of the day (0-23)
 * @param {string} param0.hour - Hour of the day (0-23) */
const ListItemHour = ({
  idx,
  hour
}: ListRenderItemHourProps) => {  
  const colors = useThemeColors();
  return (
    <View style={[GlobalContainerStyle.rowStartCenter, CalendarDayListStyle.hour]}>
      {idx !== 0 && <TextBase
        text={hour}
        i18nTranslation={false}
        style={[GlobalTypographyStyle.labelText, { color: colors.infoColor, marginTop: -6 }]} />}
    </View>         
  )
}

export default ListItemHour;