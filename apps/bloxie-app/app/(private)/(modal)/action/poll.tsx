import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";
import StackModalHeader from "@/components/container/StackModalHeader";
import { TRAY_ACTION_ITEMS } from "@/constants/Models";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @component */
const ModalActionPoll = () => {
  const tray = TRAY_ACTION_ITEMS.find((item) => item.key === "poll");
  return (
    <SafeAreaContextViewBase>
      <StackModalHeader title={tray!.title} />
    </SafeAreaContextViewBase>
  )
}

export default ModalActionPoll;