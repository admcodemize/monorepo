import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTrays } from "react-native-trays";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faDiagramProject, faFlagCheckered, faFloppyDisk, faLayerPlus, faObjectExclude } from "@fortawesome/duotone-thin-svg-icons";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { shadeColor } from "@codemize/helpers/Colors";

import TouchableHaptic from "@/components/button/TouchableHaptic";
import Divider from "@/components/container/Divider";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import WorkflowFooterStyle from "@/styles/components/layout/footer/private/WorkflowFooter";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.32
 * @version 0.0.2
 * @type */
type WorkflowFooterProps = {
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.32
 * @version 0.0.3
 * @component */
const WorkflowFooter = ({
}: WorkflowFooterProps) => {
  const { bottom } = useSafeAreaInsets();
  const { primaryBgColor, primaryBorderColor, secondaryBgColor, linkColor } = useThemeColors();
  const { push } = useTrays('main');

  /** @description Handles the on press event for the workflows tray */
  const onPressWorkflows = () => push("WorkflowListTray", { onPress: () => {
    console.log("onPressWorkflows");
  } });

  return (
    <Animated.View style={[WorkflowFooterStyle.floating, {
      bottom: bottom + 4, // -> The additional 4 is to compensate for the margin between keyboard and tray @see stackConfigs
    }]}>
      <Animated.View
        style={[WorkflowFooterStyle.bubble, {
          backgroundColor: primaryBgColor,
          borderColor: primaryBorderColor,
        }]}>
        <View style={[GlobalContainerStyle.rowCenterBetween, WorkflowFooterStyle.view]}>
          <View
            style={[GlobalContainerStyle.rowCenterBetween, WorkflowFooterStyle.left, {
              backgroundColor: shadeColor(secondaryBgColor, 0.2),
            }]}>
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 16 }]}>
              <TouchableHapticDropdown
                icon={faDiagramProject as IconProp}
                text="Workflows"
                type="label"
                hasViewCustomStyle={true}
                viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
                onPress={onPressWorkflows} />
            </View>
          </View>
          <TouchableHaptic onPress={() => { console.log("Dashboard"); }}>
            <FontAwesomeIcon icon={faFloppyDisk as IconProp} size={22} color={linkColor} />
          </TouchableHaptic>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export default WorkflowFooter;