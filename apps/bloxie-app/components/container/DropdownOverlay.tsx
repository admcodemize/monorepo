import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";

import { useDropdownContextStore } from "@/context/DropdownContext";

import DropdownOverlayStyle from "@/styles/components/container/DropdownOverlay";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @type */
type DropdownOverlayProps = {
  hostId?: string;
  backgroundColor?: string;
  hasCustomViewStyle?: boolean;
  customViewStyle?: ViewStyle;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a positioned dropdown based on parent component
 * @since 0.0.2
 * @version 0.0.2
 * @param {string} param0.hostId - So that different overlay hosts can be controlled e.g. "tray" or "dashboard"
 * @param {string} param0.backgroundColor - The background color of the overlay
 * @param {boolean} param0.hasCustomViewStyle - If true, the custom view style will be used instead of the default style
 * @param {ViewStyle} param0.customViewStyle - The custom view style
 * @component */
const DropdownOverlay = ({ 
  hostId = "default",
  backgroundColor = "#00000015",
  hasCustomViewStyle = false,
  customViewStyle
}: DropdownOverlayProps) => {
  /** @see {@link context/DropdownContext} */
  const { isOpen, children, position, close, hostId: activeHostId } = useDropdownContextStore((state) => state);

  /** @description If the dropdown is not open or the children or position is not set, do not render anything */
  if (!isOpen || !children || !position || activeHostId !== hostId) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(100).easing(Easing.out(Easing.ease))}
      exiting={FadeOut.duration(100).easing(Easing.out(Easing.ease))}
      style={hasCustomViewStyle ? customViewStyle : [StyleSheet.absoluteFill]} 
      pointerEvents="box-none">
        <Pressable 
          style={[DropdownOverlayStyle.container, { backgroundColor }]} 
          onPress={close} />
        <View style={{ 
          position: "absolute",  
          top: position.top, 
          bottom: position.bottom,
          left: position.left,
          right: position.right
        }}>{children}</View>
    </Animated.View>
  )
};

export default DropdownOverlay;