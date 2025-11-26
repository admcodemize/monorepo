import React from "react";
import { View, Pressable, Dimensions, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCheckCircle, faExclamationTriangle, faInfoCircle, faXmarkCircle } from "@fortawesome/pro-solid-svg-icons";

import { STYLES } from "@codemize/constants/Styles";

import { useToastStore } from "@/context/ToastContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { ToastType } from "@/context/ToastContext";

import TextBase from "@/components/typography/Text";

import GlobalTypographyStyle from "@/styles/GlobalTypography";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import ToastRootStyle from "@/styles/components/container/ToastRoot";

const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.14
 * @version 0.0.1
 * @description Root component for the toast. The toast is used to display a message to the user.
 * @component */
const ToastRoot = () => {
  const { primaryBgColor, primaryIconColor, infoColor } = useThemeColors();

  /** 
   * @description Store for the toast context. With the property "open" the toast can be opened 
   * -> The property "data" is used to store the data of the toast and can be passed to the function "open"
   * @see {@link context/ToastContext} */
  const { isOpen, data, children, close, showTypeIcon } = useToastStore((state) => state);

  /** @description Shared value for the translation of the toast */
  const translateY = useSharedValue(400); 

  /** @description Safe area insets for displaying the toast at the bottom of the screen above the safe area */
  const { bottom } = useSafeAreaInsets();

  /** @description State for the visibility of the toast */
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setVisible(true);
      translateY.value = withTiming(-bottom, { duration: 400 });
    } else {
      translateY.value = withTiming(400, {
        duration: 400,
      }, (finished) => {
        if (finished) runOnJS(setVisible)(false);
      });
    }
  }, [isOpen]);

  /** @TODO Add a timeout to the toast. If the toast is open and the user does not close it, it will close after the specified time */
  React.useEffect(() => {
    /** @description If the toast has a closeAfter property, the toast will close after the specified time */
    if (data?.closeAfter) {
      const timeout = setTimeout(() => close(), data.closeAfter);
      return () => clearTimeout(timeout);
    }
  }, [data?.closeAfter, close]);

  /** @description Animated style for the toast. The toast will be slided up and down */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  /**
   * @private
   * @description Get the color of the icon based on the type of the toast
   * @param {ToastType} type - The type of the toast
   * @function */
  const getIconColor = (type: ToastType): string => type === "error" 
    ? "#D15555" : type === "success" 
    ? "#159F85" : type === "warning" 
    ? "#D76F00" 
    : "#0092F9";

  /**
   * @private
   * @description Get the icon based on the type of the toast
   * @param {ToastType} type - The type of the toast
   * @function */
  const getIcon = (type: ToastType): IconProp => type === "error" 
    ? faXmarkCircle as IconProp : type === "success" 
    ? faCheckCircle as IconProp : type === "warning" 
    ? faExclamationTriangle as IconProp 
    : faInfoCircle as IconProp;

  /** @description If the toast is not visible, return null */
  if (!visible) return null;

  return (
    <View 
      style={[ToastRootStyle.container]} 
      pointerEvents="box-none">
        <Pressable 
          style={ToastRootStyle.overlay} 
          onPress={close} />
        <Animated.View style={[ToastRootStyle.animated, { 
          width: DIM.width - 20,
          backgroundColor: primaryBgColor,
        }, animatedStyle]}>
        <View 
          style={[GlobalContainerStyle.rowStartStart, { gap: 16 }]}>
          {showTypeIcon && <FontAwesomeIcon 
            icon={getIcon(data?.type || "error")} 
            color={getIconColor(data?.type || "error")} 
            size={STYLES.sizeFaIcon + 2} />}
          <View style={[GlobalContainerStyle.columnStartStart, { gap: 10, flex: 1 }]}>
            <View style={[GlobalContainerStyle.rowStartBetween, { width: "100%" }]}>
              <View style={[GlobalContainerStyle.rowStartStart, { gap: 10 }]}>
                {data?.icon && <FontAwesomeIcon 
                  icon={data.icon} 
                  size={STYLES.sizeFaIcon + 2} 
                  color={primaryIconColor} />}
                <TextBase 
                  text={data?.title ?? ""} 
                  style={GlobalTypographyStyle.textSubtitle} />
              </View>
            </View>
            {data && data.description && <TextBase 
              text={data?.description ?? ""} 
              style={[GlobalTypographyStyle.standardText, { color: infoColor }]} />}
            {typeof children === "function" 
              ? children() 
              : children}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default ToastRoot;