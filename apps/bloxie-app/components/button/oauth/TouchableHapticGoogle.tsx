import React from "react";
import { View } from "react-native";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { useTranslation } from "react-i18next";

import { shadeColor } from "@codemize/helpers/Colors";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { startGoogleFlow } from "@/helpers/Provider";
import { useToastStore } from "@/context/ToastContext";

import TouchableHaptic from "@/components/button/TouchableHaptic";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import TouchableHapticGoogleStyle from "@/styles/components/button/oauth/TouchableHapticGoogle";

/** 
 * @public
 * @since 0.0.14
 * @version 0.0.1
 * @type */
export type TouchableHapticGoogleProps =  {};

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.14
 * @version 0.0.1
 * @param {StartGoogleFlowProps} param0 - The props for the Gmail OAuth flow
 * @param {string} param0.email - The email of the user
 * @param {boolean} param0.grantScopeGmail - Whether to grant the Gmail scope
 * @function */
const TouchableHapticGoogle = ({
}: TouchableHapticGoogleProps) => {
  const { focusedBgColor, focusedContentColor } = useThemeColors();

  const { open, close } = useToastStore((state) => state);

  /** @description Handles the onPress event for the calendar OAuth flow */
  const onPress = async () => {
    await startGoogleFlow({ open });
    close();
  }

  return (
    <TouchableHaptic
      onPress={onPress}>
        <View style={[GlobalContainerStyle.rowCenterStart, TouchableHapticGoogleStyle.view, { backgroundColor: shadeColor(focusedBgColor, 0) }]}>
          <FontAwesomeIcon 
            icon={faPlus as IconProp} 
            size={10} 
            color={focusedContentColor} />
          <TextBase 
            text={"i18n.screens.integrations.connect"} 
            type="label" 
            style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: focusedContentColor }]} />
        </View>
    </TouchableHaptic>
  );
};

export default TouchableHapticGoogle;