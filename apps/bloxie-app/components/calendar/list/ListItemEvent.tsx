import React, { memo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { ConvexEventsAPIProps } from "@codemize/backend/Types";
import { LEVEL } from "@codemize/constants/Styles";

import { useUserContextStore } from "@/context/UserContext";
import { GlobalLayoutProps } from "@/types/GlobalLayout";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ListRenderItemEventProps = {
  event: ConvexEventsAPIProps;
  layout: GlobalLayoutProps;
  isNewEvent?: boolean;
  isAllDayEvent?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description
 * @since 0.0.2
 * @version 0.0.1
 * @param {Object} param0
 * @param {ConvexEventsAPIProps} param0.event - The event to render.
 * @param {LayoutProps} param0.layout - The layout of the event.
 * @param {boolean} param0.isNewEvent - Whether the event is new.
 * @param {boolean} param0.isAllDayEvent - Whether the event is all day.
 * @param {ConvexTimesAPIProps[]} param0.notAllowed - The times in which the user is not allowed to create an event.
 * @component */
const ListRenderItemEvent = ({
  event,
  layout,
  isNewEvent = false,
  isAllDayEvent = false,
}: ListRenderItemEventProps) => {  

  /**
   * @desc Handles the user settings. Used for highlighting the members of the event
   * @see {@link context/UserContext} */
  const settings = useUserContextStore((state) => state.settings);
  const memoizedSettings = React.useMemo(() => settings, [settings]);

  const translateY = useSharedValue(0);
  const startOffset = useSharedValue(0);

  /** @description Verwendung resizeTopGesture */
  const height = useSharedValue(layout.height);
  const originalBottom = useSharedValue(layout.top + layout.height);

  /*const notAllowedPixel = (notAllowed || []).map(({ startMin, endMin }) => ({
    top: getPixelFromMinutes(startMin),
    bottom: getPixelFromMinutes(endMin),
  }));*/

  //const setDurationMinute = useCalendarEventStore((state) => state.setDurationMinute);
  //const setIsInBlockedArea = useCalendarEventStore((state) => state.setIsInBlockedArea);

  const [labelLiveTime, setLabelLiveTime] = useState<string | null>(null);

  /*const durationMin = differenceInMinutes(convertFromConvex(event.end), convertFromConvex(event.start));
  const startOfDayDate = startOfDay(convertFromConvex(event.start));

  const updateLabelLiveTime = (topInPixels: number, heightInPixels: number) => {
    const approxStartMin = getMinutesFromPixels(topInPixels);
    const roundedStartMin = Math.round(approxStartMin / GRID_MINUTES) * GRID_MINUTES;
  
    const start = addMinutes(startOfDayDate, roundedStartMin);
  
    const approxDuration = getMinutesFromPixels(heightInPixels);
    const roundedDurationMin = Math.round(approxDuration / GRID_MINUTES) * GRID_MINUTES;
  
    const end = addMinutes(start, roundedDurationMin);
  
    const label = `${format(start, "HH:mm")} -> ${format(end, "HH:mm")}`;
    setLabelLiveTime(label);
  };*/


  /*const checkAndSetBlockedAreaFlag = (
    eventTop: number, 
    eventHeight: number
  ) => {
    const eventBottom = eventTop + eventHeight;
    let isBlocked = false;
    
    for (let i = 0; i < notAllowedPixel.length; i++) {
      const range = notAllowedPixel[i];
      
      // Kleine Toleranz für Rundungsfehler - Events die sich nur "berühren" zählen nicht als Überlappung
      const TOLERANCE = 1; // 1 Pixel Toleranz
      const hasOverlap = (eventTop < range.bottom - TOLERANCE) && (eventBottom > range.top + TOLERANCE);
      
      if (hasOverlap) {
        isBlocked = true;
        break; // Erste Überlappung gefunden, weitere Prüfungen unnötig
      }
    }
    
    //setIsInBlockedArea(isBlocked);
  };*/

  React.useEffect(() => {
    /** 
     * @description Initialize event animated layout position
     * -> Has to be done inside the hook "useEffect" and not directly through 
     * the initialization with "useSharedValue"
     * -> Reason: When working with slots which can be changed it will not change the position when 
     * initialized with "useSharedValue" */
    translateY.value = layout.top
    startOffset.value = layout.top;
    height.value = layout.height;

    /*updateLabelLiveTime(layout.top, layout.height);
    
    // Prüfe beim ersten Laden/Layout-Änderung ob Event in blockiertem Bereich liegt
    if (isNewEvent) {
      checkAndSetBlockedAreaFlag(layout.top, layout.height);
    }*/
  }, [layout]);


  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    height: height.value,
  }));

  const gesture = Gesture.Pan()
    .enabled(isNewEvent)
    /*.onStart(() => {
      startOffset.value = translateY.value;
    })
    .onUpdate((e) => {
      const newY = startOffset.value + e.translationY;
      translateY.value = newY;

      runOnJS(updateLabelLiveTime)(newY, height.value);
    })
    .onEnd(() => {
      const approxMinutes = getMinutesFromPixels(translateY.value); // von Pixel zu Minuten
      const snappedMinutes = Math.round(approxMinutes / GRID_MINUTES) * GRID_MINUTES; // auf GRID_MINUTES runden
    
      const snappedY = getPixelFromMinutes(snappedMinutes); // von Minuten zurück zu Pixeln
      
      translateY.value = withSpring(snappedY);
      
      // Prüfe und setze Flag ob das Event in einem blockierten Bereich liegt
      runOnJS(checkAndSetBlockedAreaFlag)(snappedY, height.value);
    });

    const resizeTopGesture = Gesture.Pan()
    .enabled(isNewEvent)
    .onStart(() => {
      startOffset.value = translateY.value;
      originalBottom.value = translateY.value + height.value;
    })
    .onUpdate((e) => {
      const proposedTop = startOffset.value + e.translationY;
      const clampedHeight = originalBottom.value - proposedTop;
  
      translateY.value = proposedTop;
      height.value = clampedHeight;
  
      runOnJS(updateLabelLiveTime)(proposedTop, clampedHeight);
    })
    .onEnd(() => {
      const snappedTopMin = Math.round(getMinutesFromPixels(translateY.value) / GRID_MINUTES) * GRID_MINUTES;
      const snappedTop = getPixelFromMinutes(snappedTopMin);
  
      const snappedHeightMin = Math.round(getMinutesFromPixels(originalBottom.value - snappedTop) / GRID_MINUTES) * GRID_MINUTES;
      const snappedHeight = getPixelFromMinutes(snappedHeightMin);
  
      const finalTop = originalBottom.value - snappedHeight;
      
      translateY.value = withSpring(finalTop);
      height.value = withSpring(snappedHeight);

      // Prüfe und setze Flag ob das Event in einem blockierten Bereich liegt
      runOnJS(checkAndSetBlockedAreaFlag)(finalTop, snappedHeight);

      /** 
       * @description Used to update the duratin minute for evaluate the free slots for creating a new event
       * @see {@link components/calendar/CalendarTimeSlotsHorizontal} 
      //runOnJS(setDurationMinute)(snappedHeightMin);
    });*/
  
  
    const resizeBottomGesture = Gesture.Pan()
    /*.enabled(isNewEvent)
    .onStart(() => {
      startOffset.value = height.value; // Aktuelle Höhe merken
    })
    .onUpdate((e) => {
      const proposedHeight = startOffset.value + e.translationY;
  
      height.value = proposedHeight;
  
      runOnJS(updateLabelLiveTime)(translateY.value, proposedHeight);
    })
    .onEnd(() => {
      // Höhe snappen
      const rawHeightMin = getMinutesFromPixels(height.value);
      const snappedHeightMin = Math.round(rawHeightMin / GRID_MINUTES) * GRID_MINUTES;
      const snappedHeight = getPixelFromMinutes(snappedHeightMin);
      
      height.value = withSpring(snappedHeight);

      // Prüfe und setze Flag ob das Event in einem blockierten Bereich liegt
      runOnJS(checkAndSetBlockedAreaFlag)(translateY.value, snappedHeight);

      /** 
       * @description Used to update the duratin minute for evaluate the free slots for creating a new event
       * @see {@link components/calendar/CalendarTimeSlotsHorizontal} *
      //runOnJS(setDurationMinute)(snappedHeightMin);
    });*/

  return (
    <>
        <Animated.View
          style={[ListRenderItemEventStyle.animated, animatedStyle, {
            //height: height.value, // Used when the user is resizing the event 
            width: layout.width,
            left: layout.left,
            borderRadius: 3,
            backgroundColor: "#fbf1c6",
            borderLeftColor: "#ffd739",
            borderLeftWidth: 4
          }]}>

              <View style={{ 
                flex: 1,     
                paddingHorizontal: 4,
                paddingVertical: layout.height <= 15 ? 1 : isAllDayEvent ? 3 : 2
                }}>
                  <View style={[GlobalContainerStyle.rowStartStart, { gap: 6 }]}>
                    <TextBase style={{ 
                      flex: 1,
                      fontSize: Number(SIZES.label),
                      fontFamily: String(FAMILIY.subtitle),
                    }} numberOfLines={3} text={event.title} />
                  </View>
                  <TextBase style={{ 
                    flex: 1,
                    fontSize: Number(SIZES.label),
                    fontFamily: String(FAMILIY.text),
                  }} numberOfLines={3} text={isNewEvent && labelLiveTime ? labelLiveTime : event.descr || ""} />
              </View>
        </Animated.View>   
    </>
  )
}

export default memo(ListRenderItemEvent);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1 */
const ListRenderItemEventStyle = StyleSheet.create({
  animated: {
    position: "absolute",
    zIndex: LEVEL.level1
  }
})