import { Pressable, StyleSheet, View } from "react-native";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";

import DropdownOverlayStyle from "@/styles/components/container/DropdownOverlay";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.30
 * @version 0.0.1
 * @param {object} param0
 * @param {string} param0.backgroundColor - The background color of the overlay
 * @component */
const BaseOverlay = ({
  backgroundColor = "#00000020",
}) => {
  return (
    <Animated.View
      entering={FadeIn.duration(100).easing(Easing.out(Easing.ease))}
      exiting={FadeOut.duration(100).easing(Easing.out(Easing.ease))}
      style={[StyleSheet.absoluteFill, { backgroundColor }]} 
      pointerEvents="box-none">
        <Pressable 
          style={[DropdownOverlayStyle.container]} 
          onPress={() => {}} />
        <View style={{ 
          position: "absolute",  
          top: 0, 
          left: 0,
          right: 0
        }}></View>
    </Animated.View>
  )
}

export default BaseOverlay;