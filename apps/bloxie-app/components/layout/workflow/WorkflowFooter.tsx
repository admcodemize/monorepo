import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTrays } from "react-native-trays";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowProgress, faFlagCheckered, faObjectExclude } from "@fortawesome/duotone-thin-svg-icons";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { shadeColor } from "@codemize/helpers/Colors";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";

import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import WorkflowFooterStyle from "@/styles/components/layout/footer/private/WorkflowFooter";
import { useConfigurationContextStore } from "@/context/ConfigurationContext";
import TouchableHapticText from "@/components/button/TouchableHapticText";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { STYLES } from "@codemize/constants/Styles";
import Divider from "@/components/container/Divider";
import { ConvexWorkflowQueryAPIProps } from "@codemize/backend/Types";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.32
 * @version 0.0.2
 * @type */
type WorkflowFooterProps = {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.32
 * @version 0.0.4
 * @component */
const WorkflowFooter = ({
}: WorkflowFooterProps) => {
  const { bottom } = useSafeAreaInsets();
  const { primaryBgColor, primaryBorderColor, secondaryBgColor, linkColor } = useThemeColors();
  const { push } = useTrays('main');
  
  /** 
   * @description Returns all the workflows stored in the context for the currently signed in user
   * @see {@link context/ConfigurationContext} */
  const workflows = useConfigurationContextStore((state) => state.workflows);
  const selectedWorkflow = useConfigurationContextStore((state) => state.selectedWorkflow);
  const setSelectedWorkflow = useConfigurationContextStore((state) => state.setSelectedWorkflow);

  /** @description Handles the on press event for the workflows tray */
  const onPressWorkflows = () => push("TrayWorkflow", { workflows: workflows, onPress: (workflow: ConvexWorkflowQueryAPIProps) => {
    setSelectedWorkflow(workflow);
  } });

  const onPressSave = () => {
    console.log("selectedWorkflow", selectedWorkflow);
    console.log(selectedWorkflow?.process?.items);
  }

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
                icon={faArrowProgress as IconProp}
                text="i18n.screens.workflow.builder.workflows.title"
                type="label"
                disabled={workflows.length === 0}
                hasViewCustomStyle={true}
                viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
                onPress={onPressWorkflows} />
            </View>
          </View>
          <TouchableHapticText
            text="i18n.buttons.save"
            textCustomStyle={{ color: linkColor, fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
            hasViewCustomStyle={true}
            viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
            onPress={onPressSave} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export default WorkflowFooter;