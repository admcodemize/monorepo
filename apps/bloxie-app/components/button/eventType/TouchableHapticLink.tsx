import React from "react";
import { GestureResponderEvent, TextInput, View } from "react-native";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faLink } from "@fortawesome/pro-thin-svg-icons";
import { faTrashSlash } from "@fortawesome/duotone-thin-svg-icons";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import TouchableHapticIcon from "../TouchableHaptichIcon";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.3
 * @type */
export type TouchableHapticLinkProps = {
  link: string;
  name: string;
  onPressRemove: (e: GestureResponderEvent) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.58
 * @version 0.0.3
 * @param {TouchableHapticLinkProps} param0 
 * @param {string} param0.link - The link 
 * @param {string} param0.name - The name of the link
 * @param {Function} param0.onPressRemove - Callback function when user pressed the remove button
 * @component */
const TouchableHapticLink = ({
  link,
  name,
  onPressRemove,
}: TouchableHapticLinkProps) => {
  const { secondaryBgColor, infoColor, errorColor } = useThemeColors();

  const [linkInternal, setLinkInternal] = React.useState<string>(link);
  const [nameInternal, setNameInternal] = React.useState<string>(name);

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: secondaryBgColor,
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faLink as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextInput
          value={nameInternal}
          onChangeText={setNameInternal}
          selectionColor={infoColor}
          cursorColor={infoColor}
          placeholder={t("Anzeigename")}
          style={[GlobalTypographyStyle.inputText, {
            textAlign: "left",
            color: infoColor,
            minWidth: 100
          }]} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
        <TextInput
          value={linkInternal}
          onChangeText={setLinkInternal}
          selectionColor={infoColor}
          cursorColor={infoColor}
          placeholder={t("www.url.com")}
          keyboardType="url"
          autoCapitalize="none"
          style={[GlobalTypographyStyle.labelText, {
            color: infoColor
          }]} />
        <TouchableHapticIcon 
          icon={faTrashSlash as IconProp} 
          iconSize={STYLES.sizeFaIcon} 
          iconColor={errorColor}
          hasViewCustomStyle={true} 
          onPress={onPressRemove} />
      </View>
    </View>
  );
};

export default TouchableHapticLink;