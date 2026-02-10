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
export type TouchableHapticShowBookingPageProps = {

};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns 
 * @since 0.0.58
 * @version 0.0.1
 * @component */
const TouchableHapticShowBookingPage = ({
}: TouchableHapticShowBookingPageProps) => {
  const { secondaryBgColor, infoColor } = useThemeColors();

  const [showBookingPage, setShowBookingPage] = React.useState<boolean>(true);
  React.useEffect(() => {
    console.log("showBookingPage", showBookingPage);
  }, [showBookingPage]);

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
          text={"Sichtbar auf der Buchungsseite"} 
          style={{ color: infoColor }} />
      </View>
      <TouchableHapticSwitch
        state={showBookingPage}
        onStateChange={setShowBookingPage} />
    </View>
  );
};

export default TouchableHapticShowBookingPage;