import React, { Dispatch, SetStateAction } from "react";
import { GestureResponderEvent, ScrollView, TextInput, View } from "react-native";
import type { EnrichedTextInputInstance } from 'react-native-enriched';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTrays } from "react-native-trays";
import { t } from "i18next";
import { faFileDashedLine, faKeyboardDown, faLanguage, faSquareRootVariable } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../../packages/backend/convex/_generated/api";
import { Id } from "../../../../../../../../packages/backend/convex/_generated/dataModel";

import { shadeColor } from "@codemize/helpers/Colors";
import { ConvexRuntimeAPITemplateVariableProps, ConvexTemplateAPIProps } from "@codemize/backend/Types";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useUserContextStore } from "@/context/UserContext";
import { resolveRuntimeIcon } from "@/helpers/System";
import { EDITOR_STYLE_ITEMS } from "@/constants/Models";

import TextBase from "@/components/typography/Text";
import Divider from "@/components/container/Divider";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";
import TouchableHapticText from "@/components/button/TouchableHapticText";
import ListItemWithChildren, { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";
import ListItemGroup from "@/components/container/ListItemGroup";
import ListWorkflowTemplate from "@/screens/private/modal/configuration/workflow/lists/ListWorkflowTemplate";
import Editor, { createInitialStyleState, EditorStyleState, dehydrateTemplate, hydrateTemplate, insertPatternValue } from "@/components/typography/Editor";
import type { WorkflowNodeItemProps } from "@/components/container/WorkflowCanvas";
import DropdownOverlay from "@/components/container/DropdownOverlay";
import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import TouchableHapticMailAccounts from "@/components/button/workflow/TouchableHapticMailAccounts";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import ActionTemplateStyle from "@/styles/screens/private/tray/modal/workflow/ActionTemplate";

const EDITOR_BASE_HEIGHT = 360;
const TOOLBAR_HEIGHT = 40;
const SUBJECT_HEIGHT = 30;
const ANIMATED_HEIGHT = EDITOR_BASE_HEIGHT - TOOLBAR_HEIGHT - SUBJECT_HEIGHT - 1; // -> 4 => padding, 1 => borderbottom of the subject editor

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.39
 * @version 0.0.1
 * @enum */
export enum FocusedEditorTypeEnum {
  BODY = "body",
  SUBJECT = "subject",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.40
 * @version 0.0.1
 * @enum */
export enum ActionTouchableTypeEnum {
  VARIABLES = "variables",
  TEMPLATES = "templates",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.40
 * @version 0.0.1
 * @type */
export type ActionTouchableType = ActionTouchableTypeEnum.VARIABLES | ActionTouchableTypeEnum.TEMPLATES;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.1
 * @type */
export type ScreenTrayWorkflowActionProps = {
  item: WorkflowNodeItemProps;
  onAfterSave: (item: WorkflowNodeItemProps) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.40
 * @version 0.0.1
 * @type */
export type ScreenTrayWorkflowActionHeaderProps = {
  name: string;
  onPressClose: () => void;
  containerRef: React.RefObject<View|null>;
  mailAccountRef: React.RefObject<View|null>;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.3
 * @param {ScreenTrayWorkflowActionProps} param0
 * @component */
const ScreenTrayWorkflowAction = ({ 
  item,
  onAfterSave
}: ScreenTrayWorkflowActionProps) => {
  const refBody = React.useRef<EnrichedTextInputInstance>(null);
  const refSubject = React.useRef<EnrichedTextInputInstance>(null);
  const refFocused = React.useRef<EnrichedTextInputInstance|null>(null);
  const refIsFocused = React.useRef<boolean>(false);
  const refMailAccount = React.useRef<View|null>(null);
  const refContainer = React.useRef<View|null>(null);

  /** @description Used to get the theme based colors */
  const { secondaryBgColor, primaryBorderColor, infoColor, tertiaryBgColor, primaryBgColor, linkColor } = useThemeColors();
  const { templateVariables } = useUserContextStore((state) => state.runtime);

  const { dismiss } = useTrays('keyboard');

  /** @description Handles the style state of the editor content and the highlighting of the styling buttons */
  const [styleState, setStyleState] = React.useState<EditorStyleState>(createInitialStyleState());

  /** @description Handles to change the focused ref of the editor content which is used for adding the dynamic content and templates */
  const onIsFocused = React.useCallback(
  (type: FocusedEditorTypeEnum) =>
  (isFocused: boolean) => {
    refIsFocused.current = isFocused;
    refFocused.current = type === FocusedEditorTypeEnum.BODY ? refBody.current : refSubject.current
  }, [refBody, refSubject]);

  /** @description Hydrates the subject and body templates with the dynamic subject/content based on the loaded template */
  const htmlSubject = React.useMemo(() => hydrateTemplate(item.subject ?? "", templateVariables), [item.subject, templateVariables]);
  const htmlBody = React.useMemo(() => hydrateTemplate(item.content ?? "", templateVariables), [item.content, templateVariables]);

  /** @description Sets the value of the subject and body editors based on the loaded template */
  React.useEffect(() => refSubject.current?.setValue(htmlSubject), [htmlSubject]);
  React.useEffect(() => refBody.current?.setValue(htmlBody), [htmlBody]);

  /** @description Handles the dynamic height of the variables and templates lists which are not always visible */
  const variablesHeight = useSharedValue(0);
  const templatesHeight = useSharedValue(0);
  const [areVariablesVisible, setAreVariablesVisible] = React.useState(false);
  const [areTemplatesVisible, setAreTemplatesVisible] = React.useState(false);

  React.useEffect(() => {
    variablesHeight.value = withTiming(areVariablesVisible ? ANIMATED_HEIGHT : 0, { duration: 220 });
  }, [areVariablesVisible, variablesHeight]);

  React.useEffect(() => {
    templatesHeight.value = withTiming(areTemplatesVisible ? ANIMATED_HEIGHT : 0, { duration: 220 });
  }, [areTemplatesVisible, templatesHeight]);

  const editorAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      height: EDITOR_BASE_HEIGHT, // => 360
    };
  });

  /** @description Handles the animated style of the variables list */
  const animatedStyleVariables = useAnimatedStyle(() => {
    'worklet';
    return ({ height: variablesHeight.value, opacity: variablesHeight.value === 0 ? 0 : 1 })
  });

  const animatedStyleTemplates = useAnimatedStyle(() => {
    'worklet';
    return ({ height: templatesHeight.value, opacity: templatesHeight.value === 0 ? 0 : 1 })
  });

  /** @description Handles the toggle visibility of the variables and templates lists */
  const toggleVisibility = React.useCallback((stateFunction: Dispatch<SetStateAction<boolean>>) => {
    stateFunction((prev) => !prev);
  }, []);

  const toggleList = React.useCallback((type: "variables" | "templates") => {
    if (type === "variables") toggleVisibility(setAreVariablesVisible);
    else toggleVisibility(setAreTemplatesVisible);
  }, [toggleVisibility]);

  /** @description Handles the save action of the customized template */
  const onPressSafe = React.useCallback(async () => {
    const [subjectHtml, bodyHtml] = await Promise.all([
      refSubject.current?.getHTML?.(),
      refBody.current?.getHTML?.(),
    ]);

    onAfterSave({
      ...item,
      subject: dehydrateTemplate(subjectHtml ?? ""),
      content: dehydrateTemplate(bodyHtml ?? ""),
    });
  }, [item, onAfterSave, refSubject, refBody]);

  /** 
   * @description Handles the close action of the tray
   * -> Closes first the keyboard (when focused) and then the tray */
  const onPressCloseInternal = React.useCallback(() => {
    refBody.current?.blur();
    setTimeout(() => {
      dismiss('TrayWorkflowAction');
    }, refIsFocused.current ? 220 * 1.5 : 0);
  }, [dismiss, refIsFocused]);

  /** 
   * @description Handles the press event of the variable
   * -> Inserts the variable into the editor and toggles the variables list */
  const onPressVariable = React.useCallback(
    (variable: ConvexRuntimeAPITemplateVariableProps) => 
    (e: GestureResponderEvent) => {
      insertPatternValue(refFocused, variable.pattern);
      toggleList(ActionTouchableTypeEnum.VARIABLES);
  }, [refFocused, toggleList, insertPatternValue]);

  /** 
   * @description Handles the press event of the template
   * -> Inserts the template into the editor and toggles the templates list */
  const onPressTemplate = React.useCallback(
    (template: ConvexTemplateAPIProps) => {
      console.log("onPressTemplate", template);
      refBody.current?.setValue(hydrateTemplate(template.content || "", templateVariables));
      toggleList(ActionTouchableTypeEnum.TEMPLATES);
    }, [refBody, templateVariables, hydrateTemplate, toggleList]);

  /** @description Renders the dynamic variables component list */
  const RenderVariables = React.memo(() => {
    return (
      <Animated.View
        pointerEvents={areVariablesVisible ? "auto" : "none"}
        style={[ActionTemplateStyle.animatedContainer, animatedStyleVariables, {
          bottom: TOOLBAR_HEIGHT, // => 40
        }]}>
        <View style={[ActionTemplateStyle.animatedDynamic, { 
          gap: 4, height: ANIMATED_HEIGHT, 
          backgroundColor: shadeColor(secondaryBgColor, 0.3),
          borderTopColor: primaryBorderColor, 
          borderBottomColor: primaryBorderColor 
        }]}>
          <ListItemGroup 
            title={t("i18n.global.variables")}
            gap={STYLES.sizeGap}
            style={{ paddingVertical: 10 }} />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ maxHeight: ANIMATED_HEIGHT - TOOLBAR_HEIGHT - 10 }}>
          {templateVariables.map((variable) => (
            <TouchableHaptic 
              key={variable.pattern}
              onPress={onPressVariable(variable)}>
              <ListItemWithChildren
                title={variable.name}
                description={"Keine aktive Verwendung"}
                type={ListItemWithChildrenTypeEnum.custom}
                right={<TextBase text={`{{${variable.pattern}}}`} type="label" />}
                icon={resolveRuntimeIcon(variable.icon || "") as IconProp}
                iconSize={16} />
            </TouchableHaptic>
          ))}
          </ScrollView>
        </View>
      </Animated.View>
    )
  });

  /** @description Renders the templates component */
  const RenderTemplates = React.memo(() => {
    return (
      <Animated.View
        pointerEvents={areTemplatesVisible ? "auto" : "none"}
        style={[ActionTemplateStyle.animatedContainer, animatedStyleTemplates, {
          bottom: TOOLBAR_HEIGHT, // => 40
        }]}>
        <View style={[ActionTemplateStyle.animatedDynamic, { 
          gap: 4, height: ANIMATED_HEIGHT, 
          backgroundColor: shadeColor(secondaryBgColor, 0.3),
          borderTopColor: primaryBorderColor, 
          borderBottomColor: primaryBorderColor 
        }]}>
          <ListWorkflowTemplate
            maxHeight={ANIMATED_HEIGHT - TOOLBAR_HEIGHT - 10}
            showWithoutTemplateOption={false}
            onPress={onPressTemplate} />
        </View>
      </Animated.View>
    )
  });

  /** @description Renders the action touchable component such as variables and templates */
  const RenderActionTouchable = React.memo(({ type }: { type: ActionTouchableType }) => {
    return (
      <TouchableHapticDropdown
        text={t(`i18n.global.${type}`)}
        icon={type === ActionTouchableTypeEnum.VARIABLES ? faSquareRootVariable as IconProp : faFileDashedLine as IconProp}
        type="label"
        hasViewCustomStyle={true}
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 6 }}
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        onPress={() => toggleList(type)} />
    )
  });

  return (
    <View
      ref={refContainer}
      style={{ 
      backgroundColor: primaryBgColor, 
      borderColor: primaryBorderColor,
    }}>
      <View style={{ gap: STYLES.sizeGap }}>
        <View style={[ActionTemplateStyle.view, { backgroundColor: shadeColor(secondaryBgColor, 0.3) }]}>
           <ScreenTrayWorkflowActionHeader
             name={item.name}
             onPressClose={onPressCloseInternal}
             containerRef={refContainer}
             mailAccountRef={refMailAccount}
           />
          <View style={[ActionTemplateStyle.containerEditor, {
            borderColor: primaryBorderColor,
            backgroundColor: shadeColor(tertiaryBgColor, 0.8), 
            height: EDITOR_BASE_HEIGHT, // => 360
            paddingBottom: TOOLBAR_HEIGHT,
          }]}>
            <Animated.View style={[ActionTemplateStyle.editor, editorAnimatedStyle]}>
              <Editor
                ref={refSubject}
                placeholder={t("i18n.global.subject")}
                defaultValue={htmlSubject}
                maxHeight={SUBJECT_HEIGHT - 4}
                primaryTextColor={"#000"}
                showBorderBottom={true}
                onIsFocused={onIsFocused(FocusedEditorTypeEnum.SUBJECT)}
                onStyleStateChange={setStyleState} />
              <Editor
                ref={refBody}
                defaultValue={htmlBody}
                maxHeight={EDITOR_BASE_HEIGHT - TOOLBAR_HEIGHT - SUBJECT_HEIGHT}
                onIsFocused={onIsFocused(FocusedEditorTypeEnum.BODY)}
                onStyleStateChange={setStyleState} />
            </Animated.View>
            <RenderVariables />
            <RenderTemplates />
            <View style={[GlobalContainerStyle.rowCenterEnd, ActionTemplateStyle.actions,{ height: TOOLBAR_HEIGHT }]}>
              <TouchableHapticDropdown
                text="DE"
                icon={faLanguage as IconProp}
                type="label"
                hasViewCustomStyle={true}
                viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 6 }}
                textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
                onPress={() => { }} />
              <RenderActionTouchable type={ActionTouchableTypeEnum.TEMPLATES} />
              <RenderActionTouchable type={ActionTouchableTypeEnum.VARIABLES} />
            </View>
          </View>

          <View style={[GlobalContainerStyle.rowCenterBetween, { 
            height: TOOLBAR_HEIGHT, 
            paddingRight: 12 
          }]}>
            <View style={[GlobalContainerStyle.rowCenterCenter, ActionTemplateStyle.footer]}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                {EDITOR_STYLE_ITEMS.map((item, idx) => {
                  const isActive = styleState[item.state as keyof typeof styleState];
                  const toggleFn = refBody.current?.[item.functionAsString as keyof EnrichedTextInputInstance] as (() => void)|undefined;
                  return (
                    <TouchableHapticIcon
                      key={item.key}
                      icon={item.icon as IconProp}
                      iconSize={14}
                      iconColor={isActive ? "#fff" : shadeColor(infoColor, 0.3)}
                      hasViewCustomStyle={true}
                      viewCustomStyle={{ 
                        backgroundColor: isActive 
                          ? idx % 2 == 0 ? shadeColor(infoColor, 0.5) : infoColor
                          : "transparent", 
                        padding: 6, 
                        borderRadius: 6 
                      }}
                      onPress={() => toggleFn?.()} />
                  );
                })}

              </View>
              <Divider vertical style={{ height: 14 }} />
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 14 }]}>
                <TouchableHapticIcon
                  icon={faKeyboardDown as IconProp}
                  iconSize={16}
                  hasViewCustomStyle={true}
                  onPress={() => { refBody.current?.blur() }} />
              </View>
            </View>
            <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 14 }]}>
              <TouchableHapticText
                text={t("i18n.buttons.save")}
                hasViewCustomStyle={true}
                viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
                textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle), color: linkColor }}
                onPress={onPressSafe} />
            </View>
          </View>
        </View>
      </View>
      <DropdownOverlay hostId="tray" />
    </View>
  );
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.40
 * @version 0.0.3
 * @param {ScreenTrayWorkflowActionHeaderProps} param0
 * @param {string} param0.name - The name of the action template which is chosen by the user for the workflow action template
 * @param {() => void} param0.onPressClose - The function to call when the close button is pressed on the top right corner
 * @param {React.RefObject<View|null>} param0.containerRef - The reference to the container view for displaying the dropdown
 * @component */
const ScreenTrayWorkflowActionHeader = ({
  name,
  onPressClose,
  containerRef,
}: ScreenTrayWorkflowActionHeaderProps) => {
  const { infoColor } = useThemeColors();
  const ref = React.useRef<View>(null);

  const settings = useUserContextStore((state) => state.settings);

  /**
   * @description Get the mutation function for updating a settings property such as the default mail account
   * @see {@link backend/convex/sync/settings/mutation} */
  const updateSettingsProperty = useMutation(api.sync.settings.mutation.updateSettingsProperty);

  /** 
   * @description Handles the press event of the mail account
   * -> Updates the default mail account of the user's settings in the database
   * @param {ListItemDropdownProps} item - The item to press which is the mail account to set as default
   * @function */
  const onPress = React.useCallback(
    async (item: ListItemDropdownProps) => {
      console.log("onPress", item);
      await updateSettingsProperty({ 
        _id: settings._id as Id<"settings">, 
        property: "defaultMailAccount", 
        value: item.itemKey
      });
    }, [updateSettingsProperty, settings._id]);

  return (
    <View 
      ref={ref}
      style={[GlobalContainerStyle.rowCenterBetween, ActionTemplateStyle.header, { 
        gap: STYLES.sizeGap, 
        flex: 1 
    }]}>
      <TextInput
        value={name}
        editable={false}
        placeholder="Name der Aktion"
        numberOfLines={1}
        style={{
          color: infoColor,
          fontSize: Number(SIZES.label),
          fontFamily: String(FAMILIY.subtitle),
          flexGrow: 1,
          flexShrink: 1,
        }}/>
      <TouchableHapticMailAccounts 
        refContainer={containerRef} 
        onPress={onPress} 
        onPressClose={onPressClose} />
    </View>
  );
}

export default ScreenTrayWorkflowAction;  