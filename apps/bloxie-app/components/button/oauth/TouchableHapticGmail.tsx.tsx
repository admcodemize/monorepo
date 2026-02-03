import React from "react";
import { View } from "react-native";
import { Id } from "../../../../../packages/backend/convex/_generated/dataModel";

import { shadeColor } from "@codemize/helpers/Colors";
import { SIZES } from "@codemize/constants/Fonts";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { startGoogleFlow, StartGoogleFlowProps } from "@/helpers/Provider";

import TouchableHaptic from "@/components/button/TouchableHaptic";
import TextBase from "@/components/typography/Text";

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
 * @version 0.0.6
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
          <TextBase 
            text="Verbinden" 
            type="label" 
            style={[{ color: focusedContentColor, fontSize: Number(SIZES.label) - 1 }]} />
        </View>
    </TouchableHaptic>
  );
};

export default TouchableHapticGmail;