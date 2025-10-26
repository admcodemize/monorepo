import React, { useMemo } from "react";
import { Dimensions, View } from "react-native";
import { addDays, differenceInMinutes, eachDayOfInterval, getDay, isAfter, isBefore, isWithinInterval, max, min, parseISO } from "date-fns";

import { STYLES } from "@codemize/constants/Styles";

import TouchableHaptic from "@/components/button/TouchableHaptic";

import GlobalContainerStyle from "@/styles/GlobalContainer";

const DIM = Dimensions.get("window");
const HEIGHT = 110;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 23 }, (_, i) => i);
const CELL_GAP = 2;

/** @todo Refactor the whole component!! */


type Event = {
  userId: string;
  start: string;
  end: string;
  title: string;
};

/**
 * Berechnet pro Wochentag/Stunde den durchschnittlichen Anteil freier Zeit aus den übergebenen Events
 * Aggregiert alle Montage, Dienstage, etc. über den gesamten Zeitraum
 */
function generateFreeSlots(events: Event[], daysBack = 30) {
  const today = new Date();
  const startDate = addDays(today, -daysBack);
  const days = eachDayOfInterval({ start: startDate, end: today });

  // Map zum Aggregieren: weekday-hour -> { totalFreeMinutes, count }
  const aggregateMap: Record<string, { totalFree: number; count: number }> = {};

  days.forEach((day) => {
    const dayOfWeek = getDay(day); // 0 = Sonntag, 1 = Montag, ...
    // Konvertiere zu unserem WEEKDAYS Array (0 = Montag, 6 = Sonntag)
    const weekdayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekdayName = WEEKDAYS[weekdayIndex];

    HOURS.forEach((hour) => {
      const slotStart = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), hour, 0, 0, 0));
      const slotEnd = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), hour + 1, 0, 0, 0));
  
      let busyMinutes = 0;
  
      events.forEach((ev) => {
        const evStart = parseISO(ev.start);
        const evEnd = parseISO(ev.end);
        
        
        if (
          isWithinInterval(evStart, { start: slotStart, end: slotEnd }) ||
          isWithinInterval(evEnd, { start: slotStart, end: slotEnd }) ||
          (isBefore(evStart, slotStart) && isAfter(evEnd, slotEnd))
        ) {
          const overlapStart = max([evStart, slotStart]);
          const overlapEnd = min([evEnd, slotEnd]);
          const minutes = Math.max(0, differenceInMinutes(overlapEnd, overlapStart));
          busyMinutes += minutes;
          
        }
      });
  
      const freeRatio = Math.max(0, 1 - busyMinutes / 60);
      const key = `${weekdayName}-${hour}`;
      
      if (!aggregateMap[key]) {
        aggregateMap[key] = { totalFree: 0, count: 0 };
      }
      aggregateMap[key].totalFree += freeRatio;
      aggregateMap[key].count += 1;
    });
  });

  // Durchschnitt berechnen
  const freeMap: Record<string, number> = {};
  Object.keys(aggregateMap).forEach((key) => {
    const { totalFree, count } = aggregateMap[key];
    freeMap[key] = count > 0 ? totalFree / count : 1;
  });

  return freeMap;
}

/**
 * Kontinuierliche Farbskala basierend auf dem freien Anteil
 * freeRatio = 1.0 (100% frei) → sehr hell (alpha ~0.15)
 * freeRatio = 0.0 (0% frei = 100% beschäftigt) → sehr dunkel (alpha 1.0)
 */
const getColor = (freeRatio: number) => {
  const base = { r: 117, g: 179, b: 155 };
  const busyRatio = 1 - freeRatio; // Invertiere: 0 = frei, 1 = beschäftigt
  
  // Kontinuierliche Skala von 0.15 (frei) bis 1.0 (voll beschäftigt)
  const alpha = 0.25 + (busyRatio * 0.85);
  
  return `rgba(${base.r}, ${base.g}, ${base.b}, ${alpha.toFixed(2)})`;
};

export default function DashboardHeatmap({ events }: { events: Event[] }) {
  const freeSlots = useMemo(() => {
    const result = generateFreeSlots(events, 30);
    return result;
  }, [events]);

  const totalCols = HOURS.length;
  const totalRows = WEEKDAYS.length;
  const totalHGap = (totalCols - 1) * CELL_GAP;
  const totalVGap = (totalRows - 1) * CELL_GAP;
  const cellWidth = (DIM.width - 30 - totalHGap) / totalCols;
  const cellHeight = (HEIGHT - totalVGap) / totalRows;

  return (
    <View style={{ gap: STYLES.sizeGap }}>
    <View style={[GlobalContainerStyle.rowStartStart, { width: DIM.width, height: HEIGHT }]}>
      <View style={{ flexDirection: "column" }}>
        {WEEKDAYS.map((day, idx) => (
          <View
            key={day}
            style={[GlobalContainerStyle.rowStartStart, { marginBottom: idx === WEEKDAYS.length - 1 ? 0 : CELL_GAP }]}>
            {HOURS.map((hour, colIdx) => {
              const ratio = freeSlots[`${day}-${hour}`] ?? 1;
              const color = getColor(ratio);
              return (
                <TouchableHaptic
                  key={`${day}-${hour}`}
                  onPress={() => {
                    
                  }}
                  style={{
                    width: cellWidth,
                    height: cellHeight,
                    backgroundColor: color,
                    marginRight: colIdx === HOURS.length - 1 ? 0 : CELL_GAP,
                    borderRadius: 2,
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
      {/*<View style={[GlobalContainerStyle.rowStartStart, { marginTop: 4, gap: 8 }]}>
        {[0, 0.25, 0.5, 0.75, 1.0].map((busyRatio) => {
          const freeRatio = 1 - busyRatio;
          const color = getColor(freeRatio);
          const percentage = Math.round(busyRatio * 100);
          return (
            <View
              key={busyRatio}
              style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: color,
                  borderRadius: 4,
                }}
              />
              <TextBase 
                text={`${percentage}%`} 
                style={[GlobalTypographyStyle.labelText, { fontSize: 10, color: "#5E5E5E" }]} 
              />
            </View>
          );
        })}
      </View>*/}
    </View>
  );
}
