import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { STYLES } from '@codemize/constants/Styles';

import { ROUTES_FOOTER_HEADER } from '@/constants/Routes';
import { useThemeColors } from '@/hooks/theme/useThemeColor';

import TouchableHaptic from '@/components/button/TouchableHaptic';
import Divider from '@/components/container/Divider';
import RootFooter from '@/components/layout/footer/private/RootFooter';
import TextBase from '@/components/typography/Text';
import ScreenTabsStyle from '@/styles/components/layout/ScreenTabs';
import GlobalContainerStyle from '@/styles/GlobalContainer';
import React from 'react';

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.6
 * @version 0.0.2
 * @param {BottomTabBarProps} param0
 * @param {BottomTabBarProps['state']} param0.state - The state of the tab bar
 * @param {BottomTabBarProps['descriptors']} param0.descriptors - The descriptors of the tab bar
 * @param {BottomTabBarProps['navigation']} param0.navigation - The navigation object
 * @component */
const ScreenTabs = ({ 
  state, 
  descriptors, 
  navigation
}: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets();

  const colors = useThemeColors();

  return (
    <View style={[GlobalContainerStyle.rowCenterBetween, ScreenTabsStyle.view, {
      backgroundColor: colors.primaryBgColor,
      borderColor: colors.primaryBorderColor,
      paddingBottom: bottom - 10,
      height: STYLES.layoutFooterHeight + (bottom)
    }]}>
    <View style={[GlobalContainerStyle.rowCenterStart, ScreenTabsStyle.content]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        React.useEffect(() => {
          console.log("route changed", state.routes[state.index]);
        }, [state.index]);

        /**
         * @description Returns the actual route object for further usage during the rendering process
         * @function */
        const routes = ROUTES_FOOTER_HEADER.find(({ name }) => name === route.name);

        /**
         * @description Handles the on press event for the tab bar
         * @function */
        const onPress = () => {
          (!isFocused) && navigation.navigate(route.name, route.params);
        };

        return (
          <TouchableHaptic
            key={index}
            onPress={onPress}
            style={[GlobalContainerStyle.rowCenterCenter, ScreenTabsStyle.haptic, {  
              backgroundColor: isFocused ? colors.focusedBgColor : colors.secondaryBgColor,
              borderColor: colors.primaryBorderColor,
              borderWidth: isFocused ? 0 : 1,
              width: isFocused ? "auto" : STYLES.sizeTouchable,
            }]}>
              <View style={[GlobalContainerStyle.rowCenterCenter, ScreenTabsStyle.iconText]}>
              <FontAwesomeIcon
                icon={isFocused ? routes?.iconSolid as IconProp : routes?.iconDuotone as IconProp}
                size={STYLES.sizeFaIcon}
                color={isFocused ? colors.focusedContentColor : colors.textColor}
              />
              {isFocused && <TextBase 
                text={String(routes?.title)} 
                style={{ color: isFocused ? colors.focusedContentColor : colors.textColor }} />}
            </View>
          </TouchableHaptic>
        );
      })}
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter]}>
        <Divider vertical />
        <RootFooter />
      </View>
    </View>
  );
}

export default ScreenTabs;