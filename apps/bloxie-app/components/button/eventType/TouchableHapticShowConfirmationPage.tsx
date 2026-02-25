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
 * @version 0.0.2
 * @type */
export type TouchableHapticShowConfirmationPageProps = {
  onChangeState: (state: boolean) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.2
 * @component */
const TouchableHapticShowConfirmationPage = ({
  onChangeState,
}: TouchableHapticShowConfirmationPageProps) => {
  const { infoColor } = useThemeColors();

  const [showConfirmationPage, setShowConfirmationPage] = React.useState<boolean>(true);
  React.useEffect(() => onChangeState(showConfirmationPage), [showConfirmationPage]);

  return (
    <View style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faEyeSlash as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={"Anzeige der Bestätigungsseite"} 
          style={{ color: infoColor }} />
      </View>
      <TouchableHapticSwitch
        state={showConfirmationPage}
        onStateChange={setShowConfirmationPage} />
    </View>
  );
};

export default TouchableHapticShowConfirmationPage;