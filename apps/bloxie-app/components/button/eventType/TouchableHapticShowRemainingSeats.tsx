import React from "react";
import { View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEyeSlash } from "@fortawesome/duotone-thin-svg-icons";

import { STYLES } from "@codemize/constants/Styles";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import TouchableHapticSwitch from "../TouchableHapticSwitch";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.1
 * @type */
export type TouchableHapticShowRemainingSeatsProps = {

};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns 
 * @since 0.0.58
 * @version 0.0.1
 * @component */
const TouchableHapticShowRemainingSeats = ({
}: TouchableHapticShowRemainingSeatsProps) => {
  const { secondaryBgColor, infoColor } = useThemeColors();

  const [showRemainingSeats, setShowRemainingSeats] = React.useState<boolean>(true);
  React.useEffect(() => {
    console.log("showRemainingSeats", showRemainingSeats);
  }, [showRemainingSeats]);

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: secondaryBgColor,
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faEyeSlash as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={"Anzeigen der verbleibenden Plätze"} 
          style={{ color: infoColor }} />
      </View>
      <TouchableHapticSwitch
        state={showRemainingSeats}
        onStateChange={setShowRemainingSeats} />
    </View>
  );
};

export default TouchableHapticShowRemainingSeats;