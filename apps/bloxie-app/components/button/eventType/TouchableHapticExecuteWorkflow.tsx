import React from "react";
import { View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPlay } from "@fortawesome/pro-thin-svg-icons";

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
export type TouchableHapticExecuteWorkflowProps = {

};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns 
 * @since 0.0.59
 * @version 0.0.1
 * @component */
const TouchableHapticExecuteWorkflow = ({
}: TouchableHapticExecuteWorkflowProps) => {
  const { infoColor, secondaryBgColor } = useThemeColors();

  const [executeWorkflow, setExecuteWorkflow] = React.useState<boolean>(true);
  React.useEffect(() => {
    console.log("executeWorkflow", executeWorkflow);
  }, [executeWorkflow]);

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: secondaryBgColor,
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faPlay as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={"Ausführung der Workflows"} 
          style={{ color: infoColor }} />
      </View>
      <TouchableHapticSwitch
        state={executeWorkflow}
        onStateChange={setExecuteWorkflow} />
    </View>
  );
};

export default TouchableHapticExecuteWorkflow;