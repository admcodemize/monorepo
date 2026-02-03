import React from "react";
import { TextInput, View } from "react-native";
import type { EnrichedTextInputInstance } from 'react-native-enriched';
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTrays } from "react-native-trays";
import { t } from "i18next";
import { faKeyboardDown, faLanguage, faXmark } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { shadeColor } from "@codemize/helpers/Colors";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useUserContextStore } from "@/context/UserContext";
import { EDITOR_STYLE_ITEMS } from "@/constants/Models";

import Divider from "@/components/container/Divider";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";
import TouchableHapticText from "@/components/button/TouchableHapticText";
import Editor, { createInitialStyleState, EditorStyleState } from "@/components/typography/Editor";
import DropdownOverlay from "@/components/container/DropdownOverlay";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import ActionTemplateStyle from "@/styles/screens/private/tray/modal/workflow/ActionTemplate";

const EDITOR_BASE_HEIGHT = 360;
const TOOLBAR_HEIGHT = 40;
const SUBJECT_HEIGHT = 0;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.1
 * @enum */
export enum FocusedEditorTypeEnum {
  BODY = "body",
  SUBJECT = "subject",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.1
 * @enum */
export enum ActionTouchableTypeEnum {
  VARIABLES = "variables",
  TEMPLATES = "templates",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.1
 * @type */
export type ActionTouchableType = ActionTouchableTypeEnum.VARIABLES | ActionTouchableTypeEnum.TEMPLATES;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.1
 * @type */
export type ScreenTrayWorkflowCancellationTermsProps = {
  onAfterSave: () => void;
  onPressClose: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.1
 * @type */
export type ScreenTrayWorkflowCancellationTermsHeaderProps = {
  name: string;
  onPressClose: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.1
 * @param {ScreenTrayWorkflowCancellationTermsProps} param0
 * @component */
const ScreenTrayWorkflowCancellationTerms = ({ 
  onAfterSave,
  onPressClose = () => {}
}: ScreenTrayWorkflowCancellationTermsProps) => {
  const refBody = React.useRef<EnrichedTextInputInstance>(null);
  const refFocused = React.useRef<EnrichedTextInputInstance|null>(null);
  const refIsFocused = React.useRef<boolean>(false);
  const refContainer = React.useRef<View|null>(null);
  const { dismiss } = useTrays('keyboard');

  /** @description Used to get the theme based colors */
  const { secondaryBgColor, primaryBorderColor, infoColor, tertiaryBgColor, primaryBgColor, linkColor } = useThemeColors();
  const { templateVariables } = useUserContextStore((state) => state.runtime);

  /** @description Handles the style state of the editor content and the highlighting of the styling buttons */
  const [styleState, setStyleState] = React.useState<EditorStyleState>(createInitialStyleState());

  /** @description Handles to change the focused ref of the editor content which is used for adding the dynamic content and templates */
  const onIsFocused = React.useCallback(
  (type: FocusedEditorTypeEnum) =>
  (isFocused: boolean) => {
    refIsFocused.current = isFocused;
    refFocused.current = refBody.current;
  }, [refBody]);

  /** 
   * @description Handles the close action of the tray
   * -> Closes first the keyboard (when focused) and then the tray */
  const onPressCloseInternal = React.useCallback(() => {
    refBody.current?.blur();
    setTimeout(() => {
      dismiss('TrayWorkflowCancellationTerms');
      onPressClose();
    }, refIsFocused.current ? 220 * 1.5 : 0);
  }, [dismiss, refIsFocused, onPressClose]);

  /** @description Hydrates the subject and body templates with the dynamic subject/content based on the loaded template */
  const htmlBody = React.useMemo(() => `
  <html>
  <p><b>Stornierungsbedingungen:</b></p>
  <p>Eine kostenfreie Stornierung oder Umbuchung ist bis <b><i>[z. B. 24/48 Stunden]</i></b> vor dem geplanten Termin möglich.</p></br>
  <p>Bei Stornierungen nach diesem Zeitpunkt oder bei Nichterscheinen behalten wir uns vor, <b><i>[z. B. eine Ausfallgebühr / den vollen Betrag / einen Teilbetrag]</i></b> in Rechnung zu stellen.</p></br>
  <p>Stornierungen oder Änderungen können über nachfolgenden Link vorgenommen werden: <b><i>[z. B. https://www.bloxie.ch/stornierung]</i></b>.</p>
  </html>
  `, [templateVariables]);

  /** @description Sets the value of the body editor based on the loaded template */
  React.useEffect(() => refBody.current?.setValue(htmlBody), [htmlBody]);

  const editorAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      height: EDITOR_BASE_HEIGHT, // => 360
    };
  });

  /** @description Handles the save action of the customized template */
  const onPressSafe = React.useCallback(async () => {
    const bodyHtml = await refBody.current?.getHTML?.();

    onAfterSave();
  }, [onAfterSave, refBody]);

  return (
    <View
      ref={refContainer}
      style={{ 
      backgroundColor: primaryBgColor, 
      borderColor: primaryBorderColor,
    }}>
      <View style={{ gap: STYLES.sizeGap }}>
        <View style={[ActionTemplateStyle.view, { backgroundColor: shadeColor(secondaryBgColor, 0.3) }]}>
           <ScreenTrayWorkflowCancellationTermsHeader
             name={"Stornierungsbedingungen"}
             onPressClose={onPressCloseInternal} />
          <View style={[ActionTemplateStyle.containerEditor, {
            borderColor: primaryBorderColor,
            backgroundColor: shadeColor(tertiaryBgColor, 0.8), 
            height: EDITOR_BASE_HEIGHT, // => 360
            paddingBottom: TOOLBAR_HEIGHT,
          }]}>
            <Animated.View style={[ActionTemplateStyle.editor, editorAnimatedStyle]}>
              <Editor
                ref={refBody}
                defaultValue={htmlBody}
                maxHeight={EDITOR_BASE_HEIGHT - TOOLBAR_HEIGHT - SUBJECT_HEIGHT}
                onIsFocused={onIsFocused(FocusedEditorTypeEnum.BODY)}
                onStyleStateChange={setStyleState} />
            </Animated.View>
            <View style={[GlobalContainerStyle.rowCenterEnd, ActionTemplateStyle.actions,{ height: TOOLBAR_HEIGHT }]}>
              {/**
                * @TODO Implement in a future version 
              <TouchableHapticDropdown
                text="DE"
                icon={faLanguage as IconProp}
                type="label"
                hasViewCustomStyle={true}
                viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 6 }}
                textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
                onPress={() => { }} />*/}
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
 * @since 0.0.52
 * @version 0.0.1
 * @param {ScreenTrayWorkflowCancellationTermsHeaderProps} param0
 * @param {string} param0.name - The name of the cancellation terms which is chosen by the user for the workflow cancellation terms
 * @component */
const ScreenTrayWorkflowCancellationTermsHeader = ({
  name,
  onPressClose
}: ScreenTrayWorkflowCancellationTermsHeaderProps) => {
  const { infoColor } = useThemeColors();
  const ref = React.useRef<View>(null);

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
        placeholder="Name der Stornierungsbedingungen"
        numberOfLines={1}
        style={{
          color: infoColor,
          fontSize: Number(SIZES.label),
          fontFamily: String(FAMILIY.subtitle),
          flexGrow: 1,
          flexShrink: 1,
        }}/>
      <Divider vertical />
      <TouchableHapticIcon
        icon={faXmark as IconProp}
        iconSize={STYLES.sizeFaIcon}
        hasViewCustomStyle={true}
        iconColor={infoColor}
        onPress={onPressClose}/>
    </View>
  );
}

export default ScreenTrayWorkflowCancellationTerms;  