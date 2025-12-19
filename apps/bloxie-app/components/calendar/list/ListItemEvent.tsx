import React, { memo, useCallback, useState } from "react";
import * as Haptics from "expo-haptics";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, FadeOut, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { ConvexCalendarAPIProps, ConvexEventsAPIProps } from "@codemize/backend/Types";
import { LEVEL } from "@codemize/constants/Styles";

import { useUserContextStore } from "@/context/UserContext";
import { GlobalLayoutProps } from "@/types/GlobalLayout";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import { shadeColor } from "@codemize/helpers/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowsRotate } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { GRID_MINUTES, MINUTES_IN_DAY, PIXELS_PER_MINUTE } from "@codemize/helpers/DateTime";
import { isWeb } from "@/helpers/System";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ListRenderItemEventProps = {
  event: ConvexEventsAPIProps;
  calendar: ConvexCalendarAPIProps;
  layout: GlobalLayoutProps;
  segmentKey: string;
  isNewEvent?: boolean;
  isAllDayEvent?: boolean;
  onResize?: (payload: {
    event: ConvexEventsAPIProps;
    calendar: ConvexCalendarAPIProps;
    direction: "top" | "bottom" | "move";
    top: number;
    height: number;
    segmentKey: string;
  }) => void;
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
 * @todo Refactor!!
 * @component */
const ACTIVE_Z_INDEX = 1000;

const ListRenderItemEvent = ({
  event,
  calendar,
  layout,
  segmentKey,
  isNewEvent = false,
  isAllDayEvent = false,
  onResize,
}: ListRenderItemEventProps) => {  

  /**
   * @desc Handles the user settings. Used for highlighting the members of the event
   * @see {@link context/UserContext} */
  const settings = useUserContextStore((state) => state.settings);
  const memoizedSettings = React.useMemo(() => settings, [settings]);
  const [isResizeActive, setIsResizeActive] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const translateY = useSharedValue(0);
  const startOffset = useSharedValue(0);

  /** @description Verwendung resizeTopGesture */
  const EVENT_OFFSET_Y = 0.5;
  const EVENT_HEIGHT_ADJUST = 1.5;
  const height = useSharedValue(layout.height - EVENT_HEIGHT_ADJUST);
  const originalBottom = useSharedValue(layout.top + layout.height);
  const dragStartTop = useSharedValue(layout.top);
  const MIN_EVENT_HEIGHT = Math.max(PIXELS_PER_MINUTE * GRID_MINUTES, 24);
  const TOTAL_DAY_HEIGHT_PX = PIXELS_PER_MINUTE * MINUTES_IN_DAY;

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
    translateY.value = layout.top + EVENT_OFFSET_Y;
    startOffset.value = layout.top;
    height.value = layout.height - EVENT_HEIGHT_ADJUST;
    dragStartTop.value = layout.top;

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

  const handleResizeEnd = useCallback((direction: "top" | "bottom" | "move", top: number, newHeight: number) => {
    if (!onResize) return;
    onResize({
      event,
      calendar,
      direction,
      top,
      height: newHeight,
      segmentKey,
    });
    setIsResizeActive(false);
  }, [calendar, event, onResize, segmentKey]);
  const snapToGrid = useCallback((value: number) => {
    "worklet";
    const minutes = value / PIXELS_PER_MINUTE;
    const snappedMinutes = Math.round(minutes / GRID_MINUTES) * GRID_MINUTES;
    const clampedMinutes = Math.max(0, Math.min(snappedMinutes, MINUTES_IN_DAY));
    return clampedMinutes * PIXELS_PER_MINUTE;
  }, []);

  const triggerHapticFeedback = useCallback(() => {
    if (!isWeb()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const toggleResize = useCallback(() => {
    setIsResizeActive((prev) => {
      const next = !prev;
      if (next) {
        triggerHapticFeedback();
      } else {
        setIsResizing(false);
        setIsDragging(false);
      }
      return next;
    });
  }, [triggerHapticFeedback]);

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(toggleResize)();
  });

  const resizeTopGesture = Gesture.Pan()
    .enabled(!isAllDayEvent)
    .onStart(() => {
      startOffset.value = translateY.value - EVENT_OFFSET_Y;
      originalBottom.value = translateY.value + height.value;
      runOnJS(setIsResizing)(true);
      runOnJS(triggerHapticFeedback)();
    })
    .onUpdate((eventGesture) => {
      const proposedTopRaw = startOffset.value + eventGesture.translationY;
      const clampedTopRaw = Math.min(proposedTopRaw, originalBottom.value - MIN_EVENT_HEIGHT);
      const limitedTopRaw = Math.max(clampedTopRaw, 0);
      translateY.value = limitedTopRaw + EVENT_OFFSET_Y;
      const newHeightRaw = Math.max(originalBottom.value - limitedTopRaw, MIN_EVENT_HEIGHT);
      height.value = Math.max(newHeightRaw - EVENT_HEIGHT_ADJUST, MIN_EVENT_HEIGHT - EVENT_HEIGHT_ADJUST);
    })
    .onEnd(() => {
      const currentTopRaw = translateY.value - EVENT_OFFSET_Y;
      const snappedTopRaw = snapToGrid(currentTopRaw);
      let snappedBottomRaw = snapToGrid(originalBottom.value);
      if (snappedBottomRaw <= snappedTopRaw) {
        snappedBottomRaw = snappedTopRaw + GRID_MINUTES * PIXELS_PER_MINUTE;
      }
      const snappedHeightRaw = Math.max(snappedBottomRaw - snappedTopRaw, MIN_EVENT_HEIGHT);
      translateY.value = withSpring(snappedTopRaw + EVENT_OFFSET_Y);
      height.value = withSpring(Math.max(snappedHeightRaw - EVENT_HEIGHT_ADJUST, MIN_EVENT_HEIGHT - EVENT_HEIGHT_ADJUST));
      originalBottom.value = snappedTopRaw + snappedHeightRaw;
      runOnJS(handleResizeEnd)("top", snappedTopRaw, snappedHeightRaw);
      runOnJS(setIsResizing)(false);
    });

  const resizeBottomGesture = Gesture.Pan()
    .enabled(!isAllDayEvent)
    .onStart(() => {
      startOffset.value = height.value + EVENT_HEIGHT_ADJUST;
      runOnJS(setIsResizing)(true);
      runOnJS(triggerHapticFeedback)();
    })
    .onUpdate((eventGesture) => {
      const proposedHeightRaw = startOffset.value + eventGesture.translationY;
      const clampedHeightRaw = Math.max(proposedHeightRaw, MIN_EVENT_HEIGHT);
      height.value = Math.max(clampedHeightRaw - EVENT_HEIGHT_ADJUST, MIN_EVENT_HEIGHT - EVENT_HEIGHT_ADJUST);
      originalBottom.value = translateY.value - EVENT_OFFSET_Y + clampedHeightRaw;
    })
    .onEnd(() => {
      const snappedTopRaw = snapToGrid(translateY.value - EVENT_OFFSET_Y);
      let snappedBottomRaw = snapToGrid(snappedTopRaw + height.value + EVENT_HEIGHT_ADJUST);
      if (snappedBottomRaw <= snappedTopRaw) {
        snappedBottomRaw = snappedTopRaw + GRID_MINUTES * PIXELS_PER_MINUTE;
      }
      const snappedHeightRaw = Math.max(snappedBottomRaw - snappedTopRaw, MIN_EVENT_HEIGHT);
      translateY.value = withSpring(snappedTopRaw + EVENT_OFFSET_Y);
      height.value = withSpring(Math.max(snappedHeightRaw - EVENT_HEIGHT_ADJUST, MIN_EVENT_HEIGHT - EVENT_HEIGHT_ADJUST));
      originalBottom.value = snappedTopRaw + snappedHeightRaw;
      runOnJS(handleResizeEnd)("bottom", snappedTopRaw, snappedHeightRaw);
      runOnJS(setIsResizing)(false);
    });

  const dragGesture = Gesture.Pan()
    .enabled(!isAllDayEvent && !isResizeActive)
    .activateAfterLongPress(400)
    .onStart(() => {
      dragStartTop.value = translateY.value - EVENT_OFFSET_Y;
      runOnJS(setIsDragging)(true);
      runOnJS(triggerHapticFeedback)();
    })
    .onUpdate((eventGesture) => {
      const currentHeightRaw = height.value + EVENT_HEIGHT_ADJUST;
      const proposedTopRaw = dragStartTop.value + eventGesture.translationY;
      const maxTopRaw = Math.max(TOTAL_DAY_HEIGHT_PX - currentHeightRaw, 0);
      const boundedTopRaw = Math.min(Math.max(proposedTopRaw, 0), maxTopRaw);
      translateY.value = boundedTopRaw + EVENT_OFFSET_Y;
      originalBottom.value = boundedTopRaw + currentHeightRaw;
    })
    .onEnd(() => {
      const currentHeightRaw = height.value + EVENT_HEIGHT_ADJUST;
      const snappedTopRaw = snapToGrid(translateY.value - EVENT_OFFSET_Y);
      let snappedBottomRaw = snapToGrid(snappedTopRaw + currentHeightRaw);
      if (snappedBottomRaw <= snappedTopRaw) {
        snappedBottomRaw = snappedTopRaw + GRID_MINUTES * PIXELS_PER_MINUTE;
      }
      const snappedHeightRaw = Math.max(snappedBottomRaw - snappedTopRaw, MIN_EVENT_HEIGHT);
      translateY.value = withSpring(snappedTopRaw + EVENT_OFFSET_Y);
      height.value = withSpring(Math.max(snappedHeightRaw - EVENT_HEIGHT_ADJUST, MIN_EVENT_HEIGHT - EVENT_HEIGHT_ADJUST));
      originalBottom.value = snappedTopRaw + snappedHeightRaw;
      runOnJS(handleResizeEnd)("move", snappedTopRaw, snappedHeightRaw);
      runOnJS(setIsDragging)(false);
    })
    .onFinalize(() => {
      runOnJS(setIsDragging)(false);
    });

  const composedGesture = Gesture.Exclusive(dragGesture, tapGesture);

  return (
    <>
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          //entering={FadeIn.duration(200).easing(Easing.out(Easing.ease))}
          exiting={FadeOut.duration(200).easing(Easing.out(Easing.ease))}
          style={[
            ListRenderItemEventStyle.animated,
            animatedStyle,
            {
              width: layout.width - 1,
              left: layout.left + 0.5,
              backgroundColor: shadeColor(event.backgroundColor || "#fbf1c6", 0.7),
              borderLeftColor: calendar?.backgroundColor || "#ffd739",
              borderLeftWidth: 3,
              zIndex: isResizeActive || isResizing || isDragging ? ACTIVE_Z_INDEX : LEVEL.level1,
              elevation: isResizeActive || isResizing || isDragging ? ACTIVE_Z_INDEX : LEVEL.level1,
            },
          ]}>
              {!isAllDayEvent && (isResizeActive || isResizing) && (
                <>
                  <GestureDetector gesture={resizeTopGesture}>
                    <Animated.View style={[ListRenderItemEventStyle.resizeOverlay, ListRenderItemEventStyle.overlayTop]}>
                      <View style={[ListRenderItemEventStyle.overlayIndicatorTop, { borderColor: calendar?.backgroundColor || "#ffd739", backgroundColor: event?.backgroundColor || "#fbf1c6" }]} />
                    </Animated.View>
                  </GestureDetector>
                  <GestureDetector gesture={resizeBottomGesture}>
                    <Animated.View style={[ListRenderItemEventStyle.resizeOverlay, ListRenderItemEventStyle.overlayBottom]}>
                      <View style={[ListRenderItemEventStyle.overlayIndicatorBottom, { borderColor: calendar.backgroundColor || "#ffd739", backgroundColor: event.backgroundColor || "#fbf1c6" }]} />
                    </Animated.View>
                  </GestureDetector>
                </>
              )}

              <View style={{ 
                flex: 1,     
                paddingHorizontal: 4,
                paddingVertical: layout.height <= 15 ? 2 : isAllDayEvent ? 3 : 2,
                paddingBottom: 4,
                gap: 2
                }}>
                  <View style={[GlobalContainerStyle.rowStartStart, { gap: 6 }]}>
                    <TextBase style={{ 
                      flex: 1,
                      fontSize: 9, //Number(SIZES.label) - 2,
                      fontFamily: String(FAMILIY.subtitle),
                      color: shadeColor(event.backgroundColor || "#fbf1c6", -0.5),
                    }} numberOfLines={3} text={event.title} />
                  </View>
                  <TextBase style={{ 
                    flex: 1,
                    fontSize: 9,//Number(SIZES.label),
                    fontFamily: String(FAMILIY.label),
                    color: shadeColor(event.backgroundColor || "#fbf1c6", -0.3),
                  }} numberOfLines={3} text={isNewEvent && labelLiveTime ? labelLiveTime : event.location || ""} />
                  {layout.height >= 60 && <View style={[GlobalContainerStyle.rowCenterStart, { gap: 2 }]}>
                    {event?.recurringEventId && <FontAwesomeIcon icon={faArrowsRotate as IconProp} size={10} color={shadeColor(event.backgroundColor || "#fbf1c6", -0.3)} />}
                  </View>}
              </View>
        </Animated.View>   
      </GestureDetector>
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
  },
  resizeOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "50%",
    zIndex: LEVEL.level2,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTop: {
    top: -4,
  },
  overlayBottom: {
    bottom: -4,
  },
  overlayIndicatorTop: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "black",
    borderWidth: 1,
  },
  overlayIndicatorBottom: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "black",
    borderWidth: 1,
  },
})
