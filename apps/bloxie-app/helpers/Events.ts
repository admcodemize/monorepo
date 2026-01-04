import React from "react";
import { ConvexEventsAPIProps } from "@codemize/backend/Types";

import { ListRenderItemEventProps } from "@/components/calendar/day/CalendarDayList";
import { PNG_ASSETS } from "@/assets/png";
import { ImageSourcePropType } from "react-native";
import { ProviderEnum } from "@/constants/Provider";

/**
 * @public
 * @description Returns the image asset by provider
 * @param {string} provider - Provider
 * @function */
export const getImageAssetByProvider = (provider: ProviderEnum): ImageSourcePropType => {
  return provider === ProviderEnum.GOOGLE 
    ? PNG_ASSETS.googleMail 
    : provider === ProviderEnum.MICROSOFT 
      ? PNG_ASSETS.outlookMail 
      : PNG_ASSETS.slackCalendar;
};

/**
   * @private
   * @description Builds the groups of array based on overlapping events
   * Goal:
   * -> We cluster all events that somehow collide in time into so-called “groups”
   * -> Because events that do not overlap can be displayed independently of each other
   * -> Within a group, we have to do the slot logic.
   * How do we do this?
   * -> DFS algorithm (depth-first search) / If one event collides with another → they belong to the same group
   * Why?
   * -> This reduces complexity. Only events in one group need to be compared with each other.
   * @function */
export const prepareConflictGroups = (): ConvexEventsAPIProps[][] => {
  const groups: ConvexEventsAPIProps[][] = [];

  /** @description Handles all the already processesd events. -> Needed for calculating the corret amount of columns */
  const processesd: Set<string> = new Set<string>();

  /** @description Sorted events based on start time -> Sorted by count of minutes since midnight! */
  const _events: ConvexEventsAPIProps[] = []; //getEventsSorted(events);

  for (const event of _events) {
    if (processesd.has(event._id!)) continue;
    const group: ConvexEventsAPIProps[] = [];
    const queue = [event];

    while (queue.length > 0) {
      /** 
       * @description Processing queued events -> .pop will remove the event item from the queue
       * -> Additional check whether the queued item was alread processed */
      const queueEvent = queue.pop()!;
      if (processesd.has(queueEvent._id!)) continue;

      /** @description Adds queued event to overlapping/conflict group for further preparation */
      processesd.add(queueEvent._id!);
      group.push(queueEvent);

      /** 
       * @description Go through all the events and check if not already processesd and if queued event is overlapping/has conflict
       * with other events of the same day */
      for (const otherEvent of _events) {
        //if (processesd.has(otherEvent._id!) || !isEventOverlapping(queueEvent, otherEvent)) continue;
        queue.push(otherEvent);
      }
    } groups.push(group);
  } return groups;
};

/**
 * @private
 * @description Calculates the overlapping events layout (top, left, width, height)
 * @param {ConvexEventsAPIProps[]} group - Grouped events
 * @param {ConvexEventsAPIProps[][]} columns - Columns of events which are used for the displaying the overlapping events
 * @param {Map<string, number>} slots - Slots of events which represents the items of the calendar
 * @param {number} slotsTotal - Total number of slots (columns)
 * @function */
export const calculateEventsLayout = (
  group: ConvexEventsAPIProps[],
  columns: ConvexEventsAPIProps[][],
  slots: Map<string, number>,
  slotsTotal: number
): ListRenderItemEventProps[] => {
  const items: ListRenderItemEventProps[] = [];

  for (const event of group) {
    //const localeStart = getTimeZonedDate({ now: convertFromConvex(event.start) });
    //const localeEnd = getTimeZonedDate({ now: convertFromConvex(event.end) });

    const slot = slots.get(event._id!)!;

    /** @description Default count of columns for an event */
    let countOfColumns = 1;
    
    /** 
     * @description Calculates how many columns an event can use
     * Goal:
     * -> The event should be displayed as wide as possible
     * -> But only up to the first column in which there is an overlapping event
     * Why?
     * -> This creates the effect: events “grow” to the right, as far as possible, without collisions */
    for (let i = slot + 1; i < slotsTotal; i++) {
      //const overlapping = columns[i].some(other => isEventOverlapping(event, other));
      //if (overlapping) break;
      countOfColumns++;
    }

    if (!items.find((item) => item.event._id === event._id)) {
      /*items.push({
        event,
        layout: {
          top: (((getMinutesSinceMidnight(localeStart) / MINUTES_IN_DAY) * MINUTES_IN_DAY_WITH_BORDER)),
          height: (differenceInMinutes(localeEnd, localeStart, { roundingMethod: "round" }) / MINUTES_IN_DAY) * MINUTES_IN_DAY_WITH_BORDER - HEIGHT_SPACE, 
          left: (slot / slotsTotal) * totalWidth, 
          width: ((countOfColumns / slotsTotal) * totalWidth) - RIGHT_SPACE
        }
      })*/
    }
  } return items;
};

/**
 * @private
 * @description Prepares the events which has conflicts with the individual layouts (top, left, width, height)
 * @function */
export const prepareEvents = React.useMemo((): ListRenderItemEventProps[] => {
  let items: ListRenderItemEventProps[] = [];

  /** @description Returns the events grouped by conflicts/overlapping */
  for (const group of prepareConflictGroups()) {
    /** @description Sort the events grouped by conflicts by start time -> Earlier events placed first */
    //const sorted = [...group].sort((a, b) => 
    //  getMinutesSinceMidnight(convertFromConvex(a.start)) - getMinutesSinceMidnight(convertFromConvex(b.start)));

    /** @description Each event is assigned a column (slot) in which it fits without overlapping. */
    const columns: ConvexEventsAPIProps[][] = [];
    const slots: Map<string, number> = new Map<string, number>();

    /** @description Slot distribution per group */
    for (const event of []) { //sorted) {
      let isAlreadyAssigned = false;

      /** 
       * @description 
       * We go through each event and check:
       * -> Does it fit in columns[i] without colliding with other events?
       * -> If yes → put it in there.
       * Why?
       * -> So events are next to each other and not on top of each other
       * -> Important: the first event always gets the leftmost free column */
      for (let idx = 0; idx < columns.length; idx++) {
        const lastInColumn = columns[idx][columns[idx].length - 1];
        /*if (!isEventOverlapping(lastInColumn, event)) {
          columns[idx].push(event);
          slots.set(event._id!, idx);
          isAlreadyAssigned = true;
          break;
        }*/
      }

      /** @description Adds the already processesd events as assigned */
      if (!isAlreadyAssigned) {
        columns.push([event]);
        //slots.set(event._id!, columns.length - 1);
      }
    }

    items = [...items, ...calculateEventsLayout(group, columns, slots, columns.length)];
  } return items;
}, [prepareConflictGroups]);

