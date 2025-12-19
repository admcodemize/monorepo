import { CalendarCachedWeeksHorizontalProps, CalendarContextProps, useCalendarContextStore } from "@/context/CalendarContext";
import React from "react";
import { getLocalization } from "@/helpers/System";
import { addDays, differenceInCalendarDays, endOfDay, isAfter, isBefore, isThisWeek, startOfDay } from "date-fns";
import { Dimensions, View } from "react-native";
import { STYLES } from "@codemize/constants/Styles";
import { convertFromConvex } from "@codemize/backend/Convert";
import { ConvexCalendarAPIProps, ConvexEventsAPIProps, IntegrationAPICalendarVisibilityEnum } from "@codemize/backend/Types";
import { getHours, getMinutesBetweenDates, getMinutesSinceMidnight, HoursProps, PIXELS_PER_MINUTE, TOTAL_MINUTES } from "@codemize/helpers/DateTime";
import { GlobalLayoutProps } from "@/types/GlobalLayout";
import CalendarHourGrid from "./CalendarHourGrid";
import CalendarTimeIndicator from "./CalendarTimeIndicator";
import ListItemEvent from "./list/ListItemEvent";
import ListItemEventTentiative from "./list/ListItemEventTentiative";
import ListItemEventAway from "./list/ListItemEventAway";
import { useIntegrationContextStore } from "@/context/IntegrationContext";
import TextBase from "../typography/Text";
import { shadeColor } from "@codemize/helpers/Colors";

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
  calendar: ConvexCalendarAPIProps;
  layout: GlobalLayoutProps;
  isAllDay: boolean;
  key: string;
  dayIndex: number;
};
type EventSegment = EventWithLayout & {
  startMinutes: number;
  endMinutes: number;
  slot?: number;
};
type SegmentOverride = {
  startMinutes: number;
  endMinutes: number;
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
  const [segmentOverrides, setSegmentOverrides] = React.useState<Record<string, SegmentOverride>>({});

  const integrations = useIntegrationContextStore((state) => state.integrations);

  React.useEffect(() => {
    setSegmentOverrides({});
  }, [events]);


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

    const segmentsByDay = new Map<number, EventSegment[]>();
    const results: EventWithLayout[] = [];

    for (const event of events) {
      if (!event?.start || !event?.end) continue;
      if (!event?.title && !event?.externalEventId) continue;


      const calendar = aCalendars.find((calendar) => calendar._id === event?.calendarId);

      const eventStart = convertFromConvex(event.start);
      const eventEnd = convertFromConvex(event.end);

      if (isAfter(eventStart, endOfWeekDate) || isBefore(eventEnd, startOfWeekDate)) continue;

      const clampedStart = isBefore(eventStart, startOfWeekDate) ? startOfWeekDate : eventStart;
      const clampedEnd = isAfter(eventEnd, endOfWeekDate) ? endOfWeekDate : eventEnd;

      const isAllDay = Boolean(event.isAllDay);

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
          const durationMinutes = isAllDay
            ? TOTAL_MINUTES
            : Math.max(getMinutesBetweenDates(segmentStart, segmentEnd), MIN_EVENT_DURATION_MINUTES);

          if (isAllDay) {
            const height = Math.max(STYLES.calendarHourHeight * 0.6, MIN_EVENT_HEIGHT);
            const baseLeft = columnWidth * dayIndex;
            const width = Math.max(columnWidth - COLUMN_PADDING, 0);
            const left = baseLeft + COLUMN_PADDING / 2;
            const top = 2;
            const key = `${event._id ?? event.externalEventId ?? `${event.title}-${event.start}`}-${dayIndex}-allday`;

            results.push({
              event,
              calendar: calendar ?? {} as ConvexCalendarAPIProps,
              isAllDay,
              key,
              dayIndex,
              layout: {
                width,
                height,
                top,
                left,
              },
            });
          } else {
            const rawHeight = Math.max(durationMinutes * PIXELS_PER_MINUTE, MIN_EVENT_HEIGHT);
            const height = Math.min(rawHeight, TOTAL_DAY_HEIGHT);
            const rawTop = minutesFromMidnight * PIXELS_PER_MINUTE;
            const top = Math.max(0, Math.min(rawTop, TOTAL_DAY_HEIGHT - height));

          const key = `${event._id ?? event.externalEventId ?? `${event.title}-${event.start}`}-${dayIndex}`;

            const segment: EventSegment = {
              event,
              isAllDay,
              calendar: calendar ?? {} as ConvexCalendarAPIProps,
              key,
              dayIndex,
              startMinutes: minutesFromMidnight,
              endMinutes: minutesFromMidnight + durationMinutes,
              layout: {
                width: 0,
                height,
                top,
                left: 0,
              },
            };

          const override = segmentOverrides[key];
          if (override) {
            const clampedStart = Math.max(0, Math.min(override.startMinutes, TOTAL_MINUTES));
            const clampedEnd = Math.max(clampedStart + MIN_EVENT_DURATION_MINUTES, Math.min(override.endMinutes, TOTAL_MINUTES));
            segment.startMinutes = clampedStart;
            segment.endMinutes = clampedEnd;
            segment.layout.top = clampedStart * PIXELS_PER_MINUTE;
            segment.layout.height = (clampedEnd - clampedStart) * PIXELS_PER_MINUTE;
          }

            const daySegments = segmentsByDay.get(dayIndex);
            if (daySegments) daySegments.push(segment);
            else segmentsByDay.set(dayIndex, [segment]);
          }
        }

        if (segmentEnd.getTime() >= clampedEnd.getTime()) break;
        segmentStart = nextSegmentStart;
      }
    }

    const segmentsOverlap = (a: EventSegment, b: EventSegment) =>
      a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes;

    for (const [dayIndex, segments] of segmentsByDay.entries()) {
      if (!segments.length) continue;

      const baseLeft = columnWidth * dayIndex;

      segments.sort((a, b) => {
        if (a.startMinutes === b.startMinutes) {
          return (b.endMinutes - b.startMinutes) - (a.endMinutes - a.startMinutes);
        }
        return a.startMinutes - b.startMinutes;
      });

      const adjacency: number[][] = segments.map(() => []);
      for (let i = 0; i < segments.length; i++) {
        for (let j = i + 1; j < segments.length; j++) {
          if (!segmentsOverlap(segments[i], segments[j])) continue;
          adjacency[i].push(j);
          adjacency[j].push(i);
        }
      }

      const visited = new Set<number>();
      for (let i = 0; i < segments.length; i++) {
        if (visited.has(i)) continue;

        const componentIndices: number[] = [];
        const queue: number[] = [i];
        visited.add(i);

        while (queue.length) {
          const index = queue.pop()!;
          componentIndices.push(index);
          adjacency[index].forEach((neighbor) => {
            if (visited.has(neighbor)) return;
            visited.add(neighbor);
            queue.push(neighbor);
          });
        }

        const componentSegments = componentIndices.map((index) => segments[index]);
        componentSegments.sort((a, b) => {
          if (a.startMinutes === b.startMinutes) {
            return a.endMinutes - b.endMinutes;
          }
          return a.startMinutes - b.startMinutes;
        });

        const slotEndTimes: number[] = [];
        const slotEvents: EventSegment[][] = [];

        componentSegments.forEach((segment) => {
          let slot = -1;
          for (let s = 0; s < slotEndTimes.length; s++) {
            if (segment.startMinutes >= slotEndTimes[s]) {
              slot = s;
              break;
            }
          }
          if (slot === -1) {
            slot = slotEndTimes.length;
            slotEndTimes.push(segment.endMinutes);
            slotEvents.push([]);
          } else {
            slotEndTimes[slot] = segment.endMinutes;
          }
          segment.slot = slot;
          slotEvents[slot].push(segment);
        });

        const slotsTotal = slotEvents.length || 1;

        componentSegments.forEach((segment) => {
          const slot = segment.slot ?? 0;
          let span = 1;
          for (let s = slot + 1; s < slotsTotal; s++) {
            const hasOverlap = slotEvents[s].some((other) => segmentsOverlap(segment, other));
            if (hasOverlap) break;
            span++;
          }

          const width = Math.max(((span / slotsTotal) * columnWidth) - COLUMN_PADDING, 0);
          const left = baseLeft + (slot / slotsTotal) * columnWidth + COLUMN_PADDING / 2;
          const top = segment.startMinutes * PIXELS_PER_MINUTE;
          const height = (segment.endMinutes - segment.startMinutes) * PIXELS_PER_MINUTE;

          results.push({
            event: segment.event,
            calendar: segment.calendar,
            isAllDay: false,
            key: `${segment.event._id ?? segment.event.externalEventId}-${dayIndex}`,
            dayIndex,
            layout: {
              width,
              height,
              top,
              left,
            },
          });
        });
      }
    }

    return results;
  }, [config.numberOfDays, config.width, events, shouldRenderEvents, week.endOfWeek, week.startOfWeek, integrations, segmentOverrides]);

  const handleSegmentResize = React.useCallback((payload: {
    event: ConvexEventsAPIProps;
    calendar: ConvexCalendarAPIProps;
    direction: "top" | "bottom" | "move";
    top: number;
    height: number;
    segmentKey: string;
  }) => {
    const startMinutes = Math.max(0, payload.top / PIXELS_PER_MINUTE);
    const endMinutes = Math.min(TOTAL_MINUTES, startMinutes + payload.height / PIXELS_PER_MINUTE);
    setSegmentOverrides((prev) => ({
      ...prev,
      [payload.segmentKey]: {
        startMinutes,
        endMinutes: Math.max(startMinutes + MIN_EVENT_DURATION_MINUTES, endMinutes),
      },
    }));
  }, []);

  return (
    <View style={{ 
      width: config.totalWidth,
      height: TOTAL_DAY_HEIGHT,
    }}>
      <CalendarHourGrid numberOfDays={config.numberOfDays} />

      <ListItemEventAway width={((Dimensions.get("window").width - STYLES.calendarHourWidth - 7) / 7)} height={60} left={((Dimensions.get("window").width - STYLES.calendarHourWidth - 7) / 7) * 1 + 1} top={120}> 
        <View>
        <TextBase type="label" text={"Equans: SAPCR-1172: Aktivitäten/Leistungsarten"} style={{ fontSize: 9, color: shadeColor("#a553bb", -0.5) }} />
          </View>
      </ListItemEventAway>
      <ListItemEventTentiative width={((Dimensions.get("window").width - STYLES.calendarHourWidth - 7) / 7)} height={90} left={0} top={(120) + 90}> 
        <View>
        <TextBase type="label" text={"Equans: SAPCR-1172: Aktivitäten/Leistungsarten"} style={{ fontSize: 9, color: shadeColor("#a553bb", -0.5) }} />
          </View>
      </ListItemEventTentiative>

      {weekEvents.map(({ event, layout, isAllDay, calendar, key, dayIndex }) => {
        const normalizedEvent = {
          ...event,
          bgColorEvent: event.backgroundColor,
          descr: event.description ?? "",
        } as ConvexEventsAPIProps;

        return (
          <ListItemEvent
            key={key}
            layout={layout}
            event={normalizedEvent}
            isAllDayEvent={isAllDay}
            segmentKey={key}
            calendar={calendar}
            onResize={handleSegmentResize}
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