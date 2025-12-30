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
 * @since 0.0.34
 * @version 0.0.1
 * @type */
export type ScreenTrayTemplatesProps = {
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.1
 * @param {ScreenTrayTemplatesProps} param0
 * @component */
const ScreenTrayTemplates = ({ 
}: ScreenTrayTemplatesProps) => {
  /** @description Used to get the theme based colors */
  const colors = useThemeColors();

  return (
    <View style={{ 
      padding: STYLES.paddingHorizontal, 
      backgroundColor: colors.primaryBgColor, 
      borderColor: colors.primaryBorderColor,
      height: 460
    }}>
      <View style={{ gap: STYLES.sizeGap }}>
        <TrayHeader
          title={"i18n.screens.trayWorkflowTemplates.title"}
          description={"i18n.screens.trayWorkflowTemplates.description"} />
        <Divider />
      </View>
    </View>
  );
};

export default ScreenTrayTemplates;