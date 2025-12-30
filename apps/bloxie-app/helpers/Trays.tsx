import ScreenTrayAction from "@/screens/private/tray/main/Action";
import ScreenTrayCalendarDay from "@/screens/private/tray/main/CalendarDay";
import ScreenTrayDashboard from "@/screens/private/tray/main/Dashboard";
import ScreenTraySyncedCalendar from "@/screens/private/tray/main/SyncedCalendar";
import ScreenTrayEditAction from "@/screens/private/tray/modal/workflow/EditAction";
import ScreenTrayTemplates from "@/screens/private/tray/modal/workflow/Templates";
import ScreenTrayWorkflows from "@/screens/private/tray/modal/workflow/Workflows";
import { DatesInWeekInfoProps } from "@codemize/helpers/DateTime";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.1
 * @constant */
const defaultStackConfig = {
  dismissOnBackdropPress: true,
  enableSwipeToClose: true,
  adjustForKeyboard: true,
  horizontalSpacing: 10,
  backdropStyles: { backgroundColor: "#00000030" },
  trayStyles: { 
    paddingHorizontal: 6,
    borderRadius: 20,
    borderWidth: 0,
    borderColor: "#dfdfdf",
  }
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @constant */
export const stackConfigs = {
  main: defaultStackConfig  ,
  modal: {
    ...defaultStackConfig,
    dismissOnBackdropPress: false,
    enableSwipeToClose: false,
    trayStyles: {
      paddingHorizontal: 0,
      borderRadius: 14,
      marginBottom: 4 // -> can be used to get e small margin between keyboard and tray
    }
  },
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.3
 * @object */
export const trays = {
  main: {
    ActionTray: { component: ScreenTrayAction },
    SyncedCalendarTray: { component: ScreenTraySyncedCalendar },
    DashboardTray: { component: ScreenTrayDashboard },
    CalendarDayTray: { component: (dateInWeek: DatesInWeekInfoProps ) => <ScreenTrayCalendarDay {...dateInWeek} /> },
  },
  modal: {
    WorkflowEditActionTray: { component: ({ functionItem, onAfterSave }: { functionItem: any, onAfterSave: () => void }) => <ScreenTrayEditAction onAfterSave={onAfterSave} /> },
    WorkflowTemplatesTray: { component: ScreenTrayTemplates },
    WorkflowListTray: { component: ScreenTrayWorkflows },
  },
};