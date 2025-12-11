"use no memo";
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import TextBase from "@/components/typography/Text";
import { shadeColor } from "@codemize/helpers/Colors";

const { width } = Dimensions.get("window");

/** @todo REFACTORING REQUIRED! */

type TabItem = {
  title: string;
  component: React.ReactNode;
};

type Props = {
  horizontalNavigation: TabItem[];
};

type TabMetric = {
  width: number;
  x: number;
};

const TIMING_OPTIONS = {
  duration: 250,
  easing: Easing.out(Easing.cubic),
};

export default function HorizontalNavigation({ horizontalNavigation }: Props) {
  const { linkColor, infoColor, primaryBorderColor, tertiaryBgColor, primaryBgColor } = useThemeColors();
  const indexRef = useSharedValue(0);
  const baseOffsetRef = useSharedValue(0);
  const translateXRef = useSharedValue(0);
  const gestureStartXRef = useSharedValue(0);
  const tabLayoutsRef = React.useRef<TabMetric[]>(
    Array.from({ length: horizontalNavigation.length }, () => ({ width: 0, x: 0 })),
  );
  const indicatorOffsetRef = useSharedValue(0);
  const indicatorWidthRef = useSharedValue(0);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const animateIndicator = React.useCallback((targetIndex: number) => {
    const metric = tabLayoutsRef.current[targetIndex];
    if (!metric || metric.width === 0) {
      return;
    }
    indicatorOffsetRef.value = withTiming(metric.x, TIMING_OPTIONS);
    indicatorWidthRef.value = withTiming(metric.width, TIMING_OPTIONS);
  }, []);

  const updateIndex = React.useCallback((next: number, fromGesture = false) => {
    const clamped = Math.max(0, Math.min(next, horizontalNavigation.length - 1));
    indexRef.value = clamped;
    if (!fromGesture) {
      translateXRef.value = 0;
    }
    baseOffsetRef.value = withTiming(-clamped * width, TIMING_OPTIONS);
    setActiveIndex(clamped);
  }, [animateIndicator, horizontalNavigation.length]);

  React.useEffect(() => {
    const maxIndex = Math.max(0, horizontalNavigation.length - 1);
    const clamped = Math.min(indexRef.value, maxIndex);
    indexRef.value = clamped;
    setActiveIndex(clamped);
    tabLayoutsRef.current = Array.from({ length: horizontalNavigation.length }, () => ({ width: 0, x: 0 }));
    indicatorOffsetRef.value = 0;
    indicatorWidthRef.value = 0;
    baseOffsetRef.value = withTiming(-clamped * width, TIMING_OPTIONS);
    translateXRef.value = 0;
    animateIndicator(clamped);
  }, [animateIndicator, horizontalNavigation.length]);

  React.useEffect(() => {
    animateIndicator(activeIndex);
  }, [activeIndex, animateIndicator]);

  const onTabLayout = React.useCallback((event: LayoutChangeEvent, i: number) => {
    const { width: tabWidth, x } = event.nativeEvent.layout;
    tabLayoutsRef.current[i] = { width: tabWidth, x };
    if (i === activeIndex) {
      animateIndicator(i);
    }
  }, [activeIndex, animateIndicator]);

  // Gesture Handling
  const tabsLength = horizontalNavigation.length;

  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          gestureStartXRef.value = translateXRef.value;
        })
        .onUpdate((event) => {
          const raw = gestureStartXRef.value + event.translationX;
          const maxLeft = (tabsLength - 1 - indexRef.value) * width;
          const maxRight = indexRef.value * width;
          const clamped = Math.max(-maxLeft, Math.min(raw, maxRight));
          translateXRef.value = clamped;
        })
        .onEnd((event) => {
          const threshold = width * 0.25;
          let target = indexRef.value;

          if (event.translationX < -threshold && indexRef.value < tabsLength - 1) {
            target = indexRef.value + 1;
          } else if (event.translationX > threshold && indexRef.value > 0) {
            target = indexRef.value - 1;
          }

          translateXRef.value = withTiming(0, TIMING_OPTIONS);
          runOnJS(updateIndex)(target, true);
        }),
    [tabsLength, updateIndex],
  );

  // Slider Animation
  const sliderStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: baseOffsetRef.value + translateXRef.value,
      },
    ],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    width: indicatorWidthRef.value,
    transform: [
      {
        translateX: indicatorOffsetRef.value,
      },
    ],
  }));

  return (
    <View style={[styles.container, { backgroundColor: shadeColor(tertiaryBgColor, 0.1) }]}>
      {/* TAB BAR */}
      <View style={[styles.tabBar, { borderColor: primaryBorderColor, backgroundColor: primaryBgColor }]}>
        {horizontalNavigation.map((t, i) => (
          <TouchableOpacity
            key={i}
            onLayout={(e) => onTabLayout(e, i)}
            style={styles.tabButton}
            onPress={() => updateIndex(i)}
          >
            <TextBase
              text={t.title}
              type="label"
              style={[GlobalTypographyStyle.standardText, { color: i === activeIndex ? linkColor : infoColor }]} />
          </TouchableOpacity>
        ))}

        {/* ANIMATED INDICATOR */}
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            { backgroundColor: linkColor },
          ]}
        />
      </View>

      {/* SWIPE AREA */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.slider, { width: width * horizontalNavigation.length }, sliderStyle]}>
          {horizontalNavigation.map((t, i) => (
            <View key={i} style={[styles.page, {  }]}>
              {t.component}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    position: "relative",
  },

  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  indicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    borderRadius: 2,
  },

  slider: {
    flexDirection: "row",
  },

  page: {
    width,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});

