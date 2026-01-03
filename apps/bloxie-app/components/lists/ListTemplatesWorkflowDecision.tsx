import React from "react";
import { DimensionValue, GestureResponderEvent, ScrollView, View } from "react-native";

import { getLocalization, LanguageEnumProps, resolveRuntimeIcon } from "@/helpers/System";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useConfigurationContextStore } from "@/context/ConfigurationContext";
import { STYLES } from "@codemize/constants/Styles";
import { ConvexTemplateAPIProps } from "@codemize/backend/Types";

import ListItemGroup from "@/components/container/ListItemGroup";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import ListItemWithChildren, { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";
import TextBase from "../typography/Text";
import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @component */
export type ListTemplatesWorkflowDecisionProps = {
  maxHeight?: DimensionValue;
  showListGroup?: boolean;
  onPress: (template: ConvexTemplateAPIProps) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.2
 * @param {ListTemplatesWorkflowDecisionProps} param0
 * @param {DimensionValue} param0.maxHeight - The maximum height of the scroll view
 * @param {(template: ConvexTemplateAPIProps) => void} param0.onPress - The function to call when a template is pressed
 * @component */
const ListTemplatesWorkflowDecision = ({
  maxHeight = "100%",
  showListGroup = true,
  onPress,
}: ListTemplatesWorkflowDecisionProps) => {
  /** @description Returns all the workflow decisions stored in the context for the currently signed in user */
  const templates = useConfigurationContextStore((state) => state.templates).filter((template) => template.isGlobal);
  const memoizedTemplates = React.useMemo(() => templates.filter((template) => template.isGlobal), [templates]);
  
  /** @description Internal function to call the onPress function */
  const onPressInternal = React.useCallback(
    (template: ConvexTemplateAPIProps) => 
    (e: GestureResponderEvent) => onPress(template), [onPress]);

  return (
    <>
    {showListGroup && <ListItemGroup
      title={"i18n.lists.templatesWorkflowDecision.title"}
      gap={STYLES.sizeGap}
      style={{ paddingVertical: 10 }} />}
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
      style={{ maxHeight }}>
      {/*memoizedTemplates.map((template) => (
        <TouchableHaptic 
          key={template._id}
          onPress={onPressInternal(template)}>
          <ListItemWithChildren
            title={template.name || ""}
            description={template.description || ""}
            type={ListItemWithChildrenTypeEnum.navigation}
            icon={resolveRuntimeIcon(template.icon || "faFileDashedLine")} />
        </TouchableHaptic>
      ))*/}
    </ScrollView>
    </>
  );
};

export default ListTemplatesWorkflowDecision;