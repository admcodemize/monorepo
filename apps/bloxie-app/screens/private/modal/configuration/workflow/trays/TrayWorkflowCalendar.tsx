import { ConvexTemplateAPIProps } from "@codemize/backend/Types";

import ListWorkflowTemplate from "@/screens/private/modal/configuration/workflow/lists/ListWorkflowTemplate";
import TrayContainer from "@/components/container/TrayContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @component */
export type ScreenTrayWorkflowCalendarProps = {
  onPress: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @param {ScreenTrayWorkflowCalendarProps} param0
 * @param {() => void} param0.onPress - The function to call when the calendar is pressed
 * @component */
const ScreenTrayWorkflowCalendar = ({
  onPress,
}: ScreenTrayWorkflowCalendarProps) => {
  return (
    <TrayContainer 
      title={"i18n.screens.trayWorkflowCalendar.title"} 
      description={"i18n.screens.trayWorkflowCalendar.description"}>

    </TrayContainer>
  );
};

export default ScreenTrayWorkflowCalendar;