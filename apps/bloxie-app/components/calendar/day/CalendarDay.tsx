import * as React from "react";

import CalendarDayList from "@/components/calendar/day/CalendarDayList";
import { View } from "react-native";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @type */
export type CalendarDayProps = {
  now?: Date;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description
 * @since 0.0.7
 * @version 0.0.1
 * @param {Object} param0
 * @param {Date} param0.now - Initial start/end date */
const CalendarDay = ({
  now = new Date()
}: CalendarDayProps) => {
  /**
   * @description Handles the displaying of the events for actual date "now" and the possible manually selected slots 
   * Slots => The slot process is a user friendly case for creating a new event especially for the search of a time period 
   * in which the participants are available
   * @see {@link context/CalendarContext} */
  //const events = useCalendarStore((state) => state.events);

  /** @see {@link context/CalendarEventContext} 
  const title = useCalendarEventStore((state) => state.title);
  const slots = useCalendarEventStore((state) => state.slots);

  /**
   * @private
   * @description Maps the slots to the list slots with additional title information 
  const listSlots = React.useMemo((): CalendarDayListSlotProps[]|[] => slots.map((slot) => ({ 
    title, 
    slot 
  })), [slots]) || [];*/

  return (
    <View style={{ flex: 1 }}>
      <CalendarDayList
        //events={getEventsByNow(events, now)}
        //slots={listSlots} 
          />
    </View>
  )
}

export default CalendarDay;