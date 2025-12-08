import React from "react";
import Animated, { interpolateColor, useSharedValue, withSpring, withTiming, useDerivedValue, useAnimatedStyle } from "react-native-reanimated";

import TouchableHaptic from "./TouchableHaptic";

import TouchableHapticSwitchStyle from "@/styles/components/button/TouchableHapticSwitch";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.13
 * @version 0.0.2
 * @type */
export type TouchableHapticSwitchProps = {
  disabled?: boolean;
  state: boolean;
  onStateChange?: (state: boolean) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.13
 * @version 0.0.2
 * @param {TouchableHapticSwitchProps} param0
 * @param {boolean} param0.state - Activity state 
 * @param {Function} param0.onStateChange - Callback function to handle the state change
 * @component */
const TouchableHapticSwitch = ({ 
  disabled = false,
  state,
  onStateChange
}: TouchableHapticSwitchProps) => {
  const didMount = React.useRef<boolean>(false);
  const isUserInteraction = React.useRef<boolean>(false);

  /**
   * @description Handles the switches toggle state */
  const [toggle, setToggle] = React.useState<boolean>(state);

  /**
   * @description Used for animating styling */
  const switchToggle = useSharedValue<number>(0);

  /**
   * @description Creates a new shared values based on existing ones while keeping them reactive */
  const progress = useDerivedValue(() => withTiming(toggle ? 18 : 0))

  /**
   * @description Animated styling for container backgroundColor */
  const backgroundColorContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, [0, 18], ["#e6e6e6", "#fefefe"]);
    const borderColor = interpolateColor(progress.value, [0, 18], ["#d5d5d5", "#d5d5d5"]);
    return { 
      backgroundColor,
      borderColor
     };
  });

  /**
   * @description Animated styling for circle backgroundColor */
  const backgroundColorCircleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, [0, 18], ["#ffffff", "#303030"]);
    return { backgroundColor };
  });

  /**
   * @description Animated styling for toggle sliding transformation */
  const springStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: withSpring(switchToggle.value, {
        mass: 1,
        damping: 15,
        stiffness: 120,
        overshootClamping: false,
        energyThreshold: 0.001
      })
    }]
  }));

  /** @description Handles the press event of the switch for select/deselect the switch */
  const onPress = React.useCallback(() => {
    isUserInteraction.current = true;
    setToggle(!toggle);
  }, [toggle]);

  /** @description Reset the didMount flag when the component unmounts */
  React.useEffect(() => {
    return () => {
      didMount.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (toggle) switchToggle.value = 18;
    else switchToggle.value = 4;

    /** @description Prevent the callback function from being called on initial mount */
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    if (!isUserInteraction.current) return;
    isUserInteraction.current = false;

    onStateChange?.(toggle);
  }, [toggle, switchToggle]);

  React.useEffect(() => {
    if (isUserInteraction.current) return;
    setToggle(state);
  }, [state]);

  return (
    <TouchableHaptic  
      disabled={disabled}
      opacityDisabled={1}
      onPress={onPress}>
      <Animated.View style={[TouchableHapticSwitchStyle.container, backgroundColorContainerStyle]}>
        <Animated.View style={[TouchableHapticSwitchStyle.circle, backgroundColorCircleStyle, springStyle]} />
      </Animated.View>
    </TouchableHaptic>
  )
}

export default TouchableHapticSwitch;