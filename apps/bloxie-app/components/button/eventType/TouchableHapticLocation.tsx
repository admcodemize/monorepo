import React from "react";
import { View } from "react-native";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faMapPin } from "@fortawesome/pro-thin-svg-icons";

import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import { useTrays } from "react-native-trays";

export enum LocationEnum {
  OFFICE = "office",
  ADDRESS = "address",
  GOOGLE_MEET = "googleMeet",
  PHONE = "phone",
  CUSTOM = "custom",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.1
 * @type */
export type TouchableHapticLocationProps = {
  onPress: () => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.58
 * @version 0.0.1
 * @param {TouchableHapticLocationProps} param0 
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @component */
const TouchableHapticLocation = ({
  onPress,
}: TouchableHapticLocationProps) => {
  const refLocation = React.useRef<View>(null);
  const { secondaryBgColor, tertiaryBgColor, infoColor, textColor, labelColor } = useThemeColors();

  const { push, dismiss } = useTrays('keyboard');

  /**
   * @description Used to open the location tray for adding one or more locations
   * @function */
  const onPressLocation = () => {
    push('TrayLocation', {
      onAfterSave: () => {
        dismiss('TrayLocation');
      },
    });
  } 

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: secondaryBgColor,
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faMapPin as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={t("i18n.buttons.location.title")} 
          style={{ color: infoColor }} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 2 }]}>
        <TextBase
          text={`${t("i18n.buttons.location.primary")}: `}
          type="label"
          style={{ color: labelColor }} />
        <TouchableHapticDropdown
          ref={refLocation}
          text={t("Microsoft Teams-Besprechung")}
          backgroundColor={tertiaryBgColor}
          hasViewCustomStyle
          textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
          onPress={onPressLocation}/>
      </View>
    </View>
  );
};

export default TouchableHapticLocation;