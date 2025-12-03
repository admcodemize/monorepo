import React from "react";

import ViewBase from "@/components/container/View";
import HorizontalNavigation from "@/components/container/HorizontalNavigation";

import ScreenConfigurationIntegrationProvider from "@/screens/private/modal/configuration/integration/Provider";
import ScreenConfigurationIntegrationConnection from "@/screens/private/modal/configuration/integration/Connection";
import ScreenConfigurationIntegrationSynchronisation from "@/screens/private/modal/configuration/integration/Synchronisation";

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
  const horizontalNavigation = () => ([
    { title: "i18n.screens.integrations.horizontalNavigation.provider", component: <ScreenConfigurationIntegrationProvider /> },
    { title: "i18n.screens.integrations.horizontalNavigation.connections", component: <ScreenConfigurationIntegrationConnection /> },
    { title: "i18n.screens.integrations.horizontalNavigation.synchronization", component: <ScreenConfigurationIntegrationSynchronisation /> },
  ]);

  return (
    <ViewBase>
      <HorizontalNavigation horizontalNavigation={horizontalNavigation()} />
    </ViewBase>
  )
}

export default ScreenConfigurationIntegration;