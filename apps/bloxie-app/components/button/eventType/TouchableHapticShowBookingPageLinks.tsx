import React from "react";
import { View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEyeSlash } from "@fortawesome/duotone-thin-svg-icons";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";

import { STYLES } from "@codemize/constants/Styles";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import TouchableHapticSwitch from "../TouchableHapticSwitch";
import TouchableHaptic from "../TouchableHaptic";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.1
 * @type */
export type TouchableHapticShowBookingPageLinksProps = {

};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns 
 * @since 0.0.58
 * @version 0.0.1
 * @component */
const TouchableHapticShowBookingPageLinks = ({
}: TouchableHapticShowBookingPageLinksProps) => {
  const { secondaryBgColor, infoColor, linkColor } = useThemeColors();

  const [showBookingPageLinks, setShowBookingPageLinks] = React.useState<boolean>(true);
  React.useEffect(() => {
    console.log("showBookingPageLinks", showBookingPageLinks);
  }, [showBookingPageLinks]);

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        //backgroundColor: secondaryBgColor,
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faEyeSlash as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={"Anzeige der Links auf der Buchungsseite"} 
          style={{ color: infoColor }} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
        <TouchableHapticSwitch
          state={showBookingPageLinks}
          onStateChange={setShowBookingPageLinks} />
        <TouchableHaptic>
          <FontAwesomeIcon
            icon={faPlus as IconProp}
            size={STYLES.sizeFaIcon}
            color={linkColor} />
        </TouchableHaptic>
      </View>
    </View>
  );
};

export default TouchableHapticShowBookingPageLinks;