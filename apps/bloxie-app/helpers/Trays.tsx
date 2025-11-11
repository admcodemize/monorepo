import ScreenTrayAction from "@/screens/private/tray/Action";
import ScreenTrayCalendarDay from "@/screens/private/tray/CalendarDay";
import { DatesInWeekInfoProps } from "@codemize/helpers/DateTime";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @constant */
export const stackConfigs = {
  main: {
    dismissOnBackdropPress: true,
    enableSwipeToClose: true,
    horizontalSpacing: 10,
    backdropStyles: { backgroundColor: "#00000030" },
    trayStyles: { 
      paddingHorizontal: 6,
      borderRadius: 20,
      borderWidth: 0,
      borderColor: "#dfdfdf"
    }
  },
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @object */
export const trays = {
  ActionTray: { component: ScreenTrayAction },
  CalendarDayTray: { component: (dateInWeek: DatesInWeekInfoProps ) => <ScreenTrayCalendarDay {...dateInWeek} /> }
};