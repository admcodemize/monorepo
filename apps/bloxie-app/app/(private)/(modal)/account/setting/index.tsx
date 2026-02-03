
import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";

import { shadeColor } from "@codemize/helpers/Colors";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import ToastOverlay from "@/components/container/ToastOverlay";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.54
 * @version 0.0.1
 * @component */
const ModalAccountSetting = () => {
  const { secondaryBgColor } = useThemeColors();
  return (
    <SafeAreaContextViewBase style={{ backgroundColor: shadeColor(secondaryBgColor, 0.3) }}>
      <ToastOverlay />
    </SafeAreaContextViewBase>
  )
}

export default ModalAccountSetting; 