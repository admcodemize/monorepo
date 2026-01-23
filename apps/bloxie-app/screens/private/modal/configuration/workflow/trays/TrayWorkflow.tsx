import React from "react";
import { Dimensions, GestureResponderEvent, View } from "react-native";
import { useTranslation } from "react-i18next";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEllipsisStroke, faEllipsisStrokeVertical, faPause, faPlay, faTrash, faTrashAltSlash } from "@fortawesome/duotone-thin-svg-icons";
import { STYLES } from "@codemize/constants/Styles";
import { ConvexWorkflowQueryAPIProps } from "@codemize/backend/Types";

import { useConfigurationContextStore } from "@/context/ConfigurationContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { resolveRuntimeIcon } from "@/helpers/System";

import TrayHeader from "@/components/container/TrayHeader";
import Divider from "@/components/container/Divider";
import ListItemWithChildren, { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";
import TouchableTag from "@/components/button/TouchableTag";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";
import TrayContainer from "@/components/container/TrayContainer";
import { useDropdown } from "@/hooks/button/useDropdown";
import DropdownOverlay from "@/components/container/DropdownOverlay";
import TouchableHapticText from "@/components/button/TouchableHapticText";
import { useTrays } from "react-native-trays";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.2
 * @type */
export type ScreenTrayWorkflowProps = {
  workflows: ConvexWorkflowQueryAPIProps[];
  onPress: (workflow: ConvexWorkflowQueryAPIProps) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.4
 * @param {ScreenTrayWorkflowProps} param0
 * @component */
const ScreenTrayWorkflow = ({ 
  workflows,
  onPress,
}: ScreenTrayWorkflowProps) => {
  const { errorColor } = useThemeColors();
  const { dismiss } = useTrays('main');

  /** @description Handles the on press event for the workflow */
  const onPressWorkflow = React.useCallback(
    (workflow: ConvexWorkflowQueryAPIProps) => 
    (e: GestureResponderEvent) => {
      onPress(workflow);
      dismiss('TrayWorkflow');
    }, [onPress, dismiss]);

  /** @description Handles the on press event for removing a workflow */
  const onPressRemove = React.useCallback(
    (workflow: ConvexWorkflowQueryAPIProps) => 
    (e: GestureResponderEvent) => {
      console.log("onPressRemove", workflow);
    }, [onPress]);

  /** @description Extracts the key for the list */
  const keyExtractor = (item: ConvexWorkflowQueryAPIProps) => item._id as string;

  /** @description Renders the item for the list */
  const renderItem = ({ item }: LegendListRenderItemProps<ConvexWorkflowQueryAPIProps>) => {
    return (
      <TouchableHaptic 
        onPress={onPressWorkflow(item)}>
        <ListItemWithChildren
          title={item.name}
          description={`Ausführungen: ${312} / Abbrüche: ${4}`}
          type={ListItemWithChildrenTypeEnum.custom}
          //icon={resolveRuntimeIcon(item.process?.icon || "faArrowProgress")}
          right={<View style={[GlobalContainerStyle.rowCenterStart]}>
            <TouchableHapticIcon
              icon={faTrashAltSlash as IconProp}
              iconSize={STYLES.sizeFaIcon + 4}
              iconColor={errorColor}
              hasViewCustomStyle={true}
              onPress={onPressRemove(item)} />
          </View>} />
      </TouchableHaptic>
    )
  };

  return (
    <TrayContainer
      title={"i18n.screens.workflow.builder.workflows.title"} 
      description={"i18n.screens.workflow.builder.workflows.description"}>
        <View style={{ height: workflows.length > 1 ? workflows.length * 38 : 30, maxHeight: 540 }}>
        {workflows.length > 0 && <LegendList
          data={workflows as ConvexWorkflowQueryAPIProps[]}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={Dimensions.get("window").width - 28}
          contentContainerStyle={{ gap: STYLES.sizeGap + 4 }} />}
        </View>
    </TrayContainer>
  );
};

export default ScreenTrayWorkflow;