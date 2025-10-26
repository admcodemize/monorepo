import { GestureResponderEvent, View } from "react-native";

import { faBellRing, faTelescope } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { STYLES } from "@codemize/constants/Styles";

import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type RootHeaderTrailingProps = {
  onPressNotification: (e: GestureResponderEvent) => void;
  onPressSearch: (e: GestureResponderEvent) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the root trailing header which handles the overall information about notifications and the 
 * top to bottom search engine
 * @since 0.0.2
 * @version 0.0.1
 * @param {RootHeaderTrailingProps} param0
 * @param {Function} param.onPressNotification - Callback function for the on press event -> Notification
 * @param {Function} param.onPressSearch - Callback function for the on press event -> Search
 * @component */
const RootHeaderTrailing = ({
  onPressNotification,
  onPressSearch,
}: RootHeaderTrailingProps) => {
  return (
    <View style={[GlobalContainerStyle.rowCenterCenter, { gap: STYLES.sizeGap }]}>
      <TouchableHapticIcon
        icon={faBellRing as IconProp}
        hideNotificationBadge={false}
        onPress={onPressNotification} />
      <TouchableHapticIcon
        icon={faTelescope as IconProp}
        onPress={onPressSearch} />
    </View>
  )
}

export default RootHeaderTrailing;