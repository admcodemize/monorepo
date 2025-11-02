import { isAfter, isBefore } from "date-fns";
import * as React from "react";
import { Dimensions, FlatList, ListRenderItemInfo, Pressable, ScaledSize, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColor, useThemeColors } from "@/hooks/theme/useThemeColor";
//import { useCalendarEventStore } from "@/context/CalendarEventContext";
//import { useUserContextStore } from "@/context/UserContext";
import { convertFromConvex } from "@codemize/backend/Convert";
//import { convertFromConvex, getHours, getLocaleTime, getMinutesBetweenDates, getMinutesSinceMidnight, getTimeZonedDate, MAX_TOP, MINUTES_IN_DAY, MINUTES_IN_DAY_WITH_BORDER } from "@/helpers/DateTime";
//import { getEventsSorted, isEventOverlapping } from "@/helpers/Events";
import { STYLES } from "@codemize/constants/Styles";
import {ConvexEventsAPIProps} from "@codemize/backend/Types";
import { getHours, getMinutesBetweenDates, getMinutesSinceMidnight, HoursProps, MINUTES_IN_DAY, MINUTES_IN_DAY_WITH_BORDER } from "@codemize/helpers/DateTime";

import { KEYS } from "@/constants/Keys";
//import { CalendarDayListProps } from "@/types/components/calendar/day/CalendarDayList";
//import { HoursProps } from "@/types/helpers/DateTime";
//import { ListRenderItemEventProps } from "@/types/components/calendar/day/render/ListRenderItemEvent";
//import { ConvexEventsAPIProps } from "@/types/api/ConvexEventsAPI";

//import CalendarTimeIndicator from "@/components/calendar/CalendarTimeIndicator";
//import ListRenderItemHour from "@/components/calendar/day/render/ListRenderItemHour";
//import ListRenderItemDivider from "@/components/calendar/day/render/ListRenderItemDivider";
//import ListRenderItemEvent from "@/components/calendar/day/render/ListRenderItemEvent";
import TextBase from "@/components/typography/Text";

//import CalendarDayListStyle from "@/styles/components/calendar/day/CalendarDayList";
import CalendarDayListStyle from "@/styles/components/calendar/day/CalendarDayList";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

import { GlobalLayoutProps } from "@/types/GlobalLayout";
import ListItemDivider from "@/components/calendar/list/ListItemDivider";
import ListItemHour from "@/components/calendar/list/ListItemHour";
import { getLocalization } from "@/helpers/System";
import { useUserContextStore } from "@/context/UserContext";
import CalendarBlockedScope from "../CalendarBlockedScope";

/** 
 * @description Hour style heigh plus the additional border height!
 * @constant */
const SNAP_TO_INTERVAL: number = STYLES.calendarHourHeight + 1;
const HEIGHT_SPACE: number = 1;
const RIGHT_SPACE: number = 1;
const DIM: ScaledSize = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @type */
export type ListRenderItemEventNotAllowedProps = {
  startMin: number;
  endMin: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @type */
export type ListRenderItemEventProps = {
  event: ConvexEventsAPIProps;
  layout: GlobalLayoutProps;
  isNewEvent?: boolean;
  isAllDayEvent?: boolean;
  notAllowed?: ListRenderItemEventNotAllowedProps[];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @type */
export type CalendarDayListProps = {
  //events: ConvexEventsAPIProps[]|[];
  //slots: CalendarDayListSlotProps[]|[];
  showHours?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description
 * @since 0.0.12
 * @version 0.0.21
 * @param {Object} param0
 * @param {ConvexEventsAPIProps[]} param0.events - Subscribed or personal events
 * @param {SlotProps[]} param0.slots - Selected slots
 * @param {boolean} param0.showHours - Handles the visibility of the hours */
const CalendarDayList = ({
  //events,
  //slots,
  showHours = true,
}: CalendarDayListProps) => {
  //const border = useThemeColor("border");
  //const emphasized = useThemeColor("emphasized");
  const { tertiaryBgColor, primaryBorderColor, secondaryBorderColor, info } = useThemeColors();

  const ref = React.useRef<FlatList>(null);
  const locale = getLocalization();

  /**
   * @description Used for not displaying the flatlist in the bottom safe area */
  const insets = useSafeAreaInsets();

  /** @description - */
  //const totalWidth: number = (DIM.width - Styles.calendarHourWidth); 
  const totalWidth: number = (DIM.width);

  /** 
   * @description Get the times (blocked times) for the current user from the convex database
   * @see {@link context/UserContext} */
  const { times } = useUserContextStore((state) => state);

  /**
   * @private
   * @description Initialize hours for displaying in a vertical view 
   * @constant */
  const data = React.useMemo<HoursProps[]>(() => getHours(24, locale), [locale]);

  /** 
   * @description Returns the duration minute from the store for the new event
   * @see {@link context/useCalendarEventStore} */
  //const durationMinute = useCalendarEventStore((state) => state.durationMinute);

  /** @description Used to store the longpress event for displaying inside the calendar */
  //const [longpressEvent, setLongpressEvent] = React.useState<ListRenderItemEventProps|null>(null);

  React.useEffect(() => {
    if (!ref?.current) return;
    /** 
     * @description Initial scroll to Offset based on the current time. Include an additional offset of -100 
     * so that the start time is not placed directly at the top of the list */
    /*ref.current.scrollToOffset({ 
      offset: Math.max(((getMinutesSinceMidnight(new Date()) / MINUTES_IN_DAY) * MINUTES_IN_DAY_WITH_BORDER) - 100, 0), 
      animated: false 
    });*/
  }, []);

  //React.useEffect(() => {
    //if (slots.length === 0 || !ref?.current) return;
    /** 
     * @description Scroll to Offset based on the selected slot position. Include an additional offset of -100 
     * so that the start time is not placed directly at the top of the list */
    /*ref.current.scrollToOffset({
      offset: Math.max(((getMinutesSinceMidnight(getTimeZonedDate({ now: slots[0].slot.start })) / MINUTES_IN_DAY) * MINUTES_IN_DAY_WITH_BORDER) - 100, 0),
      animated: true,
    });*/
  //}, [slots]);

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
  const prepareConflictGroups = React.useCallback((): ConvexEventsAPIProps[][] => {
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
  }, []); //[events]);

  /**
   * @private
   * @description Calculates the overlapping events layout (top, left, width, height)
   * @param {ConvexEventsAPIProps[]} group - Grouped events
   * @param {ConvexEventsAPIProps[][]} columns - Columns of events which are used for the displaying the overlapping events
   * @param {Map<string, number>} slots - Slots of events which represents the items of the calendar
   * @param {number} slotsTotal - Total number of slots (columns)
   * @function */
  const calculateEventsLayout = React.useCallback((
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
  }, []);

  /**
   * @private
   * @description Prepares the events which has conflicts with the individual layouts (top, left, width, height)
   * @function */
  const prepareEvents = React.useMemo((): ListRenderItemEventProps[] => {
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
  }, []); //[events]);

  /**
   * @private
   * @description Prepares the slot event for displaying inside the calendar based on property "selectedSlots"
   * @function */
  const prepareSelectedSlot = React.useMemo(() => {
    //= slots.map(({ slot, title }, idx) => {
      //const localeStart: Date = getTimeZonedDate({ now: slot.start });
      //const top: number = (((getMinutesSinceMidnight(localeStart) / MINUTES_IN_DAY) * MINUTES_IN_DAY_WITH_BORDER));
      //const height: number = (differenceInMinutes(getTimeZonedDate({ now: slot.end }), localeStart, { roundingMethod: "round" }) / MINUTES_IN_DAY) * MINUTES_IN_DAY_WITH_BORDER - HEIGHT_SPACE;

      /**
       * @description Calculates the slot layout based on duration time */
      /*return {
        top, height, title,
        start: slot.start,
        end: slot.end
      };*/
      
    //});

    /** 
     * @description Reset the longpress event if there are selected slots 
     * -> This is needed to avoid displaying the longpress event when the user selects a slot */
    //if (selectedSlots.length > 0) setLongpressEvent(null);
    //return selectedSlots;
  }, []); //[slots]);

  /**
   * @private
   * @description Prepares the longpress event for displaying the new event inside the calendar
   * @function */
  const prepareLongpressEvent = React.useCallback((
    now: Date
  ) => {
    /** @description Get the start and end of the new event based on the duration minute including the timezone */
    //const start = getTimeZonedDate({ now });
    //const end = addMinutes(start, durationMinute);

    /** @description Calculate the top and height of the new event based on the duration minute */
    //const top = (((getMinutesSinceMidnight(start) / MINUTES_IN_DAY) * MINUTES_IN_DAY_WITH_BORDER));
    //const height = (differenceInMinutes(end, start, { roundingMethod: "round" }) / MINUTES_IN_DAY) * MINUTES_IN_DAY_WITH_BORDER - HEIGHT_SPACE;

    /** @description Set the longpress event for displaying the new event inside the calendar */
    /*setLongpressEvent({
      event: { ...getNewEventTemplate("Neues Ereignis", start, end) },
      layout: { top, height, left: 0, width: totalWidth - RIGHT_SPACE }
    })*/
  }, []); //[durationMinute]);

  /**
   * @private
   * @description Returns the template for the new event based on the title, start and end date
   * -> Used for the longpress event inside the calendar or the selected slot
   * @param {string} title - Title
   * @param {Date} start - Start date
   * @param {Date} end - End date
   * @function */ 
  /*const getNewEventTemplate = React.useCallback((
    title: string,
    start: Date,
    end: Date
  ) => ({
    title: title,
    descr: `${getLocaleTime({ now: start })} - ${getLocaleTime({ now: end})}`,
    userId: String(),
    start: formatISO(start),
    end: formatISO(end),
    bgColorUser: emphasized
  }), []);*/

  const isPressableDisabled = React.useCallback((
    now: Date,
    index: number,
    minute: number
  ) => 
    isBefore(new Date(now.getFullYear(), now.getMonth(), now.getDate(), index, minute, 0), new Date()) || 
    isAfter(new Date(now.getFullYear(), now.getMonth(), now.getDate(), index, minute, 0), new Date()), []);

  /**
   * @private
   * @description Used to render the item of the flatlist.
   * @param {ListRenderItemInfo<HoursProps>} param0 - The item to be rendered.
   * @param {number} param0.index - The index of the item.
   * @param {HoursProps} param0.item - The item to be rendered.
   * @function */
  const renderItem = ({ index, item }: ListRenderItemInfo<HoursProps>) => {
    return (
    <View key={`${KEYS.calendarWeekDayTime}-${item.idx}`}>
      {/*index === 0 && <CalendarTimeIndicator />*/}

      {/** @description Renders the blocked times for the current user based on the day of the week */}
      {index === 0 && times?.filter(({ isBlocked, day }) => isBlocked && day === item.now.getDay())
        .map(({ start, end }) => 
          <CalendarBlockedScope
            layout={{ 
              top: getMinutesSinceMidnight(convertFromConvex(start)) / MINUTES_IN_DAY * MINUTES_IN_DAY_WITH_BORDER, 
              left: 60, 
              width: totalWidth, 
              height: getMinutesBetweenDates(convertFromConvex(start), convertFromConvex(end)) / MINUTES_IN_DAY * MINUTES_IN_DAY_WITH_BORDER
            }}/>
      )}

      {/*index === 0 && <View style={{ left: showHours ? Styles.calendarHourWidth : 0 }}>
        {prepareEvents.map((item, idx) => 
          <ListRenderItemEvent 
            key={`${Keys.calendarDayEvent}-${idx}`}
            event={item.event} 
            layout={item.layout}/>)}
        {!longpressEvent && prepareSelectedSlot.map((slot, idx) => (
          <ListRenderItemEvent 
            key={`${Keys.calendarListEventTemporary}-${idx}`}
            layout={{ ...slot, left: 0, width: totalWidth - RIGHT_SPACE }}
            event={{ ...getNewEventTemplate(slot.title, slot.start, slot.end) }}
            isNewEvent={true}
            notAllowed={times?.filter(({ isBlocked, day }) => isBlocked && day === item.now.getDay())
            .map(({ start, end }) => {
              const startMin = getMinutesSinceMidnight(convertFromConvex(start));
              let endMin = getMinutesSinceMidnight(convertFromConvex(end));
              
              // Fix: Falls endMin < startMin (über Mitternacht), setze auf Ende des Tages
              if (endMin < startMin) {
                endMin = 1439; // 23:59 Uhr
              }
              
              return { startMin, endMin };
            })}  />
        ))}
        {longpressEvent && <ListRenderItemEvent 
          key={`${Keys.calendarListEventTemporary}-${longpressEvent.event.start.toString()}-${longpressEvent.event.end.toString()}`}
          event={longpressEvent.event}
          layout={longpressEvent.layout}
          isNewEvent={true}
          notAllowed={times?.filter(({ isBlocked, day }) => isBlocked && day === item.now.getDay())
            .map(({ start, end }) => {
              const startMin = getMinutesSinceMidnight(convertFromConvex(start));
              let endMin = getMinutesSinceMidnight(convertFromConvex(end));
              
              // Fix: Falls endMin < startMin (über Mitternacht), setze auf Ende des Tages
              if (endMin < startMin) {
                endMin = 1439; // 23:59 Uhr
              }
              
              return { startMin, endMin };
            })} />}
      </View>}*/}

      <View
        style={[GlobalContainerStyle.rowStartStart]}>
        {showHours && <View style={[GlobalContainerStyle.columnCenterStart, CalendarDayListStyle.left, { 
          borderColor: primaryBorderColor,
          backgroundColor: tertiaryBgColor
        }]}>
          {/** @description Renders the hours on the left side of the calendar */}
          <ListItemHour
            key={`${KEYS.calendarHours}-${item.idx}`}
            {...item} />        
        </View>}

        {/** @description Renders the right divider of the calendar and the invisible containers for the longpress event */}
        <View style={CalendarDayListStyle.right}>
          {[0, 30].map((minute) => {
            return (
            <Pressable
              key={`longpress-${index}-${minute}`}
              delayLongPress={200}
              disabled={false}
              style={[CalendarDayListStyle.touchable, { top: minute === 0 ? 0 : STYLES.calendarHourHeight / 2 }]}
              onLongPress={() => prepareLongpressEvent(new Date(item.now.getFullYear(), item.now.getMonth(), item.now.getDate(), index, minute, 0))} />
          )})}
          {Array.from({ length: 4 }).map((_, idx) => 
            <ListItemDivider
              key={`${KEYS.calendarHoursDivider}-${item.hour}-${idx}`}
              showBorder={Boolean(idx % 2)} />)}
        </View>
      </View>
    </View>
  )};

  /**
   * @private
   * @description Used to extract a unique key for a given item at the specified index
   * @function */
  const keyExtractor = React.useCallback((_: any, index: number) => index.toString(), []);

  /**
   * @private
   * @description Optional optimization that lets us skip measurement of dynamic content if you know the height of items
   * @param {any} _
   * @param {number} index - The index of the item.
   * @function */
  const itemLayout = React.useCallback((_: any, index: number) => ({
    length: (DIM.width - (STYLES.paddingHorizontal * 2)),
    offset: MINUTES_IN_DAY_WITH_BORDER,
    index
  }), []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{
        height: 30,
        flexDirection: 'row',
        borderBottomColor: secondaryBorderColor,
        borderBottomWidth: 1
      }}>
        {/* Linke graue Spalte (analog zur Stundenliste) */}
        <View style={{
          width: STYLES.calendarHourWidth,
          backgroundColor: tertiaryBgColor,
          justifyContent: "center",
          alignItems: "center"
        }}>
            <TextBase 
              text="Ganztags"
              style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: info }]} />
        </View>

        {/* Rechte farbliche Spalte für ganztägige Events */}
        <View style={{
          flex: 1,
          backgroundColor: useThemeColor("primaryBg"),
          paddingHorizontal: STYLES.paddingHorizontal,
          justifyContent: 'center',
          alignItems: "center"
        }}>

        </View>
      </View>

      {data && data.length > 0 && <FlatList
        ref={ref}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, paddingBottom: insets.bottom }}
        keyExtractor={keyExtractor}
        disableVirtualization={false}
        removeClippedSubviews={true}
        snapToAlignment="start"
        decelerationRate={"fast"}
        snapToInterval={SNAP_TO_INTERVAL}
        getItemLayout={itemLayout}
        data={data}
        renderItem={renderItem} />}
    </View>
  )
}

export default CalendarDayList;