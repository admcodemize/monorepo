import { TRAY_ACTION_ITEMS } from "@/constants/Models";

import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";
import StackModalHeader from "@/components/container/StackModalHeader";

const KEY = "booking";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @component */
const ModalActionBooking = () => {
  const tray = TRAY_ACTION_ITEMS.find((item) => item.key === KEY);
  return (
    <SafeAreaContextViewBase>
      <StackModalHeader title={tray!.title} />
    </SafeAreaContextViewBase>
  )
}

export default ModalActionBooking;