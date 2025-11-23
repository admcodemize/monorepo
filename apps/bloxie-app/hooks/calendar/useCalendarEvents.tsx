import * as React from "react";
import { isEqual, startOfDay } from "date-fns";

import { useQuery } from "convex/react";
import { api } from "../../../../packages/backend/convex/_generated/api";
import { Id } from "../../../../packages/backend/convex/_generated/dataModel";
import { ConvexEventsAPIProps } from "../../../../packages/backend/Types";
import { ConvexUsersAPIProps } from "../../../../packages/backend/Types";

import { useCalendarContextStore } from "@/context/CalendarContext";
import { KEYS } from "@/constants/Keys";

/**
 * @private
 * @description Props for the useCalendarEvents hook
 * @since 0.0.8
 * @version 0.0.1 */
type UseCalendarEventsProps = {
  componentId?: string;
  convexUser: ConvexUsersAPIProps|undefined;
  onFetchFinished: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description - Sets the events stored in convex and all the connected calendars
 * @since 0.0.8
 * @version 0.0.3 */
export function useCalendarEvents({
  convexUser,
  componentId = "calendar",
  onFetchFinished = () => {},
}: UseCalendarEventsProps) {
  /**
   * @description Handles the state update for displaying all the linked events for the signed in user
   * @see {@link context/CalendarContext} */
  const setEvents = useCalendarContextStore((state) => state.setEvents);

  /**
  * @description Get events based on currently signed in user id and also the members of the user
  * @see {@link convex/sync/events/query/get}*/
  const queriedEvents = useQuery(api.sync.events.query.get, { 
    _id: convexUser?._id as Id<"users">,
    members: convexUser?.members ?? []
  });

  const events: ConvexEventsAPIProps[] = Array.isArray(queriedEvents) ? queriedEvents : [];

  /**
   * @private
   * @description Returns in initial API object with all the required fields
   * -> Used for creating the list header event items
   * @function */
  const _getInitialAPIObj = React.useCallback((now: Date): ConvexEventsAPIProps => ({
    _id: `${KEYS.calendarEvent}-${componentId}-${now.toLocaleDateString()}` as Id<"events">,
    userId: convexUser?._id ?? ("" as Id<"users">),
    title: String(),
    start: now.toDateString(),
    end: now.toDateString(),
  }), [componentId, convexUser?._id]);

  React.useEffect(() => {
    if (events instanceof Array && events.length > 0) {
      let _events: ConvexEventsAPIProps[] = [];
      let _startDate: Date|null = null;

      events.forEach((event) => {
        const date = startOfDay(new Date(event.start));
        if (!_startDate || !isEqual(date, _startDate)) {
          _events.push({
            ..._getInitialAPIObj(date),
            //isListHeader: true
          });
          _startDate = date;
        } _events.push({
            ...event,
            //isListHeader: false
          });
      });

      /**
       * @description Update events based on convex selection */
      setEvents(_events);
    } 

    console.log("events", events);
    
    setTimeout(() => onFetchFinished(), 3000);
  }, [events, _getInitialAPIObj, onFetchFinished, setEvents]);
}