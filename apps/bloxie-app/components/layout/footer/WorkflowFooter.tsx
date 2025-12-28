import React from "react";
import { Keyboard, Platform, TextInput, View } from "react-native";
import type { KeyboardEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRight, faChartCandlestick, faFileDashedLine, faGrid2Plus, faUpFromBracket } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import Divider from "@/components/container/Divider";
import { useTrays } from "react-native-trays";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import TouchableHapticText from "@/components/button/TouchableHapticText";
import TextBase from "@/components/typography/Text";
import { router } from "expo-router";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

const BASE_BAR_HEIGHT = 50;
const CONTEXT_EXPANDED_HEIGHT = 140;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.17
 * @version 0.0.1
 * @type */
type WorkflowFooterProps = {}

const WorkflowFooter = ({
}: WorkflowFooterProps) => {
  const refCalendar = React.useRef<View|null>(null);
  const { bottom } = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const contextHeight = useSharedValue(0);
  const defaultAnimationDuration = React.useMemo(() => Platform.select({ ios: 250, android: 200 }) ?? 220, []);
  const isInputFocused = React.useRef(false);

  const openContext = React.useCallback(
    (duration: number = defaultAnimationDuration) => {
      contextHeight.value = withTiming(CONTEXT_EXPANDED_HEIGHT, { duration });
    },
    [contextHeight, defaultAnimationDuration]
  );

  const closeContext = React.useCallback(
    (duration: number = defaultAnimationDuration) => {
      contextHeight.value = withTiming(0, { duration });
    },
    [contextHeight, defaultAnimationDuration]
  );

  /** @description Used to get the theme based colors */
  const colors = useThemeColors();

  const { push } = useTrays('main');

  /** @description Handles the on press event for the action tray */
  const onPressAction = () => push("ActionTray", {});

  /** @description Handles the on press event for the dashboard tray */
  const onPressDashboard = () => push("DashboardTray", {});
  
  const toMilliseconds = React.useCallback((event?: KeyboardEvent) => {
    if (!event?.duration || Number.isNaN(event.duration)) return defaultAnimationDuration;
    const value = event.duration;
    return value < 10 ? value * 1000 : value;
  }, [defaultAnimationDuration]);

  const computeOffset = React.useCallback((event: KeyboardEvent) => {
    const keyboardHeight = event.endCoordinates?.height ?? 0;
    return -Math.max(0, keyboardHeight - bottom + 12);
  }, [bottom]);

  const handleInputFocus = React.useCallback(() => {
    isInputFocused.current = true;
    openContext();
  }, [openContext]);

  const handleInputBlur = React.useCallback(() => {
    isInputFocused.current = false;
    closeContext();
  }, [closeContext]);

  const handleContextToggle = React.useCallback(() => {
    isInputFocused.current = false;
    Keyboard.dismiss();
  }, [closeContext]);

  React.useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const handleKeyboardShow = (event: KeyboardEvent) => {
      const duration = toMilliseconds(event);
      translateY.value = withTiming(computeOffset(event), { duration });
      if (isInputFocused.current) {
        openContext(duration);
      }
    };

    const handleKeyboardHide = (event: KeyboardEvent) => {
      const duration = toMilliseconds(event);
      translateY.value = withTiming(0, { duration });
      if (isInputFocused.current) {
        isInputFocused.current = false;
        closeContext(duration);
      }
    };

    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [computeOffset, toMilliseconds, openContext, closeContext, translateY]);

  const bottomBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <>
    <Animated.View style={[
      {
        flexDirection: "column",
        position: "absolute",
        bottom,
        left: 14,
        right: 14,
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#dfdfdf",
        overflow: "hidden",
      },
      bottomBarAnimatedStyle
    ]}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, padding: 4, paddingRight: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, backgroundColor: "#F8F8F8", borderRadius: 15, padding: 4, flex: 1, minHeight: BASE_BAR_HEIGHT - 8, paddingHorizontal: 12 }}>
          <View style={[GlobalContainerStyle.rowCenterStart, { flex: 1, gap: 6 }]}>

          </View>
          
          <Divider vertical style={{ height: 20 }} />
          <View style={[GlobalContainerStyle.rowCenterStart, { gap: 18 }]}>

          </View>
        </View>

        <TouchableHapticDropdown
          icon={faFileDashedLine as IconProp}
          text="Vorlagen"
          type="label"
          hasViewCustomStyle={true}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
          onPress={() => { console.log("Mehr") }} />
      </View>
    </Animated.View>
    </>
  );
}

export default WorkflowFooter;