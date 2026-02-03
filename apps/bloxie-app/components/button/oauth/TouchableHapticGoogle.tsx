import React from "react";
import { View } from "react-native";
import { Id } from "../../../../../packages/backend/convex/_generated/dataModel";

import { shadeColor } from "@codemize/helpers/Colors";
import { SIZES } from "@codemize/constants/Fonts";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { startGoogleFlow } from "@/helpers/Provider";
import { useToastStore } from "@/context/ToastContext";
import { useUserContextStore } from "@/context/UserContext";
import { useIntegrationContextStore } from "@/context/IntegrationContext";

import TouchableHaptic from "@/components/button/TouchableHaptic";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import TouchableHapticGoogleStyle from "@/styles/components/button/oauth/TouchableHapticGoogle";

/** 
 * @public
 * @since 0.0.14
 * @version 0.0.3
 * @type */
export type TouchableHapticGoogleProps = {
  userId?: Id<"users">;
};

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.14
 * @version 0.0.6
 * @param {StartGoogleFlowProps} param0 - The props for the Gmail OAuth flow
 * @param {string} param0.email - The email of the user
 * @param {boolean} param0.grantScopeGmail - Whether to grant the Gmail scope
 * @function */
const TouchableHapticGoogle = ({
  userId,
}: TouchableHapticGoogleProps) => {
  const { focusedBgColor, focusedContentColor } = useThemeColors();

  const { open, close } = useToastStore((state) => state);

  /** 
   * @description Get the license from the runtime for checking if the user has the premium license 
   * -> If the user has the premium license, they can connect more than 1 provider
   * @see {@link context/UserContext} */
  const runtime = useUserContextStore((state) => state.runtime);
  const integrations = useIntegrationContextStore((state) => state.integrations);

  /** @description Handles the onPress event for the calendar OAuth flow */
  const onPress = async () => {
    await startGoogleFlow({ userId, grantScopeGmail: false, open });
    close();
  }

  return (
    <>
    {integrations.length < runtime.license.counter.linkedProviderCount &&<TouchableHaptic
      onPress={onPress}>
        <View style={[GlobalContainerStyle.rowCenterStart, TouchableHapticGoogleStyle.view, { backgroundColor: shadeColor(focusedBgColor, 0) }]}>
          <TextBase
            text="Verbinden" 
            type="label" 
            style={[{ color: focusedContentColor, fontSize: Number(SIZES.label) - 1 }]} />
        </View>
    </TouchableHaptic>}
    </>
  );
};

export default TouchableHapticGoogle;