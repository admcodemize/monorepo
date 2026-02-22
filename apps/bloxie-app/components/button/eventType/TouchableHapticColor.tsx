import React from "react";
import { GestureResponderEvent, ScrollView, View } from "react-native";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBrush } from "@fortawesome/pro-thin-svg-icons";
import { faSquare } from "@fortawesome/pro-solid-svg-icons";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";
import TouchableHaptic from "@/components/button/TouchableHaptic";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import { KEYS } from "@/constants/Keys";

const COLORS = ["#D47B7B", "#D4A07B", "#D4C17B", "#A8D47B", "#7BD4A0", "#7BD4CA", "#7BB5D4", "#7B8FD4", "#A07BD4", "#C47BD4", "#D47BAF", "#D47B93"];

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.2
 * @type */
export type TouchableHapticColorProps = {
  onChangeValue: (value: string) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.58
 * @version 0.0.1
 * @param {TouchableHapticColorProps} param0 
 * @param {Function} param0.onChangeValue - Callback function when user changed the value of the color
 * @component */
const TouchableHapticColor = ({
  onChangeValue,
}: TouchableHapticColorProps) => {
  const { secondaryBgColor, errorColor, infoColor } = useThemeColors();
  const [selectedColor, setSelectedColor] = React.useState<string>(errorColor);

  const onPressColor = 
  (color: string) =>
  (e: GestureResponderEvent) => {
    setSelectedColor(color);
    onChangeValue(color);
  };

  return (
    <View style={[GlobalWorkflowStyle.touchableParent, {
      justifyContent: "center",
      height: "auto",
      minHeight: 32,
      paddingVertical: 6,
      gap: 12,
      backgroundColor: secondaryBgColor
    }]}>
      <View style={[GlobalContainerStyle.rowCenterBetween]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
          <FontAwesomeIcon 
            icon={faBrush as IconProp} 
            size={STYLES.sizeFaIcon} />
          <TextBase
            text={t("Farbliche Hervorhebung")} 
            style={{ color: infoColor }} />
        </View>
        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
          <FontAwesomeIcon 
            icon={faSquare as IconProp} 
            color={selectedColor}
            size={STYLES.sizeFaIcon + 2} />
        </View>
      </View>
      <ScrollView 
        horizontal={true} 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ gap: 6 }}>
        {COLORS.map((color, index) => (
          <TouchableHaptic 
            key={`${KEYS.eventTypeColor}-${index}`}
            onPress={onPressColor(color)}>
            <FontAwesomeIcon 
              icon={faSquare as IconProp} 
              color={color}
              size={STYLES.sizeFaIcon} />
          </TouchableHaptic>
        ))}
      </ScrollView>
    </View>
  );
};

export default TouchableHapticColor;