import React from "react";
import { View } from "react-native";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClouds } from "@fortawesome/duotone-thin-svg-icons";
import { Id } from "../../../../../packages/backend/convex/_generated/dataModel";

import { shadeColor } from "@codemize/helpers/Colors";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { startGoogleFlow, StartGoogleFlowProps } from "@/helpers/Provider";

import TouchableHaptic from "@/components/button/TouchableHaptic";

import GlobalContainerStyle from "@/styles/GlobalContainer";
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
 * @version 0.0.5
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
            icon={faClouds as IconProp} 
            size={12} 
            color={focusedContentColor} />
        </View>
    </TouchableHaptic>
  );
};

export default TouchableHapticGmail;