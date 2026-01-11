
import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";

import { shadeColor } from "@codemize/helpers/Colors";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import ToastOverlay from "@/components/container/ToastOverlay";
import ScreenConfigurationIntegrationProvider from "@/screens/private/modal/configuration/integration/IntegrationProvider";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.1
 * @component */
const ModalConfigurationIntegrationProvider = () => {
  const { tertiaryBgColor } = useThemeColors();
  return (
    <SafeAreaContextViewBase style={{ backgroundColor: shadeColor(tertiaryBgColor, 0.7) }}>
      <ScreenConfigurationIntegrationProvider />
      <ToastOverlay />
    </SafeAreaContextViewBase>
  )
}

export default ModalConfigurationIntegrationProvider; 