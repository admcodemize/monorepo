import React from "react";
import { View } from "react-native";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import ViewBase from "@/components/container/View";
import TextBase from "@/components/typography/Text";
import HorizontalNavigation from "@/components/container/HorizontalNavigation";

import ScreenConfigurationIntegrationProvider from "@/screens/private/modal/configuration/integration/Provider";
import ScreenConfigurationIntegrationConnection from "@/screens/private/modal/configuration/integration/Connection";

import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.18
 * @version 0.0.1
 * @type */
export type ScreenConfigurationIntegrationProps = {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.16
 * @version 0.0.2
 * @component */
const ScreenConfigurationIntegration = ({
}: ScreenConfigurationIntegrationProps) => {
  const { textColor } = useThemeColors();

  const horizontalNavigation = () => ([
    { title: "i18n.screens.integrations.horizontalNavigation.provider", component: <ScreenConfigurationIntegrationProvider /> },
    { title: "i18n.screens.integrations.horizontalNavigation.connections", component: <ScreenConfigurationIntegrationConnection /> },
    { title: "i18n.screens.integrations.horizontalNavigation.synchronization", component: <View><TextBase text="Synchronisation" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 10, color: textColor }]} /></View> },
  ]);

  return (
    <ViewBase>
      <HorizontalNavigation horizontalNavigation={horizontalNavigation()} />
    </ViewBase>
  )
}

export default ScreenConfigurationIntegration;