import { StyleSheet, View } from "react-native";

import { KEYS } from "@/constants/Keys";
import { CalendarCachedWeeksHorizontalProps, CalendarViewConfigProps, store, TOTAL_WEEKS, useCalendarContextStore, WEEKS_IN_PAST } from "@/context/CalendarContext";
import { getLocalization } from "@/helpers/System";
import { STYLES } from "@codemize/constants/Styles";
import { getHours, getWeekNumber, HoursProps } from "@codemize/helpers/DateTime";
import React from "react";
import { Dimensions, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import Animated from "react-native-reanimated";
import TextBase from "../typography/Text";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import CalendarBlockedScope from "./CalendarBlockedScope";
import CalendarTimeIndicator from "./CalendarTimeIndicator";
import { isThisWeek, isToday } from "date-fns";

const DIM = Dimensions.get("window");
const HOURS: HoursProps[] = getHours(24, getLocalization());

export type CalendarWeekHorizontalGridListProps = {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

type GridItemProps = CalendarCachedWeeksHorizontalProps & {
  config: CalendarViewConfigProps;
}

const CalendarWeekHorizontalGridList = React.forwardRef<Animated.FlatList, CalendarWeekHorizontalGridListProps>(({
  onScroll,
}, ref) => {
  const config = useCalendarContextStore((state) => state.config);
  const weeksHorizontal = useCalendarContextStore((state) => state.cached.weeksHorizontal);
  const keyExtractor = (item: CalendarCachedWeeksHorizontalProps, index: number) => `${KEYS.calendarWeekVerticalGridList}-${index}`;

  const renderItem = ({ 
    item 
  }: ListRenderItemInfo<CalendarCachedWeeksHorizontalProps>) => (
    <GridItem 
      index={item.index}
      week={item.week!}
      config={config} />
  );

  const getItemLayout = React.useCallback(
    (_: any, index: number) => ({
      length: config.totalWidth,
      offset: config.totalWidth * index,
      index,
    }),
    [config.totalWidth]
  );
  
  return (
    <Animated.FlatList
      ref={ref}
      data={weeksHorizontal}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      snapToInterval={config.totalWidth}
      snapToAlignment="start"
      decelerationRate="fast"
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialScrollIndex={WEEKS_IN_PAST}
      pagingEnabled={false}
      bounces={false}
      removeClippedSubviews={false}
      scrollEventThrottle={16}
      initialNumToRender={3}
      windowSize={5}
      maxToRenderPerBatch={2}
      updateCellsBatchingPeriod={50}
      overScrollMode="never"
      style={{
        height: HOURS.length * STYLES.calendarHourHeight,  // Exakte Höhe
        zIndex: 1  // Über dem Background
      }} />
  );
});

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @description Week grid column - Renders one complete week with 24 hours vertically
 * @since 0.0.2
 * @version 0.0.3
 * @param {CalendarWeekVirtualizedListItem} param0
 * @component */
const GridItem = React.memo(({
  index,
  week,
  config
}: GridItemProps) => {
  /** @description Prüfe ob diese Woche die aktuelle Woche ist (enthält heutiges Datum) */
  const locale = getLocalization();
  const showTimeIndicator = isThisWeek(week.startOfWeek, { locale });

  function shadeColor(hex: string, percent: number) {
    // Hex in R,G,B umwandeln
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
  
    // Prozentwert anwenden
    if (percent > 0) {
      // heller
      r = Math.round(r + (255 - r) * percent);
      g = Math.round(g + (255 - g) * percent);
      b = Math.round(b + (255 - b) * percent);
    } else {
      // dunkler
      r = Math.round(r * (1 + percent));
      g = Math.round(g * (1 + percent));
      b = Math.round(b * (1 + percent));
    }
  
    // wieder zu Hex
    const toHex = (v: number) => v.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  return (
    <View style={{ 
      width: config.totalWidth,
      height: HOURS.length * STYLES.calendarHourHeight,
    }}>
      {/*<CalendarBlockedScope layout={{ top: 0, left: 0, width: config.width * 3, height: HOURS.length * STYLES.calendarHourHeight }} />
      <CalendarBlockedScope layout={{ top: 0, left:  (config.width * 3) - 3, width: config.width + 3, height: 660 }} />*/}
      <ListItemEventTentiative width={((DIM.width - STYLES.calendarHourWidth - 7) / 7)} left={((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 4 + 4} top={180} height={30}>
      
        <View>
        <TextBase type="label" text={"Bloxie: Layout-Entwicklungen"} style={{ fontSize: 9, color: shadeColor("#40b2a7", -0.5) }} />
          </View>
      </ListItemEventTentiative>
      <ListItemEventTentiative width={((DIM.width - STYLES.calendarHourWidth - 7) / 7)} left={((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 3 + 3} top={60} height={60}>
      
        <View>
        <TextBase type="label" text={"Bloxie: Layout-Entwicklungen"} style={{ fontSize: 9, color: shadeColor("#40b2a7", -0.5) }} />
          </View>
      </ListItemEventTentiative>
      <ListItemEventAway width={((DIM.width - STYLES.calendarHourWidth - 7) / 7)} height={60} left={((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 4 + 4} top={0}> 
        <View>
        <TextBase type="label" text={"Equans: SAPCR-1172: Aktivitäten/Leistungsarten"} style={{ fontSize: 9, color: shadeColor("#a553bb", -0.5) }} />
          </View>
      </ListItemEventAway>
      <ListItemEventAway width={((DIM.width - STYLES.calendarHourWidth - 7) / 7)} height={30} left={((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 4 + 4} top={60}> 
        <View>
        <TextBase type="label" text={"Equans: SAPCR-1172: Aktivitäten/Leistungsarten"} style={{ fontSize: 9, color: shadeColor("#a553bb", -0.5) }} />
          </View>
      </ListItemEventAway>
      <ListItemEventAway width={((DIM.width - STYLES.calendarHourWidth - 7) / 7)} height={30} left={((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 4 + 4} top={90}> 
        <View>
        <TextBase type="label" text={"Equans: SAPCR-1172: Aktivitäten/Leistungsarten"} style={{ fontSize: 9, color: shadeColor("#a553bb", -0.5) }} />
          </View>
      </ListItemEventAway>
      <ListItemEventAway width={((DIM.width - STYLES.calendarHourWidth - 7) / 7)} height={60} left={((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 4 + 4} top={120}> 
        <View>
        <TextBase type="label" text={"Equans: SAPCR-1172: Aktivitäten/Leistungsarten"} style={{ fontSize: 9, color: shadeColor("#a553bb", -0.5) }} />
          </View>
      </ListItemEventAway>
      <ListItemEventAway width={((DIM.width - STYLES.calendarHourWidth - 7) / 7)} height={90} left={((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 4 + 4} top={210}> 
        <View>
        <TextBase type="label" text={"Equans: SAPCR-1172: Aktivitäten/Leistungsarten"} style={{ fontSize: 9, color: shadeColor("#a553bb", -0.5) }} />
          </View>
      </ListItemEventAway>
      <ListItemEventAway width={((DIM.width - STYLES.calendarHourWidth - 7) / 7)} height={180} left={((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 4 + 4} top={300}> 
        <View>
        <TextBase type="label" text={"Equans: SAPCR-1172: Aktivitäten/Leistungsarten"} style={{ fontSize: 9, color: shadeColor("#a553bb", -0.5) }} />
          </View>
      </ListItemEventAway>
      <ListItemEventAway width={((DIM.width - STYLES.calendarHourWidth - 7) / 7)} height={180} left={((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 3 + 3} top={120}> 
        <View>
        <TextBase type="label" text={"Equans: SAPCR-1172: Aktivitäten/Leistungsarten"} style={{ fontSize: 9, color: shadeColor("#a553bb", -0.5) }} />
          </View>
      </ListItemEventAway>
      <ListItemEventAway width={((DIM.width - STYLES.calendarHourWidth - 7) / 7)} height={60} left={((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 1 + 1} top={120}> 
        <View>
        <TextBase type="label" text={"Equans: SAPCR-1172: Aktivitäten/Leistungsarten"} style={{ fontSize: 9, color: shadeColor("#a553bb", -0.5) }} />
          </View>
      </ListItemEventAway>
      <ListItemEventTentiative width={((DIM.width - STYLES.calendarHourWidth - 7) / 7)} height={30} left={0} top={(4*60) + 90}> 
        <View>
        <TextBase type="label" text={"Equans: SAPCR-1172: Aktivitäten/Leistungsarten"} style={{ fontSize: 9, color: shadeColor("#a553bb", -0.5) }} />
          </View>
      </ListItemEventTentiative>
      <ListItemEvent 
        layout={{
          width: ((DIM.width - STYLES.calendarHourWidth - 7) / 7),
          height: 180,
          top: 3 * 60,
          left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 1 + 1,
        }}
        event={{
          userId: "1" as Id<"users">,
          title: "EQUANS: SAPCR-1172: Aktivitäten/Leistungsarten",
          start: new Date().toISOString(),
          end: new Date().toISOString(),
          descr: "EQUANS: SAPCR-1172: Aktivitäten/Leistungsarten",
          participants: ["1" as Id<"users">],
          bgColorEvent: "#ff606a",
        }}
      />
      <ListItemEvent 
        layout={{
          width: ((DIM.width - STYLES.calendarHourWidth - 7) / 7),
          height: 90,
          top: 6 * 60,
          left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 1 + 1,
        }}
        event={{
          userId: "1" as Id<"users">,
          title: "EQUANS: SAPCR-1172: Aktivitäten/Leistungsarten",
          start: new Date().toISOString(),
          end: new Date().toISOString(),
          descr: "EQUANS: SAPCR-1172: Aktivitäten/Leistungsarten",
          participants: ["1" as Id<"users">],
          bgColorEvent: "#40b2a7",
        }}
      />
      <ListItemEvent 
        layout={{
          width: ((DIM.width - STYLES.calendarHourWidth - 7) / 7),
          height: 90,
          top: 4 * 60,
          left: 0,
        }}
        event={{
          userId: "1" as Id<"users">,
          title: "EQUANS: SAPCR-1172: Aktivitäten/Leistungsarten",
          start: new Date().toISOString(),
          end: new Date().toISOString(),
          descr: "EQUANS: SAPCR-1172: Aktivitäten/Leistungsarten",
          participants: ["1" as Id<"users">],
          bgColorEvent: "#60cfff",
        }}
      />
      <ListItemEvent 
        layout={{
          width: ((DIM.width - STYLES.calendarHourWidth - 7) / 7),
          height: 180,
          top: 360,
          left: 0,
        }}
        event={{
          userId: "1" as Id<"users">,
          title: "EQUANS: SAPCR-1172: Aktivitäten/Leistungsarten",
          start: new Date().toISOString(),
          end: new Date().toISOString(),
          descr: "EQUANS: SAPCR-1172: Aktivitäten/Leistungsarten",
          participants: ["1" as Id<"users">],
          bgColorEvent: "#ffd739",
        }}
      />
      {/* Zeige TimeIndicator NUR in der aktuellen Woche */}
      {showTimeIndicator && <CalendarTimeIndicator />}
      {/* HIER kommen später deine Events/Termine pro Woche */}
      {/* Für jetzt: Debug-Text */}
      {/*[{id: "1", title: "EQUANS: SAPCR-1172: Aktivitäten/Leistungsarten", time: new Date(), left: 0, height: 180, top: 360}, 
      { id: "6", title: "Bloxie", time: new Date(), left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 1 + 1, height: 60, top: 420 },
      { id: "2", title: "Lighthouse Caliqua - Integrationstest 2", time: new Date(), left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 2 + 2, height: 180, top: 420 },
      { id: "3", title: "stürmSFS - Lohnausweis", time: new Date(), left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 2 + 2, height: 30, top: 330 },
      { id: "4", title: "A4S: Webinar", time: new Date(), left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 3 + 3, height: 30, top: 330 },
      { id: "5", title: "METAS: Nacharbeiten Mandantenkopie Q01", time: new Date(), left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 3 + 3, height: 270, top: 390 },
      { id: "7", title: "A4S: Quartalsmeeting", time: new Date(), left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 4 + 4, height: 210 * 2, top: 480 },
      { id: "8", title: "A4S: Ressourcenplanung", time: new Date(), left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 4 + 4, height: 60, top: 420 },
      { id: "9", title: "A4S: ProTime-Erfassung", time: new Date(), left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 4 + 4, height: 30, top: 390 },
      { id: "10", title: "A4S: ProTime-Erfassung",time: new Date(), left: 0, height: 345, top: 555},
      { id: "11", title: "Bloxie: Layout-Entwicklungen", time: new Date(), left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 1 + 1, height: 180, top: 510 },
      { id: "12", title: "Bloxie: Test-Flight", time: new Date(), left: ((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 1 + 1, height: 210, top: 720 },
    ].map((event) => {
        //const topPosition = calculateEventPosition(event.time);
        //const eventHeight = calculateEventHeight(event.duration);
        
        return (
          <View 
            key={`event-${event.id}`}
            style={{
              position: 'absolute',
              top: event.top,
              height: event.height - 1,
              left: event.left,
              padding: 4,
              width: ((DIM.width - STYLES.calendarHourWidth - 7) / 7),
              backgroundColor: event.id === "1" ? shadeColor("#60cfff", 0.6) : event.id === "2" ? shadeColor("#ff606a", 0.6): event.id === "3" ? shadeColor("#ffda60", 0.6) : event.id === "4" ? shadeColor("#40b2a7", 0.6) : event.id === "5" ? shadeColor("#ffda60", 0.6) : shadeColor("#40b2a7", 0.6),
              borderLeftWidth: 3,
              borderLeftColor: event.id === "1" ? "#60cfff" : event.id === "2" ? "#ff606a" : event.id === "3" ? "#ffda60" : event.id === "4" ? "#40b2a7" : event.id === "5" ? "#ffda60" : "#40b2a7",
              // ...
            }}>
            <TextBase type="label" text={event.title} style={{ fontSize: 9, color: event.id === "1" ? shadeColor("#60cfff", -0.5) : event.id === "2" ? shadeColor("#ff606a", -0.5) : event.id === "3" ? shadeColor("#ffda60", -0.5) : event.id === "4" ? shadeColor("#40b2a7", -0.5) : event.id === "5" ? shadeColor("#ffda60", -0.5) : shadeColor("#40b2a7", -0.5) }} />
          </View>
        );
      })*/}
    </View>
  );
});

import ListItemEventAway from "./list/ListItemEventAway";
import ListItemEventTentiative from "./list/ListItemEventTentiative";
import ListItemEvent from "./list/ListItemEvent";
import { convertFromConvex } from "@codemize/backend/Convert";
import { Id } from "../../../../packages/backend/convex/_generated/dataModel";

export default CalendarWeekHorizontalGridList;