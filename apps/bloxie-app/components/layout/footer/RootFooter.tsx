import React from "react";
import { Keyboard, Platform, TextInput, View } from "react-native";
import { NavigationContainer, NavigationContainerProps, NavigationIndependentTree } from '@react-navigation/native';
import type { KeyboardEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRight, faCalendarPlus, faChartCandlestick, faGrid2Plus, faLink, faUpFromBracket, faXmark } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import Divider from "@/components/container/Divider";
import { useTrays } from "react-native-trays";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import BaseOverlay from "@/components/container/BaseOverlay";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";
import { createMaterialTopTabNavigator, MaterialTopTabBar } from "@react-navigation/material-top-tabs";
import { useFontSize } from "@/hooks/typography/useFont";
import { shadeColor } from "@codemize/helpers/Colors";
import ViewBase from "@/components/container/View";
import { router } from "expo-router";
import TouchableHapticText from "@/components/button/TouchableHapticText";
import TextBase from "@/components/typography/Text";

const BASE_BAR_HEIGHT = 50;
const CONTEXT_EXPANDED_HEIGHT = 140;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.17
 * @version 0.0.1
 * @type */
type RootFooterProps = {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.17
 * @version 0.0.4
 * @param {RootHeaderProps} param0
 * @component */
const Tabs = createMaterialTopTabNavigator();

const TabAScreen = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "#fff",
    }}
  />
);

const TabBScreen = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "#fff",
    }}
  />
);

const RootFooter = ({
}: RootFooterProps) => {
  const refCalendar = React.useRef<View|null>(null);
  const { bottom } = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const contextHeight = useSharedValue(0);
  const defaultAnimationDuration = React.useMemo(() => Platform.select({ ios: 250, android: 200 }) ?? 220, []);
  const isInputFocused = React.useRef(false);

  const [isContextExpanded, setIsContextExpanded] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const openContext = React.useCallback(
    (duration: number = defaultAnimationDuration) => {
      setIsContextExpanded(true);
      contextHeight.value = withTiming(CONTEXT_EXPANDED_HEIGHT, { duration });
    },
    [contextHeight, defaultAnimationDuration]
  );

  const closeContext = React.useCallback(
    (duration: number = defaultAnimationDuration) => {
      setIsContextExpanded(false);
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
    //setIsFocused(true);
    //openContext();
  }, [openContext]);

  const handleInputBlur = React.useCallback(() => {
    isInputFocused.current = false;
    //setIsFocused(false);
    //closeContext();
  }, [closeContext]);

  const handleContextToggle = React.useCallback(() => {
    if (isContextExpanded) {
      isInputFocused.current = false;
      Keyboard.dismiss();
      closeContext();
      return;
    }

    openContext();
  }, [closeContext, openContext, isContextExpanded]);

  React.useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const handleKeyboardShow = (event: KeyboardEvent) => {
      const duration = toMilliseconds(event);
      translateY.value = withTiming(computeOffset(event), { duration });
      if (isInputFocused.current) {
        //openContext(duration);
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

  const animatedContextStyle = useAnimatedStyle(() => {
    const height = Math.max(contextHeight.value, 0);
    const progress = Math.min(height / CONTEXT_EXPANDED_HEIGHT, 1);

    return {
      height,
      opacity: progress,
      transform: [{ translateY: (1 - progress) * 16 }],
    };
  });

  return (
    <>
    {isContextExpanded && <BaseOverlay />}
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
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, backgroundColor: isContextExpanded ? "transparent" : "#F8F8F8", borderRadius: 15, padding: 4, flex: 1, minHeight: BASE_BAR_HEIGHT - 8, paddingHorizontal: 12 }}>
          <View style={[GlobalContainerStyle.rowCenterStart, { flex: 1, gap: 6 }]}>
            <TextInput
              placeholder="Neues Ereignis"
              style={[GlobalTypographyStyle.standardText, { color: colors.infoColor, flex: 1, marginRight: 8 }]}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}/>
            <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
              <TouchableHapticText
                text="12:15"
                i18nTranslation={false}
                hasViewCustomStyle={true}
                onPress={() => { console.log("12:15") }} />
              <FontAwesomeIcon icon={faArrowRight as IconProp} size={9} color={colors.primaryIconColor} />
              <TouchableHapticText
                text="12:45"
                i18nTranslation={false}
                hasViewCustomStyle={true}
                onPress={() => { console.log("12:45") }} />
            </View>
            <TextBase text="30m" i18nTranslation={false} type="label" />
            {/*<TouchableHapticDropdown
              ref={refCalendar}
              icon={faLink as IconProp}
              text={`Bloxie 1.1`}
              backgroundColor={colors.tertiaryBgColor}
              hasViewCustomStyle={true}
              viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4}}
              onPress={() => {}} />*/}
          </View>
          
          {!isContextExpanded && <Divider vertical style={{ height: 20 }} />}
          {!isContextExpanded && <View style={[GlobalContainerStyle.rowCenterStart, { gap: 18 }]}>
            <TouchableHaptic
              onPress={onPressDashboard}>
                <FontAwesomeIcon icon={faChartCandlestick as IconProp} size={18} color={colors.primaryIconColor} />
            </TouchableHaptic>
            <TouchableHaptic
              onPress={onPressAction}>
                <FontAwesomeIcon icon={faGrid2Plus as IconProp} size={18} color={colors.primaryIconColor} />
            </TouchableHaptic>
          </View>}
        </View>
        <TouchableHaptic
          onPress={() => router.push("/(private)/(modal)/create")}>
            <FontAwesomeIcon icon={faUpFromBracket as IconProp} size={22} color="#047dd4" />
        </TouchableHaptic>
      </View>

      <Animated.View
        style={[
          {
            overflow: "hidden",
            flex: 1,
          },
          animatedContextStyle
        ]}
      >
        <ViewBase>
          {/*<NavigationContainerBase />*/}
        </ViewBase>
      </Animated.View>
    </Animated.View>
    </>
  );
}

const NavigationContainerBase = () => {
  const colors = useThemeColors();
  return (
    <NavigationIndependentTree >
      <NavigationContainer>
        <Tabs.Navigator 
          style={{
            paddingTop: 0,
            marginTop: 0,
            backgroundColor: 'transparent',
          }}
          screenOptions={{
            tabBarLabelStyle: { fontSize: useFontSize("text") },
            tabBarItemStyle: { width: "auto", padding: 0, margin: 0 },
            tabBarIndicatorStyle: { backgroundColor: colors.focusedBgColor },
            tabBarIndicatorContainerStyle: { borderBottomWidth: 0.5, borderBottomColor: colors.primaryBorderColor },
            tabBarContentContainerStyle: {
              marginTop: -5,
              paddingHorizontal: 10,
            },
            tabBarStyle: { 
              height: 30,
            }
          }}>

            <Tabs.Screen name="Beschreibung" component={TabAScreen} />
            <Tabs.Screen name="Anlagen" component={TabBScreen} />
        </Tabs.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}

export default RootFooter;