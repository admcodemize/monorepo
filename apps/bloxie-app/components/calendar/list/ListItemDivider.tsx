import { View } from "react-native";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ListRenderItemDividerProps = {
  showBorder: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description
 * @since 0.0.2
 * @version 0.0.1 */
const ListItemDivider = ({
  showBorder = true
}: ListRenderItemDividerProps) => {
  const colors = useThemeColors();

  return (
    <View style={{ 
      top: STYLES.calendarHourBorderHeight,
      borderBottomColor: `${colors.primaryBorderColor}80`, 
      height: STYLES.calendarHourHeight / 4, 
      borderBottomWidth: showBorder ? STYLES.calendarHourBorderHeight : 0
    }} />    
  )
}

export default ListItemDivider;