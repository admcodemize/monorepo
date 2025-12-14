import React from 'react';
import { View } from 'react-native';
import { useTrays } from 'react-native-trays';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartCandlestick, faGrid2Plus } from '@fortawesome/duotone-thin-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { useThemeColors } from '@/hooks/theme/useThemeColor';

import TouchableHaptic from '@/components/button/TouchableHaptic';

import RootFooterStyle from '@/styles/components/layout/footer/private/RootFooter';
import GlobalContainerStyle from '@/styles/GlobalContainer';

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
 * @param {RootHeaderProps} param0
 * @component */
const RootFooter = ({
}: RootFooterProps) => {
  /** @description Used to get the theme based colors */
  const colors = useThemeColors();

  const { push } = useTrays('main');

  /** @description Handles the on press event for the action tray */
  const onPressAction = () => push("ActionTray", {});

  /** @description Handles the on press event for the dashboard tray */
  const onPressDashboard = () => push("DashboardTray", {});
  
  return (
    <View style={[RootFooterStyle.view, {
      borderBottomColor: colors.primaryBorderColor,
    }]}>
      <View style={[GlobalContainerStyle.rowCenterEnd, RootFooterStyle.content]}>
      <TouchableHaptic
          onPress={onPressDashboard}>
            <FontAwesomeIcon icon={faChartCandlestick as IconProp} size={22} color={colors.tertiaryIconColor} />
        </TouchableHaptic>
        <TouchableHaptic
          onPress={onPressAction}>
            <FontAwesomeIcon icon={faGrid2Plus as IconProp} size={22} color={colors.tertiaryIconColor} />
        </TouchableHaptic>
      </View>
    </View>
  );
}

export default RootFooter;