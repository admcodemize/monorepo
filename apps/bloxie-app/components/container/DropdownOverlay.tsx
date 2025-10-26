import { Pressable, StyleSheet, View } from "react-native";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";

import { useDropdownContextStore } from "@/context/DropdownContext";

import DropdownOverlayStyle from "@/styles/components/container/DropdownOverlay";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a positioned dropdown based on parent component
 * @since 0.0.2
 * @version 0.0.1 */
const DropdownOverlay = () => {
  /** @see {@link context/DropdownContext} */
  const { isOpen, children, position, close } = useDropdownContextStore((state) => state);

  /** @description If the dropdown is not open or the children or position is not set, do not render anything */
  if (!isOpen || !children || !position) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(100).easing(Easing.out(Easing.ease))}
      exiting={FadeOut.duration(100).easing(Easing.out(Easing.ease))}
      style={[StyleSheet.absoluteFill]} 
      pointerEvents="box-none">
        <Pressable 
          style={DropdownOverlayStyle.container} 
          onPress={close} />
        <View style={{ 
          position: "absolute",  
          top: position.top, 
          left: position.left
        }}>{children}</View>
    </Animated.View>
  )
};

export default DropdownOverlay;