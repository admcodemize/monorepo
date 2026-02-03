import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";

import { shadeColor } from "@codemize/helpers/Colors";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import ToastOverlay from "@/components/container/ToastOverlay";
import ScreenConfigurationIntegrationConnection from "@/screens/private/configuration/integration/IntegrationConnect";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.2
 * @component */
const ModalConfigurationIntegrationConnection = () => {
  const { secondaryBgColor } = useThemeColors();
  return (
    <SafeAreaContextViewBase style={{ backgroundColor: shadeColor(secondaryBgColor, 0.3) }}>
      <ScreenConfigurationIntegrationConnection />
      <ToastOverlay />
    </SafeAreaContextViewBase>
  )
}

export default ModalConfigurationIntegrationConnection; 