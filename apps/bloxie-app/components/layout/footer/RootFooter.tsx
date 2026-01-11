import React from "react";
import { router } from "expo-router";
import { TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { Extrapolation, interpolate, useAnimatedReaction, useAnimatedStyle } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useTrays } from "react-native-trays";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight, faChartCandlestick, faGrid2Plus, faUpFromBracket } from "@fortawesome/duotone-thin-svg-icons";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { shadeColor } from "@codemize/helpers/Colors";

import ViewBase from "@/components/container/View";
import Divider from "@/components/container/Divider";
import TextBase from "@/components/typography/Text";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import TouchableHapticText from "@/components/button/TouchableHapticText";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import RootFooterStyle from "@/styles/components/layout/footer/private/RootFooter";

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
 * @version 0.0.3
 * @component */
const RootFooter = ({
}: RootFooterProps) => {
  const { bottom } = useSafeAreaInsets();
  const { primaryBgColor, primaryBorderColor, secondaryBgColor, infoColor, primaryIconColor, linkColor } = useThemeColors();

  const [isKeyboardHidden, setIsKeyboardHidden] = React.useState(true);
  const { push } = useTrays('main');

  /** @description Handles the on press event for the action tray */
  const onPressAction = () => push("TrayAction", {});

  /** @description Handles the on press event for the dashboard tray */
  const onPressDashboard = () => push("TrayDashboard", {});

  /** @description Used to get the height and progress of the keyboard */
  const { height, progress } = useReanimatedKeyboardAnimation();

  /** @description Used to get the animated style for the bottom bar when the keyboard is visible */
  const bottomBarAnimatedStyle = useAnimatedStyle(() => {
    const animatedBottom = interpolate(
      progress.value,
      [0, 1],
      [bottom, 10],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY: height.value }],
      bottom: animatedBottom,
    };
  });

  /** @description Used to set the isKeyboardHidden state based on the keyboard visibility for disabling the buttons when the keyboard is visible */
  useAnimatedReaction(() => progress.value > 0, (keyboardVisible) => scheduleOnRN(setIsKeyboardHidden, !keyboardVisible),[setIsKeyboardHidden]);

  return (
    <>
    <Animated.View style={[RootFooterStyle.animated, bottomBarAnimatedStyle, {
      backgroundColor: primaryBgColor,
      borderColor: primaryBorderColor,
    }]}>
      <View style={[GlobalContainerStyle.rowCenterBetween, RootFooterStyle.view]}>
        <View style={[GlobalContainerStyle.rowCenterBetween, RootFooterStyle.viewButtons, { backgroundColor: shadeColor(secondaryBgColor, 0.2) }]}>
          <ViewBase style={[GlobalContainerStyle.rowCenterStart, { gap: 6, backgroundColor: shadeColor(secondaryBgColor, 0.2) }]}>
            <TextInput
              placeholder="Neues Ereignis"
              style={[GlobalTypographyStyle.titleSubtitle, RootFooterStyle.input, { color: infoColor }]}/>
            <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
              <TouchableHapticText
                text="12:15"
                i18nTranslation={false}
                hasViewCustomStyle={true}
                onPress={() => { console.log("12:15") }} />
              <FontAwesomeIcon icon={faArrowRight as IconProp} size={9} color={primaryIconColor} />
              <TouchableHapticText
                text="12:45"
                i18nTranslation={false}
                hasViewCustomStyle={true}
                onPress={() => { console.log("12:45") }} />
            </View>
            <TextBase 
              text="30m" 
              i18nTranslation={false} 
              type="label" />
          </ViewBase>
          
          <Divider vertical style={{ height: 20 }} />
          <View style={[GlobalContainerStyle.rowCenterStart, { gap: 18 }]}>
            <TouchableHaptic
              disabled={!isKeyboardHidden}
              onPress={onPressDashboard}>
                <FontAwesomeIcon 
                  icon={faChartCandlestick as IconProp} 
                  size={18} 
                  color={primaryIconColor} />
            </TouchableHaptic>
            <TouchableHaptic
              disabled={!isKeyboardHidden}
              onPress={onPressAction}>
                <FontAwesomeIcon 
                  icon={faGrid2Plus as IconProp} 
                  size={18} 
                  color={primaryIconColor} />
            </TouchableHaptic>
          </View>
        </View>
        <TouchableHaptic
          onPress={() => router.push("/(private)/(modal)/create")}>
            <FontAwesomeIcon icon={faUpFromBracket as IconProp} size={22} color={linkColor} />
        </TouchableHaptic>
      </View>
    </Animated.View>
    </>
  );
}

export default RootFooter;