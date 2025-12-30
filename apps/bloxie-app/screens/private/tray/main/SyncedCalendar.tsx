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
 * @since 0.0.13
 * @version 0.0.1
 * @component */
const ScreenTraySyncedCalendar = ({ 

}) => {
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
          title={"Synchronisierte Kalender"}
          description={"Synchronisierte Kalender"} />
      </View>
    </View>
  );
};

export default ScreenTraySyncedCalendar;