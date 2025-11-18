import { CalendarCachedWeeksHorizontalProps, CalendarContextProps, useCalendarContextStore } from "@/context/CalendarContext";
import React from "react";
import { getLocalization } from "@/helpers/System";
import { isThisWeek } from "date-fns";
import { Dimensions, View } from "react-native";
import { STYLES } from "@codemize/constants/Styles";
import { getHours, HoursProps } from "@codemize/helpers/DateTime";
const HOURS: HoursProps[] = getHours(24, getLocalization());
import CalendarHourGrid from "./CalendarHourGrid";
import CalendarTimeIndicator from "./CalendarTimeIndicator";
import TextBase from "../typography/Text";
import ListItemEventTentiative from "./list/ListItemEventTentiative";
import ListItemEventAway from "./list/ListItemEventAway";
import { shadeColor } from "@codemize/helpers/Colors";
import ListItemEvent from "./list/ListItemEvent";
import { Id } from "../../../../packages/backend/convex/_generated/dataModel";
const DIM = Dimensions.get("window");

type CalendarWeekHorizontalGridListItemProps = CalendarCachedWeeksHorizontalProps & {
  shouldRenderEvents: boolean;
}

const selectConfig = (state: CalendarContextProps) => state.config;

const CalendarWeekHorizontalGridListItem = ({
  index,
  week,
  shouldRenderEvents
}: CalendarWeekHorizontalGridListItemProps) => {
  /** @description Prüfe ob diese Woche die aktuelle Woche ist (enthält heutiges Datum) */
  const locale = getLocalization();
  const showTimeIndicator = isThisWeek(week.startOfWeek, { locale });

  const config = useCalendarContextStore(selectConfig);
  console.log("config");
  return (
    <View style={{ 
      width: config.totalWidth,
      height: HOURS.length * STYLES.calendarHourHeight,
    }}>
      <CalendarHourGrid numberOfDays={7} />
      {/*<CalendarBlockedScope layout={{ top: 0, left: 0, width: config.width * 3, height: HOURS.length * STYLES.calendarHourHeight }} />
      <CalendarBlockedScope layout={{ top: 0, left:  (config.width * 3) - 3, width: config.width + 3, height: 660 }} />*/}
      {/*<ListItemEventTentiative width={((DIM.width - STYLES.calendarHourWidth - 7) / 7)} left={((DIM.width - STYLES.calendarHourWidth - 7) / 7) * 4 + 4} top={180} height={30}>
      
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
      />*/}
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
};

const areEqual = (
  prev: Readonly<CalendarWeekHorizontalGridListItemProps>,
  next: Readonly<CalendarWeekHorizontalGridListItemProps>
) =>
  prev.shouldRenderEvents === next.shouldRenderEvents;

export default React.memo(CalendarWeekHorizontalGridListItem, areEqual);