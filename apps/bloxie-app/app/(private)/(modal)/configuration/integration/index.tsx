
import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";

import { shadeColor } from "@codemize/helpers/Colors";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import ToastOverlay from "@/components/container/ToastOverlay";
import ScreenConfigurationIntegrationProvider from "@/screens/private/modal/configuration/integration/IntegrationProvider";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.2
 * @component */
const ModalConfigurationIntegrationProvider = () => {
  const { secondaryBgColor } = useThemeColors();
  return (
    <SafeAreaContextViewBase style={{ backgroundColor: shadeColor(secondaryBgColor, 0.3) }}>
      <ScreenConfigurationIntegrationProvider />
      <ToastOverlay />
    </SafeAreaContextViewBase>
  )
}

export default ModalConfigurationIntegrationProvider; 