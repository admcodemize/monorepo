import React from "react";
import { View } from "react-native";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { Id } from "../../../../../packages/backend/convex/_generated/dataModel";

import { shadeColor } from "@codemize/helpers/Colors";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { startGoogleFlow, StartGoogleFlowProps } from "@/helpers/Provider";

import TouchableHaptic from "@/components/button/TouchableHaptic";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import TouchableHapticGmailStyle from "@/styles/components/button/oauth/TouchableHapticGmail";

/** 
 * @public
 * @since 0.0.14
 * @version 0.0.3
 * @type */
export type TouchableHapticGmailProps = {
  userId?: Id<"users">;
} & StartGoogleFlowProps;

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.14
 * @version 0.0.4
 * @param {StartGoogleFlowProps} param0 - The props for the Gmail OAuth flow
 * @param {Id<"users">} param0.userId - The convex user id
 * @param {string} param0.email - The email of the user
 * @param {boolean} param0.grantScopeGmail - Whether to grant the Gmail scope
 * @function */
const TouchableHapticGmail = ({
  userId,
  email,
  grantScopeGmail,
}: TouchableHapticGmailProps) => {
  const { focusedBgColor, focusedContentColor } = useThemeColors();

  /** @description Handles the onPress event for the Gmail OAuth flow */
  const onPress = async () => await startGoogleFlow({ userId, email, grantScopeGmail });

  return (
    <TouchableHaptic
      onPress={onPress}>
        <View style={[GlobalContainerStyle.rowCenterStart, TouchableHapticGmailStyle.view, { backgroundColor: shadeColor(focusedBgColor, 0) }]}>
          <FontAwesomeIcon 
            icon={faPlus as IconProp} 
            size={12} 
            color={focusedContentColor} />
          <TextBase 
            text={"i18n.screens.integrations.connect"} 
            type="label" 
            style={[GlobalTypographyStyle.labelText, { color: focusedContentColor }]} />
        </View>
    </TouchableHaptic>
  );
};

export default TouchableHapticGmail;