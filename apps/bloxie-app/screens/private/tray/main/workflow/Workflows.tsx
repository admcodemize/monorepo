import React from "react";
import { Dimensions, GestureResponderEvent, View } from "react-native";
import { useTranslation } from "react-i18next";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPause, faPlay, faTrash } from "@fortawesome/duotone-thin-svg-icons";
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

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.1
 * @type */
export type ScreenTrayWorkflowsProps = {
  onPress: (workflow: ConvexWorkflowQueryAPIProps) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.2
 * @param {ScreenTrayWorkflowsProps} param0
 * @component */
const ScreenTrayWorkflows = ({ 
  onPress,
}: ScreenTrayWorkflowsProps) => {
  /** @description Used to get the theme based colors */
  const colors = useThemeColors();
  const { t } = useTranslation();

  /** @description Returns all the workflows stored in the context for the currently signed in user */
  const workflows = useConfigurationContextStore((state) => state.workflows);

  /** @description Handles the on press event for the workflow */
  const onPressWorkflow = React.useCallback(
  (workflow: ConvexWorkflowQueryAPIProps) => 
  (e: GestureResponderEvent) => onPress(workflow), [onPress]);

  /** @description Extracts the key for the list */
  const keyExtractor = (item: ConvexWorkflowQueryAPIProps) => item._id as string;

  /** @description Renders the item for the list */
  const renderItem = ({ item }: LegendListRenderItemProps<ConvexWorkflowQueryAPIProps>) => {
    return (
      <TouchableHaptic onPress={onPressWorkflow(item)}>
        <ListItemWithChildren
          title={item.name}
          description={`${t("i18n.screens.trayWorkflows.trigger")}: ${item.start.trigger}`}
          type={ListItemWithChildrenTypeEnum.custom}
          icon={resolveRuntimeIcon(item.icon || "faArrowProgress")}
          right={<View style={[GlobalContainerStyle.rowCenterStart, { gap: 12 }]}>
            <TouchableTag 
              text={item.isActive ? "i18n.global.active" : "i18n.global.inactive"} 
              colorActive={colors.successColor} 
              colorInactive={colors.errorColor} 
              isActive={item.isActive} 
              onPress={() => {}} 
              showActivityIcon={true}
              activityIconActive={faPlay as IconProp}
              activityIconInactive={faPause as IconProp}/>
            <TouchableHapticIcon
              icon={faTrash as IconProp}
              iconSize={STYLES.sizeFaIcon}
              hasViewCustomStyle={true}
              onPress={() => {}} />
          </View>} />
      </TouchableHaptic>
    )
  };

  return (
    <View style={{ 
      padding: STYLES.paddingHorizontal, 
      backgroundColor: colors.primaryBgColor, 
      borderColor: colors.primaryBorderColor,
      height: 300
    }}>
      <View style={{ gap: STYLES.sizeGap }}>
        <TrayHeader
          title={"i18n.screens.trayWorkflows.title"}
          description={"i18n.screens.trayWorkflows.description"} />
        <Divider />
        {workflows.length > 0 && <LegendList
          data={workflows as ConvexWorkflowQueryAPIProps[]}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={Dimensions.get("window").width - 28}
          contentContainerStyle={{ gap: STYLES.sizeGap + 4 }} />}
      </View>
    </View>
  );
};

export default ScreenTrayWorkflows;