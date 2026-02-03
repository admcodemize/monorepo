
import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";

import { shadeColor } from "@codemize/helpers/Colors";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import ScreenConfigurationWorkflowBuilder from "@/screens/private/configuration/workflow/WorkflowBuilder";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.1
 * @component */
const ModalConfigurationWorkflowBuilder = () => {
  const { secondaryBgColor } = useThemeColors();
  
  return (
    <SafeAreaContextViewBase style={{ backgroundColor: shadeColor(secondaryBgColor, 0.3) }}>
      <ScreenConfigurationWorkflowBuilder />
    </SafeAreaContextViewBase>
  )
}

export default ModalConfigurationWorkflowBuilder; 