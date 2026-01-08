import React from "react";
import { View } from "react-native";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCloudPlus } from "@fortawesome/duotone-thin-svg-icons";
import { Id } from "../../../../../packages/backend/convex/_generated/dataModel";

import { shadeColor } from "@codemize/helpers/Colors";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { startGoogleFlow } from "@/helpers/Provider";
import { useToastStore } from "@/context/ToastContext";
import { useUserContextStore } from "@/context/UserContext";
import { useIntegrationContextStore } from "@/context/IntegrationContext";

import TouchableHaptic from "@/components/button/TouchableHaptic";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
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
 * @version 0.0.5
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
          <FontAwesomeIcon 
            icon={faCloudPlus as IconProp} 
            size={12} 
            color={focusedContentColor} />
          <TextBase 
            text={"i18n.screens.integrations.connect"} 
            type="label" 
            style={[GlobalTypographyStyle.labelText, { color: focusedContentColor }]} />
        </View>
    </TouchableHaptic>}
    </>
  );
};

export default TouchableHapticGoogle;