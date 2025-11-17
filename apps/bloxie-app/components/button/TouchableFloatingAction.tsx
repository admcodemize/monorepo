import { LEVEL } from '@codemize/constants/Styles';
import {  IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChartCandlestick, faChartFft, faGrid2Plus, faPlus, faSliders } from '@fortawesome/duotone-thin-svg-icons';
import { faEllipsisVertical } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
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
import { useThemeColors } from '@/hooks/theme/useThemeColor';

const DIM = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 50;

const TouchableFloatingActionButton = ({ isExpanded, index, onPress, icon }: { 
  isExpanded: SharedValue<boolean>, 
  index: number, 
  onPress: () => void,
  icon: IconProp
}) => {
  const colors = useThemeColors();
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
      <FontAwesomeIcon icon={icon as IconProp} size={16} color={colors.focusedContentColor} />
    </AnimatedPressable>
  );
};

export default function TouchableFloationAction () {
  const isExpanded = useSharedValue(false);

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  };

  const { push } = useTrays('main');

  return (
    <View style={styles.mainContainer}>
        <View style={styles.buttonContainer}>
          <AnimatedPressable
            onPress={handlePress}
            style={[styles.shadow, mainButtonStyles.button]}>
            <FontAwesomeIcon icon={faSliders as IconProp} size={20} color="white" />
          </AnimatedPressable>
          <TouchableFloatingActionButton
            isExpanded={isExpanded}
            index={1}
            icon={faGrid2Plus as IconProp}
            onPress={() => { push("ActionTray", {}) }}
          />
          <TouchableFloatingActionButton
            isExpanded={isExpanded}
            index={2}
            icon={faChartCandlestick as IconProp}
            onPress={() => { push("DashboardTray", {}) }}
          />
        </View>
      </View>
  );
}

const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    height: 44,
    width: 44,
    borderRadius: 22,
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
    width: 40,
    height: 40,
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
