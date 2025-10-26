import { faArrowUpRightFromSquare } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { GestureResponderEvent, Pressable, View, ViewStyle } from "react-native";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHaptic, { onPressHaptic } from "@/components/button/TouchableHaptic";
import DashboardCardIcon from "@/components/layout/dashboard/card/DashboardCardIcon";
import DashboardCardValue from "@/components/layout/dashboard/card/DashboardCardValue";
import TextBase from "@/components/typography/Text";

import DashboardCardStyle from "@/styles/components/layout/dashboard/DashboardCard";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @enum */
export enum DashboardCardPercentageType {
  upwards = "upwards",
  downwards = "downwards",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DashboardCardProps = {
  icon: IconProp;
  title: string;
  value: string;
  percentage: string;
  percentageType?: DashboardCardPercentageType;
  showDetails?: boolean;
  onPressDetails?: () => void;
  onPress?: (e: GestureResponderEvent) => void;
  style?: ViewStyle;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {DashboardCardProps} param0
 * @param {IconProp} param0.icon - The icon of the card
 * @param {string} param0.title - The title of the card
 * @param {string} param0.value - The value of the card
 * @param {string} param0.percentage - The percentage of the card 
 * -> Color of the percentage will be determined by the enum property "percentageType"
 * @param {DashboardCardPercentageType} param0.percentageType - The type of the percentage which will determine the color of the percentage
 * @param {boolean} param0.showDetails - Whether to show the details button
 * @param {() => void} param0.onPressDetails - The function to call when the details button is pressed
 * @param {() => void} param0.onPress - The function to call when the card is pressed
 * @param {ViewStyle} param0.style - Additional style for the card container
 * @component */
const DashboardCard = ({
  icon,
  title,
  value,
  percentage,
  percentageType = DashboardCardPercentageType.upwards,
  showDetails = false,
  onPressDetails = () => {},
  onPress = () => {},
  style,
}: DashboardCardProps) => {
  const colors = useThemeColors();

  return (
    <Pressable 
      onPress={onPressHaptic(onPress)}
      style={[GlobalContainerStyle.rowCenterBetween, DashboardCardStyle.container, { 
        backgroundColor: colors.dashboardCardBgColor,
      }, style]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { 
          gap: STYLES.sizeGap 
        }]}>
          <DashboardCardIcon icon={icon} />
          <DashboardCardValue 
            title={title} 
            value={value} 
            percentage={percentage}
            percentageType={percentageType} />
        </View>
        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: STYLES.sizeGap }]}>
          {showDetails && <TouchableHaptic 
            onPress={onPressDetails}
            style={[GlobalContainerStyle.rowCenterCenter, DashboardCardStyle.details, { 
              backgroundColor: colors.dashboardCardIconBgColor, 
              borderColor: colors.secondaryBorderColor,
            }]}>
              <TextBase
                text="details"
                color={colors.dashboardCardTitleColor}
                style={[GlobalTypographyStyle.titleSubtitle, { fontSize: 10 }]} />
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare as IconProp}
                size={STYLES.sizeFaIcon - 2}
                color={colors.primaryIconColor} />
          </TouchableHaptic>}
        </View>
    </Pressable>
  )
}

export default DashboardCard;