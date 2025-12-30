import React from "react";
import { Keyboard, Platform, View } from "react-native";
import type { KeyboardEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDiagramProject, faFileDashedLine, faFlagCheckered, faFloppyDisk, faObjectExclude } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import Divider from "@/components/container/Divider";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";
import WorkflowFooterStyle from "@/styles/components/layout/footer/private/WorkflowFooter";
import { useTrays } from "react-native-trays";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";

const CONTEXT_EXPANDED_HEIGHT = 140;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.32
 * @version 0.0.2
 * @type */
type WorkflowFooterProps = {
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.32
 * @version 0.0.2
 * @component */
const WorkflowFooter = ({
}: WorkflowFooterProps) => {
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

  const { push } = useTrays('modal');

  /** @description Handles the on press event for the templates tray */
  const onPressTemplates = () => push("WorkflowTemplatesTray", {});

  /** @description Handles the on press event for the workflows tray */
  const onPressWorkflows = () => push("WorkflowListTray", {});
  
  const toMilliseconds = React.useCallback((event?: KeyboardEvent) => {
    if (!event?.duration || Number.isNaN(event.duration)) return defaultAnimationDuration;
    const value = event.duration;
    return value < 10 ? value * 1000 : value;
  }, [defaultAnimationDuration]);

  const computeOffset = React.useCallback((event: KeyboardEvent) => {
    const keyboardHeight = event.endCoordinates?.height ?? 0;
    return -Math.max(0, keyboardHeight - bottom + 12);
  }, [bottom]);

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
    <Animated.View style={[WorkflowFooterStyle.animated, bottomBarAnimatedStyle, {
      bottom: bottom + 4, // -> The additional 4 is to compensate for the margin between keyboard and tray @see stackConfigs
      backgroundColor: "#fff",
      borderColor: "#dfdfdf",
    }]}>
      <View style={[GlobalContainerStyle.rowCenterBetween, WorkflowFooterStyle.view]}>
        <View style={[GlobalContainerStyle.rowCenterBetween, WorkflowFooterStyle.left, {
          backgroundColor: "#F8F8F8",  
        }]}>
          <View style={[GlobalContainerStyle.rowCenterStart, { flex: 1, gap: 16 }]}>
          <TouchableHapticDropdown
            icon={faFileDashedLine as IconProp}
            text="Vorlagen"
            type="label"
            hasViewCustomStyle={true}
            viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
            onPress={onPressTemplates} />
          <TouchableHapticDropdown
            icon={faDiagramProject as IconProp}
            text="Workflows"
            type="label"
            hasViewCustomStyle={true}
            viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
            onPress={onPressWorkflows} />
          </View>
          
          <Divider vertical style={{ height: 20 }} />
          <View style={[GlobalContainerStyle.rowCenterStart, { gap: 18 }]}>
            <TouchableHapticIcon
              icon={faFlagCheckered as IconProp}
              iconSize={18}
              hasViewCustomStyle={true}
              onPress={() => {}} />
            <TouchableHapticIcon
              icon={faObjectExclude as IconProp}
              iconSize={18}
              hasViewCustomStyle={true}
              onPress={() => {}} />
          </View>
        </View>

        <TouchableHaptic
          onPress={() => { console.log("Dashboard") }}>
            <FontAwesomeIcon icon={faFloppyDisk as IconProp} size={22} color={colors.linkColor} />
        </TouchableHaptic>

      </View>
    </Animated.View>
  );
}

export default WorkflowFooter;