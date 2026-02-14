import React from "react";
import { View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faUserCheck } from "@fortawesome/pro-thin-svg-icons";

import { STYLES } from "@codemize/constants/Styles";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import TouchableHapticSwitch from "../TouchableHapticSwitch";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.59
 * @version 0.0.1
 * @type */
export type TouchableHapticInviteGuestsProps = {

};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns 
 * @since 0.0.59
 * @version 0.0.1
 * @component */
const TouchableHapticInviteGuests = ({
}: TouchableHapticInviteGuestsProps) => {
  const { infoColor, secondaryBgColor } = useThemeColors();

  const [inviteGuests, setInviteGuests] = React.useState<boolean>(false);
  React.useEffect(() => {
    console.log("inviteGuests", inviteGuests);
  }, [inviteGuests]);

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: secondaryBgColor,
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faUserCheck as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={"Erlaube den Teilnehmern, Gäste einzuladen"} 
          style={{ color: infoColor }} />
      </View>
      <TouchableHapticSwitch
        state={inviteGuests}
        onStateChange={setInviteGuests} />
    </View>
  );
};

export default TouchableHapticInviteGuests;