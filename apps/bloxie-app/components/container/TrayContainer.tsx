import { PropsWithChildren } from "react";
import { View, Dimensions } from "react-native"

import { shadeColor } from "@codemize/helpers/Colors"
import { STYLES } from "@codemize/constants/Styles";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TrayHeader from "@/components/container/TrayHeader"

import TrayContainerStyle from "@/styles/components/container/TrayContainer";

const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @type */
export type TrayContainerProps = PropsWithChildren & {
  title: string;
  description?: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @param {TrayContainerProps} param0
 * @param {string} param0.title - The title of the tray container
 * @param {string} param0.description - The description of the tray container (below the title => Maximum of 3 lines)
 * @param {React.ReactNode} param0.children - The children to display inside the tray container (white background with a border)
 * @component */
const TrayContainer = ({
  title,
  description,
  children,
}: TrayContainerProps) => {
  const { primaryBgColor, primaryBorderColor, secondaryBgColor, tertiaryBgColor } = useThemeColors();
  return (
    <View style={{ 
      backgroundColor: primaryBgColor, 
      borderColor: primaryBorderColor,
      height: children ? 'auto' : DIM.height - 100,
    }}>
      <View style={{ gap: STYLES.sizeGap }}>
        <View style={[TrayContainerStyle.container, { backgroundColor: shadeColor(secondaryBgColor, 0.3) }]}>
          <View style={TrayContainerStyle.header}>
          <TrayHeader
            title={title}
            description={description} />
          </View>
          <View style={[TrayContainerStyle.children, {
            borderColor: shadeColor(primaryBorderColor, 0.4),
            backgroundColor: shadeColor(tertiaryBgColor, 0.8), 
            paddingVertical: STYLES.paddingVertical,
            height: children ? 'auto' : DIM.height - 146,
          }]}>
            {children}
          </View>
        </View>
      </View>
    </View>
  )
}

export default TrayContainer;