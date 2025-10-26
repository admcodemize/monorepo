import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";
import StackModalHeader from "@/components/container/StackModalHeader";
import { TRAY_CONFIGURATION_ITEMS } from "@/constants/Models";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @component */
const ModalConfigurationWorkflow = () => {
  const tray = TRAY_CONFIGURATION_ITEMS.find((item) => item.key === "workflow");
  return (
    <SafeAreaContextViewBase>
      <StackModalHeader title={tray!.title} />
    </SafeAreaContextViewBase>
  );
};

export default ModalConfigurationWorkflow;