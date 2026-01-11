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
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.2
 * @component */
export type ListWorkflowTemplateProps = {
  maxHeight?: DimensionValue;
  showListGroup?: boolean;
  showWithoutTemplateOption?: boolean;
  onPress: (template: ConvexTemplateAPIProps) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.3
 * @param {ListWorkflowTemplateProps} param0
 * @param {DimensionValue} param0.maxHeight - The maximum height of the scroll view
 * @param {boolean} param0.showListGroup - Whether to show the list group
 * @param {boolean} param0.showWithoutTemplateOption - Whether to show the option to continue without a template
 * @param {(template: ConvexTemplateAPIProps) => void} param0.onPress - The function to call when a template is pressed
 * @component */
const ListWorkflowTemplate = ({
  maxHeight = "100%",
  showListGroup = true,
  showWithoutTemplateOption = true,
  onPress,
}: ListWorkflowTemplateProps) => {
  const { linkColor } = useThemeColors();
  /** @description Returns all the workflows templates stored in the context for the currently signed in user */
  const templates = useConfigurationContextStore((state) => state.templates).filter((template) => template.isGlobal);
  const memoizedTemplates = React.useMemo(() => templates.filter((template) => template.isGlobal), [templates]);
  
  /** @description Internal function to call the onPress function */
  const onPressInternal = React.useCallback(
    (template: ConvexTemplateAPIProps) => 
    (e: GestureResponderEvent) => onPress(template), [onPress]);

  return (
    <>
    {showListGroup && <ListItemGroup
      title="i18n.screens.workflow.builder.action.templates.title"
      gap={STYLES.sizeGap}
      style={{ paddingVertical: 10 }} />}
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: STYLES.sizeGap * 1.5 }}
      style={{ maxHeight }}>
      {memoizedTemplates.map((template) => (
        <TouchableHaptic 
          key={template._id}
          onPress={onPressInternal(template)}>
          <ListItemWithChildren
            title={template.name || ""}
            description={template.description || ""}
            type={ListItemWithChildrenTypeEnum.custom}
            icon={resolveRuntimeIcon(template.icon || "faFileDashedLine")} />
        </TouchableHaptic>
      ))}
    </ScrollView>
    {showWithoutTemplateOption && <View style={[GlobalContainerStyle.rowCenterStart, { 
      paddingTop: STYLES.paddingVertical + 4, 
      paddingVertical: STYLES.paddingVertical - 4
     }]}>
      <View />
      <TouchableHaptic onPress={onPressInternal({ 
        icon: "faCodeCommit",
        type: "workflow", 
        language: getLocalization().code as LanguageEnumProps 
      })}>
        <TextBase 
          text="i18n.screens.workflow.builder.action.templates.withoutTemplate"
          type="label" 
          color={linkColor} />
      </TouchableHaptic>
    </View>}
    </>
  );
};

export default ListWorkflowTemplate;