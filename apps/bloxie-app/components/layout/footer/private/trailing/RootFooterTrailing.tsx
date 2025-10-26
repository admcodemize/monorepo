import React from "react";
import { View } from "react-native";
import { useTrays } from "react-native-trays";

import { faEllipsisStrokeVertical, faGrid2Plus, faPlug } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { STYLES } from "@codemize/constants/Styles";

import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";
import Divider from "@/components/container/Divider";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type RootFooterTrailingProps = {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @component */
const RootFooterTrailing = ({

}: RootFooterTrailingProps) => {
  /**
   * @description Handles the opening of the trays which are defined in the @/helpers/Trays.tsx file as screens in the @/screens/private/tray folder
   * @see {@link @/helpers/Trays} */
  const { push } = useTrays('main');

  /**
   * @description Handles the on press event for opening the action tray
   * @function */
  const onPressAction = React.useCallback(() => push("ActionTray", {}), []);

  return (
    <View style={[GlobalContainerStyle.rowCenterCenter, { gap: STYLES.sizeGap }]}>
      <TouchableHapticIcon
        icon={faPlug as IconProp}
        onPress={() => {}} />
      <TouchableHapticIcon
        icon={faGrid2Plus as IconProp}
        onPress={onPressAction} />
      <Divider vertical />
      <TouchableHapticIcon
        icon={faEllipsisStrokeVertical as IconProp}
        onPress={() => {}} />
    </View>
  );
}

export default RootFooterTrailing;