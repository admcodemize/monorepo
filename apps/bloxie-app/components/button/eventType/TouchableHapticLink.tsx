import React from "react";
import { TextInput, View } from "react-native";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faLink, faMapPin } from "@fortawesome/pro-thin-svg-icons";
import { faTrashSlash } from "@fortawesome/duotone-thin-svg-icons";

import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import TouchableHapticIcon from "../TouchableHaptichIcon";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.1
 * @type */
export type TouchableHapticLinkProps = {
  onPress: () => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.58
 * @version 0.0.1
 * @param {TouchableHapticLinkProps} param0 
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @component */
const TouchableHapticLink = ({
  onPress,
}: TouchableHapticLinkProps) => {
  const refLink = React.useRef<View>(null);
  const { secondaryBgColor, tertiaryBgColor, infoColor, textColor, labelColor, errorColor } = useThemeColors();

  const [linkValue, setLinkValue] = React.useState<string>("");
  const [linkName, setLinkName] = React.useState<string>("");
  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: secondaryBgColor,
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faLink as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={t("#1")}
          style={{ color: labelColor }} />
        <TextInput
          value={linkName}
          onChangeText={setLinkName}
          selectionColor={infoColor}
          cursorColor={infoColor}
          placeholder={t("Anzeigename")}
          //keyboardType="url"
          style={[GlobalTypographyStyle.inputText, {
            textAlign: "left",
            color: infoColor,
            minWidth: 100
          }]} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
        <TextInput
          value={linkValue}
          onChangeText={setLinkValue}
          selectionColor={infoColor}
          cursorColor={infoColor}
          placeholder={t("www.url.com")}
          keyboardType="url"
          style={[GlobalTypographyStyle.labelText, {
            color: infoColor
          }]} />
        <TouchableHapticIcon 
          icon={faTrashSlash as IconProp} 
          iconSize={STYLES.sizeFaIcon} 
          iconColor={errorColor}
          hasViewCustomStyle={true} 
          onPress={() => {}} />
      </View>
    </View>
  );
};

export default TouchableHapticLink;