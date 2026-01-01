
import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";

import { shadeColor } from "@codemize/helpers/Colors";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import ToastOverlay from "@/components/container/ToastOverlay";
import ScreenConfigurationWorkflowProvider from "@/screens/private/modal/configuration/workflow/Provider";
import { stackConfigs, trays } from "@/helpers/Trays";
import { TrayProvider } from "react-native-trays";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.1
 * @component */
const ModalConfigurationWorkflowProvider = () => {
  const { secondaryBgColor } = useThemeColors();
  return (
    <SafeAreaContextViewBase style={{ backgroundColor: shadeColor(secondaryBgColor, 0.3) }}>
      <ScreenConfigurationWorkflowProvider />
      <ToastOverlay />
    </SafeAreaContextViewBase>
  )
}

export default ModalConfigurationWorkflowProvider; 