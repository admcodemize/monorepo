import { LEVEL } from '@codemize/constants/Styles';
import React from 'react';
import { StyleSheet, SafeAreaView, View, Pressable, Text, Dimensions } from 'react-native';
import Animated, {
  withDelay,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';
import { useTrays } from 'react-native-trays';

const DIM = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 40;

const TouchableFloatingActionButton = ({ isExpanded, index, buttonLetter, onPress }: { isExpanded: SharedValue<boolean>, index: number, buttonLetter: string, onPress: () => void }) => {
  const animatedStyles = useAnimatedStyle(() => {
    // highlight-next-line
    const moveValue = isExpanded.value ? OFFSET * index : 0;
    const translateValue = withSpring(-moveValue, SPRING_CONFIG);
    //highlight-next-line
    const delay = index * 100;

    const scaleValue = isExpanded.value ? 1 : 0;

    return {
      transform: [
        { translateY: translateValue },
        {
          scale: withDelay(delay, withTiming(scaleValue)),
        },
      ],
    };
  });

  return (
    <AnimatedPressable style={[animatedStyles, styles.shadow, styles.button]} onPress={onPress}>
      <Animated.Text style={styles.content}>{buttonLetter}</Animated.Text>
    </AnimatedPressable>
  );
};

export default function TouchableFloationAction () {
  const isExpanded = useSharedValue(false);

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  };

  const plusIconStyle = useAnimatedStyle(() => {
    // highlight-next-line
    const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? '45deg' : '0deg';

    return {
      transform: [
        { translateX: translateValue },
        { rotate: withTiming(rotateValue) },
      ],
    };
  });

  const { push } = useTrays('main');

  return (
    <View style={styles.mainContainer}>
        <View style={styles.buttonContainer}>
          <AnimatedPressable
            onPress={handlePress}
            style={[styles.shadow, mainButtonStyles.button]}>
            <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>
              +
            </Animated.Text>
          </AnimatedPressable>
          <TouchableFloatingActionButton
            isExpanded={isExpanded}
            index={1}
            buttonLetter={'M'}
            onPress={() => { push("ActionTray", {}) }}
          />
          <TouchableFloatingActionButton
            isExpanded={isExpanded}
            index={2}
            buttonLetter={'W'}
            onPress={() => {}}
          />
          <TouchableFloatingActionButton
            isExpanded={isExpanded}
            index={3}
            buttonLetter={'S'}
            onPress={() => {}}
          />
        </View>
      </View>
  );
}

const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#303030',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    color: '#f8f9ff',
  },
});

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: 40,
    zIndex: LEVEL.level3,
    left: DIM.width - 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    width: 34,
    height: 34,
    backgroundColor: '#303030',
    position: 'absolute',
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -2,
    flexDirection: 'row',
  },
  buttonContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  content: {
    color: '#f8f9ff',
    fontWeight: 500,
    fontSize: 9
  },
});
