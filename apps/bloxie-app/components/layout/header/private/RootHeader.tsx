import React from 'react';
import { View } from 'react-native';

import { STYLES } from '@codemize/constants/Styles';

import { useThemeColors } from '@/hooks/theme/useThemeColor';

import Divider from '@/components/container/Divider';
import RootHeaderTrailing from '@/components/layout/header/private/trailing/RootHeaderTrailing';
import RootHeaderLeading from "@/components/layout/header/private/leading/RootHeaderLeading";

import RootHeaderStyle from '@/styles/components/layout/header/private/RootHeader';
import GlobalContainerStyle from '@/styles/GlobalContainer';

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type RootHeaderProps = {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {RootHeaderProps} param0
 * @component */
const RootHeader = ({

}: RootHeaderProps) => {
  /** @description Used to get the theme based colors */
  const colors = useThemeColors();

  return (
    <View style={[GlobalContainerStyle.columnStartCenter, {
      borderBottomWidth: 1,
      borderBottomColor: colors.primaryBorderColor,
      backgroundColor: colors.primaryBgColor
    }]}>
      <View style={[GlobalContainerStyle.rowCenterEnd, RootHeaderStyle.view]}>
        <RootHeaderLeading />
        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: STYLES.sizeGap }]}>
          <Divider vertical />
          <RootHeaderTrailing 
            onPressNotification={() => {}} 
            onPressSearch={() => {}} />
        </View> 
      </View>
      {/* <Calendar /> */}
    </View>
  );
}

export default RootHeader;