import { CalendarCachedWeeksHorizontalProps, CalendarContextProps, useCalendarContextStore } from "@/context/CalendarContext";
import React from "react";
import { getLocalization } from "@/helpers/System";
import { addDays, differenceInCalendarDays, endOfDay, isAfter, isBefore, isThisWeek, startOfDay } from "date-fns";
import { View } from "react-native";
import { STYLES } from "@codemize/constants/Styles";
import { convertFromConvex } from "@codemize/backend/Convert";
import { ConvexCalendarAPIProps, ConvexEventsAPIProps, IntegrationAPICalendarVisibilityEnum } from "@codemize/backend/Types";
import { getHours, getMinutesBetweenDates, getMinutesSinceMidnight, HoursProps, PIXELS_PER_MINUTE } from "@codemize/helpers/DateTime";
import { GlobalLayoutProps } from "@/types/GlobalLayout";
import CalendarHourGrid from "./CalendarHourGrid";
import CalendarTimeIndicator from "./CalendarTimeIndicator";
import ListItemEvent from "./list/ListItemEvent";
import ListItemEventTentiative from "./list/ListItemEventTentiative";
import ListItemEventAway from "./list/ListItemEventAway";
import { useIntegrationContextStore } from "@/context/IntegrationContext";

/** Pre-computed hour metadata used to derive grid height and tick labels. */
const HOURS: HoursProps[] = getHours(24, getLocalization());
/** Horizontal padding between day columns so overlapping events remain legible. */
const COLUMN_PADDING = 1;
/** Minimum logical duration we allow when projecting events (prevents zero-height items). */
const MIN_EVENT_DURATION_MINUTES = 15;
/** Minimum pixel height to ensure even very short events remain tappable. */
const MIN_EVENT_HEIGHT = 16;
/** Cached day height so we can clamp layouts and avoid rendering beyond the viewport. */
const TOTAL_DAY_HEIGHT = HOURS.length * STYLES.calendarHourHeight;

type EventWithLayout = {
  event: ConvexEventsAPIProps;
  layout: GlobalLayoutProps;
  isAllDay: boolean;
  isRelevantForConflictDetection: boolean;
  key: string;
};

type CalendarWeekHorizontalGridListItemProps = CalendarCachedWeeksHorizontalProps & {
  shouldRenderEvents: boolean;
}

const selectConfig = (state: CalendarContextProps) => state.config;
const selectEvents = (state: CalendarContextProps) => state.events;

const CalendarWeekHorizontalGridListItem = ({
  week,
  shouldRenderEvents
}: CalendarWeekHorizontalGridListItemProps) => {
  /** @description Prüfe ob diese Woche die aktuelle Woche ist (enthält heutiges Datum) */
  const locale = getLocalization();
  const showTimeIndicator = isThisWeek(week.startOfWeek, { locale });

  const config = useCalendarContextStore(selectConfig);
  const events = useCalendarContextStore(selectEvents);

  const integrations = useIntegrationContextStore((state) => state.integrations);


  /**
   * @private
   * @description Computes the event layouts (width, height, top, left) for the current week grid.
   *
   * <p>Why we need to split events into segments:</p>
   * <ul>
   *   <li>Calendar events can span multiple days (e.g. from Friday evening into Saturday morning).</li>
   *   <li>The weekly grid displays one column per day. When a single event overlaps multiple days we need to render that event in each affected column.</li>
   *   <li>We therefore slice the event into <em>segments</em> – one segment per day – so that each piece is rendered in the correct column with the correct height/top offsets.</li>
   * </ul>
   *
   * <p>How the layout is calculated:</p>
   * <ol>
   *   <li>Clamp the event start/end to the visible week. This prevents drawing segments outside the current week.</li>
   *   <li>Walk day-by-day across the clamped range, generating a segment for each day that the event touches.</li>
   *   <li>For each segment:
   *     <ul>
   *       <li><strong>Column:</strong> Calculated from the difference between the segment’s day and the start of the week.</li>
   *       <li><strong>Top offset:</strong> Minutes since midnight multiplied by PIXELS_PER_MINUTE. All-day events are pinned to the top.</li>
   *       <li><strong>Height:</strong> Duration (in minutes) mapped to pixels. Ensures a minimum height so events are always visible.</li>
   *       <li><strong>Width:</strong> Bound to the column width minus a small padding so adjacent columns have a visual gap.</li>
   *     </ul>
   *   </li>
   *   <li>Return all segments so they can be rendered with `ListItemEvent`.</li>
   * </ol>
   *
   * <p>Memoization and dependencies:</p>
   * <ul>
   *   <li>The computation is wrapped in `React.useMemo` to avoid recalculating layouts while the user scrolls.</li>
   *   <li>The memo re-runs whenever the visible week (start/end), the column layout (number of days/width), or the event list changes.</li>
   *   <li>We also guard against placeholder entries (events without a title or external ID) so only real data is rendered.</li>
   * </ul>
   *
   * @returns A flat list of event segments with layout metadata for the current week.
   * @see ListItemEvent for how the layout data is consumed.
   */
  const weekEvents = React.useMemo<EventWithLayout[]>(() => {
    if (!shouldRenderEvents || !config.numberOfDays || config.width <= 0) return [];

    const startOfWeekDate = week.startOfWeek;
    const endOfWeekDate = week.endOfWeek;
    const numberOfDays = config.numberOfDays;
    const columnWidth = config.width;

    let aCalendars: ConvexCalendarAPIProps[] = [];
    integrations?.forEach((integration) => {
      integration?.calendars?.forEach((calendar) => {
        aCalendars.push(calendar);
      });
    });


    console.log("called");

    return events.flatMap((event) => {
      if (!event?.start || !event?.end) return [];
      if (!event?.title && !event?.externalEventId) return [];


      const calendar = aCalendars.find((calendar) => calendar._id === event?.calendarId);

      const eventStart = convertFromConvex(event.start);
      const eventEnd = convertFromConvex(event.end);

      if (isAfter(eventStart, endOfWeekDate) || isBefore(eventEnd, startOfWeekDate)) return [];

      const clampedStart = isBefore(eventStart, startOfWeekDate) ? startOfWeekDate : eventStart;
      const clampedEnd = isAfter(eventEnd, endOfWeekDate) ? endOfWeekDate : eventEnd;

      const isAllDay = Boolean(event.isAllDay);
      const segments: EventWithLayout[] = [];

      let segmentStart = clampedStart;
      // Slice the event into day-sized pieces so multi-day appointments render in each affected column.
      while (segmentStart.getTime() < clampedEnd.getTime()) {
        const dayStart = startOfDay(segmentStart);
        const dayIndex = differenceInCalendarDays(dayStart, startOfWeekDate);
        const dayEnd = endOfDay(segmentStart);
        const nextSegmentStart = startOfDay(addDays(dayStart, 1));
        const segmentEnd = isAfter(clampedEnd, dayEnd) ? dayEnd : clampedEnd;

        if (dayIndex >= 0 && dayIndex < numberOfDays && segmentEnd.getTime() > segmentStart.getTime()) {
          const minutesFromMidnight = isAllDay ? 0 : getMinutesSinceMidnight(segmentStart);
          // For timed events we scale height by actual duration; all-day events receive a fixed banner-style size.
          const durationMinutes = isAllDay
            ? STYLES.calendarHourHeight
            : Math.max(getMinutesBetweenDates(segmentStart, segmentEnd), MIN_EVENT_DURATION_MINUTES);

          const rawHeight = isAllDay
            ? Math.max(STYLES.calendarHourHeight * 0.6, MIN_EVENT_HEIGHT)
            : Math.max(durationMinutes * PIXELS_PER_MINUTE, MIN_EVENT_HEIGHT);

          const height = Math.min(rawHeight, TOTAL_DAY_HEIGHT);
          const rawTop = isAllDay ? 2 : minutesFromMidnight * PIXELS_PER_MINUTE;
          const top = Math.max(0, Math.min(rawTop, TOTAL_DAY_HEIGHT - height));

          const baseLeft = columnWidth * dayIndex;
          const left = baseLeft + COLUMN_PADDING / 2;
          const width = Math.max(columnWidth - COLUMN_PADDING, 0);

          const key = `${event._id ?? event.externalEventId ?? `${event.title}-${event.start}`}-${dayIndex}-${Math.round(top)}-${Math.round(height)}`;

          segments.push({
            event,
            isAllDay,
            isRelevantForConflictDetection: calendar?.isRelevantForConflictDetection ?? true,
            key,
            layout: {
              width,
              height,
              top,
              left,
            },
          });
        }

        if (segmentEnd.getTime() >= clampedEnd.getTime()) break;
        segmentStart = nextSegmentStart;
      }

      return segments;
    });
  }, [config.numberOfDays, config.width, events, shouldRenderEvents, week.endOfWeek, week.startOfWeek, integrations]);

  return (
    <View style={{ 
      width: config.totalWidth,
      height: TOTAL_DAY_HEIGHT,
    }}>
      <CalendarHourGrid numberOfDays={config.numberOfDays} />

      {weekEvents.map(({ event, layout, isAllDay, isRelevantForConflictDetection, key }) => {
        const normalizedEvent = {
          ...event,
          bgColorEvent: event.backgroundColor,
          descr: event.description ?? "",
        } as ConvexEventsAPIProps;

        return event?.visibility === IntegrationAPICalendarVisibilityEnum.PRIVATE && (
          <ListItemEvent
            key={key}
            layout={layout}
            event={normalizedEvent}
            isAllDayEvent={isAllDay}
            isRelevantForConflictDetection={isRelevantForConflictDetection}
          />
        );
      })}

      {showTimeIndicator && <CalendarTimeIndicator />}
    </View>
  );
};

/**
 * Ensure memoized list items rerender whenever the visible week window changes while still skipping
 * unnecessary redraws during horizontal scrolling.
 */
const areEqual = (
  prev: Readonly<CalendarWeekHorizontalGridListItemProps>,
  next: Readonly<CalendarWeekHorizontalGridListItemProps>
) =>
  prev.shouldRenderEvents === next.shouldRenderEvents &&
  prev.week.startOfWeek.getTime() === next.week.startOfWeek.getTime() &&
  prev.week.endOfWeek.getTime() === next.week.endOfWeek.getTime();

export default React.memo(CalendarWeekHorizontalGridListItem, areEqual);