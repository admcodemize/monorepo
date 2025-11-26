import { TRAY_CONFIGURATION_ITEMS } from "@/constants/Models";

import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";
import StackModalHeader from "@/components/container/StackModalHeader";

import ScreenConfigurationIntegration from "@/screens/private/modal/configuration/Integration";
import ToastOverlay from "@/components/container/ToastOverlay";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.12
 * @version 0.0.2
 * @component */
const ModalConfigurationIntegration = () => {
  const tray = TRAY_CONFIGURATION_ITEMS.find((item) => item.key === "integration");
  return (
    <SafeAreaContextViewBase>
      <StackModalHeader 
        title={tray!.title} 
        description={tray?.modal || ""} />
      <ScreenConfigurationIntegration />
      <ToastOverlay />
    </SafeAreaContextViewBase>
  )
}

export default ModalConfigurationIntegration; 