import { TRAY_ACTION_ITEMS } from "@/constants/Models";

import Calendar from "@/components/calendar/Calendar";
import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";
import StackModalHeader from "@/components/container/StackModalHeader";

const KEY = "meeting";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @component */
const ModalActionMeeting = () => {
  const tray = TRAY_ACTION_ITEMS.find((item) => item.key === KEY);
  return (
    <SafeAreaContextViewBase>
      <StackModalHeader
        title={tray!.title}
        description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."} />
      <Calendar />
    </SafeAreaContextViewBase>
  )
}

export default ModalActionMeeting;