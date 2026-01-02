import { DatesInWeekInfoProps } from "@codemize/helpers/DateTime";
import { Image, ScrollView, TextInput, Touchable, View } from "react-native";
import TextBase from "@/components/typography/Text";
import TrayHeader from "@/components/container/TrayHeader";
import { STYLES } from "@codemize/constants/Styles";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import Divider from "@/components/container/Divider";
import { format } from "date-fns";
import { getLocalization, resolveRuntimeIcon } from "@/helpers/System";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../packages/backend/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Id } from "../../../../../../../packages/backend/convex/_generated/dataModel";
import { useConvexUser } from "@/hooks/auth/useConvexUser";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";
import { faEnvelope, faStrikethrough } from "@fortawesome/pro-solid-svg-icons";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import ProviderStyle from "@/styles/screens/private/modal/configuration/integration/Provider";
import { shadeColor } from "@codemize/helpers/Colors";
import { PNG_ASSETS } from "@/assets/png";
import { EnrichedTextInput } from 'react-native-enriched';
import type {
  EnrichedTextInputInstance,
  OnChangeStateEvent,
} from 'react-native-enriched';
import React from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAt, faHashtag, faLink } from "@fortawesome/pro-thin-svg-icons";
import { faAlarmClock, faArrowRightToDottedLine, faBracketsCurly, faBuilding, faBuildings, faCalendarDay, faClone, faFileDashedLine, faFloppyDisk, faH2, faH3, faHeading, faKeyboard, faKeyboardDown, faLanguage, faLocationDot, faParagraph, faPlus, faRightFromBracket, faSquareRootVariable, faUsers } from "@fortawesome/duotone-thin-svg-icons";
import { faBold, faItalic, faUnderline, faListOl, faListUl, faH1, faQuoteLeft, faBlockQuote, faCode } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import WorkflowFooterStyle from "@/styles/components/layout/footer/private/WorkflowFooter";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";

import TouchableHapticText from "@/components/button/TouchableHapticText";
import ListItemWithChildren, { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";
import ListItemGroup from "@/components/container/ListItemGroup";
import ListItemWithChildrenRow from "@/components/lists/item/ListItemWithChildrenRow";
import { useConfigurationContextStore } from "@/context/ConfigurationContext";
import { useUserContextStore } from "@/context/UserContext";
import { ConvexRuntimeAPIProps } from "@codemize/backend/Types";
import ListTemplatesWorkflowAction from "@/components/lists/ListTemplatesWorkflowAction";
import { EDITOR_STYLE_ITEMS } from "@/constants/Models";
import Editor, { createInitialStyleState, EditorStyleState } from "@/components/typography/Editor";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.1
 * @type */
export type ScreenTrayActionTemplateProps = {
  onAfterSave: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.1
 * @param {ScreenTrayActionTemplateProps} param0
 * @component */
const ScreenTrayActionTemplate = ({ 
  onAfterSave
}: ScreenTrayActionTemplateProps) => {
  const refBody = React.useRef<EnrichedTextInputInstance>(null);
  const refSubject = React.useRef<EnrichedTextInputInstance>(null);
  const selectionRef = React.useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  /** @description Used to get the theme based colors */
  const { secondaryBgColor, primaryBorderColor, infoColor, tertiaryBgColor, primaryBgColor, linkColor, textColor } = useThemeColors();

  const { convexUser } = useConvexUser();
  const { templateVariables } = useUserContextStore((state) => state.runtime);

  /** @description Used to get all the linked mail accounts for the currently signed in user */
  const linkedMailAccounts = useQuery(api.sync.integrations.query.linkedWithMailPermission, {
    userId: convexUser?._id as Id<"users">
  });

  const [styleState, setStyleState] = React.useState<EditorStyleState>(createInitialStyleState());


  const [html, setHtml] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  const normalizeHtml = (value: string) =>
    value.trim().replace(/>\s+</g, "><");

  const TEMPLATE_SUBJECT = normalizeHtml(`
    <html>
      <p>{{CompanyName}} - Erinnerung an Ereignis "{{EventTitle}}" </p>
    </html>
  `);

  const TEMPLATE_BODY = normalizeHtml(`
    <html>
      <p>Sehr geehrte/r {{EventParticipant}} </p>
      <br>
      <p>Hiermit erinnere ich Sie an das Ereignis <b>{{EventTitle}}</b> am <b>{{EventDate}}</b>/<b>{{EventStartTime}}</b>.</p>
      <br>
      <p>Weitere Informationen:</p>
      <p>Ort: {{EventLocation}} </p>
      <p>Beschreibung: {{EventDescription}} </p>
      <br>
      <p>Freundliche Grüsse</p>
      <p><b>{{EventOrganizer}} </b></p>
      <p>{{CompanyAddress}} </p>
    </html>
  `);
  
  const variableMentionMarkup = (name: string) => `<mention indicator="#" text="${name}" type="variable">${name}</mention>\u200B`;
  
  // Hilfsfunktion zum Ersetzen
  const hydrateTemplate = (html: string) =>
    templateVariables.map((variable) => variable.pattern).reduce(
      (acc, variable) =>
        acc.replaceAll(
          `{{${variable}}}`,
          variableMentionMarkup(variable)
        ),
      html
    );
  
  const htmlSubject = React.useMemo(() => hydrateTemplate(TEMPLATE_SUBJECT), []);
  const htmlBody = React.useMemo(() => hydrateTemplate(TEMPLATE_BODY), []);
  
  
  React.useEffect(() => {
    setHtml(htmlBody);
    refBody.current?.setValue(htmlBody);
  }, [htmlBody]);

  React.useEffect(() => {
    setHtml(htmlSubject);
    refSubject.current?.setValue(htmlSubject);
  }, [htmlSubject]);


  /** @description Returns all the workflows stored in the context for the currently signed in user */
  const templates = useConfigurationContextStore((state) => state.templates).filter((template) => template.isGlobal);
  const memoizedTemplates = React.useMemo(() => templates.filter((template) => template.isGlobal), [templates]);


  
  const EDITOR_BASE_HEIGHT = 360;
  const TOOLBAR_HEIGHT = 40;
  const SUBJECT_HEIGHT = 30;
  const ANIMATED_HEIGHT = EDITOR_BASE_HEIGHT - TOOLBAR_HEIGHT - SUBJECT_HEIGHT - 1; // -> 4 => padding, 1 => borderbottom of the subject editor

  const [areVariablesVisible, setAreVariablesVisible] = React.useState(false);
  const [areTemplatesVisible, setAreTemplatesVisible] = React.useState(false);
  const variablesHeight = useSharedValue(0);
  const templatesHeight = useSharedValue(0);

  const toggleVariables = React.useCallback(() => {
    setAreVariablesVisible((prev) => {
      const next = !prev;
      variablesHeight.value = withTiming(next ? ANIMATED_HEIGHT : 0, { duration: 220 });
      return next;
    });
  }, [variablesHeight]);
  
  const toggleTemplates = React.useCallback(() => {
    setAreTemplatesVisible((prev) => {
      const next = !prev;
      templatesHeight.value = withTiming(next ? ANIMATED_HEIGHT : 0, { duration: 220 });
      return next;
    });
  }, [templatesHeight]);


  const editorAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      height: EDITOR_BASE_HEIGHT, // => 360
    };
  });

  const variablesAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      height: variablesHeight.value,
      opacity: variablesHeight.value === 0 ? 0 : 1,
    };
  });

  const templatesAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      height: templatesHeight.value,
      opacity: templatesHeight.value === 0 ? 0 : 1,
    };
  });

    const insertVariable = async (variable: string) => {

      // Auswahl wiederherstellen
      refBody.current?.focus();

 
      const indicator = "#";
 
      // Mention einleiten
      refBody.current?.startMention(indicator);
 
      // Mention setzen – Text und Meta-Info
      refBody.current?.setMention(indicator, variable, { type: "variable" });

    }

  return (
    <View style={{ 
      //padding: STYLES.paddingHorizontal, 
      backgroundColor: primaryBgColor, 
      borderColor: primaryBorderColor,
    }}>
      <View style={{ gap: STYLES.sizeGap }}>
    

        <View style={[ProviderStyle.item, { backgroundColor: shadeColor(secondaryBgColor, 0.3), borderRadius: 14, padding: 4 }]}>
          <View style={[GlobalContainerStyle.rowCenterBetween, ProviderStyle.itemHeader]}>
            <TextBase text="E-Mail an alle Teilnehmer senden" type="label" style={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }} />
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, height: 28 }]}>
              {linkedMailAccounts && linkedMailAccounts.length > 0 && <Image source={PNG_ASSETS.googleMail} style={{ height: 18, width: 18 }} resizeMode="cover"/>}
              <TouchableHapticDropdown
                text={linkedMailAccounts && linkedMailAccounts.length > 0 ? linkedMailAccounts[0].email : "notifications@bloxie.ch"}
                hasViewCustomStyle
                textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
                viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
                onPress={() => { }}/>
            </View>

          </View>
          {/*info && <TextBase 
            text={info} 
            type="label" 
            preText={"Hinweis:"} 
            preTextStyle={{ color: infoColor }}
            style={[GlobalTypographyStyle.labelText, { paddingHorizontal: 8, paddingVertical: 4, color: shadeColor(infoColor, 0.3)}]} />}*/}
          <View style={[{
            position: "relative",
            borderWidth: 1,
            paddingVertical: 4,
            backgroundColor: shadeColor(tertiaryBgColor, 0.8), 
            borderColor: primaryBorderColor,
            height: EDITOR_BASE_HEIGHT, // => 360
            borderRadius: 10,
            paddingBottom: TOOLBAR_HEIGHT,
          }]}>
            <Animated.View style={[editorAnimatedStyle, { gap: 4, paddingHorizontal: 8 }]}>
              <Editor
                ref={refSubject}
                placeholder="Betreff"
                defaultValue={htmlSubject}
                maxHeight={SUBJECT_HEIGHT - 4}
                primaryTextColor={"#000"}
                showBorderBottom={true}
                onIsFocused={setIsFocused}
                onStyleStateChange={setStyleState} />
              <Editor
                ref={refBody}
                defaultValue={htmlBody}
                maxHeight={EDITOR_BASE_HEIGHT - TOOLBAR_HEIGHT - SUBJECT_HEIGHT}
                onIsFocused={setIsFocused}
                onStyleStateChange={setStyleState} />
            </Animated.View>

            <Animated.View
              pointerEvents={areVariablesVisible ? "auto" : "none"}
              style={[
                variablesAnimatedStyle,
                {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: TOOLBAR_HEIGHT, // => 40
                  overflow: "hidden",
                },
              ]}
            >
              <View style={[{ gap: 4, height: ANIMATED_HEIGHT, paddingHorizontal: 14, paddingVertical: 4, backgroundColor: shadeColor(secondaryBgColor, 0.3),
                borderTopWidth: 1, borderTopColor: primaryBorderColor, borderBottomWidth: 1, borderBottomColor: primaryBorderColor }]}>



                    <ListItemGroup 
                      title="Dynamische Inhalte"
                      gap={STYLES.sizeGap}
                      style={{ paddingVertical: 10 }} />

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ maxHeight: ANIMATED_HEIGHT - TOOLBAR_HEIGHT - 10 }}>
                    {templateVariables.map((variable) => (
                      <TouchableHaptic 
                        key={variable.pattern}
                        onPress={() => { 
                          insertVariable(variable.pattern);
                          toggleVariables();

                        }}>
                        <ListItemWithChildren
                          title={variable.name}
                          description={"Keine aktive Verwendung"}
                          type={ListItemWithChildrenTypeEnum.custom}
                          right={<TextBase text={`{{${variable.pattern}}}`} type="label"/>}
                          icon={resolveRuntimeIcon(variable.icon || "") as IconProp}
                          iconSize={16} />
                      </TouchableHaptic>
                    ))}
                    </ScrollView>
                    

              </View>
            </Animated.View>

            <Animated.View
              pointerEvents={areTemplatesVisible ? "auto" : "none"}
              style={[
                templatesAnimatedStyle,
                {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: TOOLBAR_HEIGHT,
                  overflow: "hidden",
                },
              ]}
            >
              <View style={[{ gap: 4, height: ANIMATED_HEIGHT, paddingHorizontal: 14, paddingVertical: 4, backgroundColor: shadeColor(secondaryBgColor, 0.3),
                borderTopWidth: 1, borderTopColor: primaryBorderColor, borderBottomWidth: 1, borderBottomColor: primaryBorderColor}]}>

                    <ListTemplatesWorkflowAction
                      maxHeight={ANIMATED_HEIGHT - TOOLBAR_HEIGHT - 10}
                      onPress={({ content }) => { 
                        const htmlWithMentions = hydrateTemplate(content);
                        setHtml(htmlWithMentions);
                        refBody.current?.setValue(htmlWithMentions);
                        toggleTemplates();
                      }} />
                      
              </View>
            </Animated.View>

            <View style={[{ position: "absolute", bottom: 0, width: "100%", gap: 4, height: TOOLBAR_HEIGHT, alignItems: "flex-end", justifyContent: "center"  }]}>

              <View style={[GlobalContainerStyle.rowCenterEnd, { gap: 18, paddingRight: 12, flex: 1, width: "100%" }]}>
                <TouchableHapticDropdown
                  text="DE"
                  icon={faLanguage as IconProp}
                  type="label"
                  hasViewCustomStyle={true}
                  viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 6 }}
                  textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
                  onPress={() => { }} />
                <TouchableHapticDropdown
                  text="Vorlagen"
                  icon={faFileDashedLine as IconProp}
                  type="label"
                  hasViewCustomStyle={true}
                  viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 6 }}
                  textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
                  onPress={toggleTemplates} />
                
                <TouchableHapticDropdown
                  text="Dynamische Inhalte"
                  icon={faSquareRootVariable as IconProp}
                  disabled={!isFocused}
                  type="label"
                  hasViewCustomStyle={true}
                  viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 6 }}
                  textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
                  onPress={toggleVariables} />
              </View>
            </View>



          </View>








          <View style={[GlobalContainerStyle.rowCenterBetween, { height: TOOLBAR_HEIGHT, paddingRight: 12 }]}>
                <View style={[GlobalContainerStyle.rowCenterCenter, {
                  //backgroundColor: shadeColor(secondaryBgColor, 0.3),
                  borderRadius: 6,
                  height: "100%",
                  gap: 14,
                  paddingHorizontal: 10,
                }]}>
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                     {EDITOR_STYLE_ITEMS.map((item, idx) => {
                       const isActive = styleState[item.state as keyof typeof styleState];
                       const toggleFn = refBody.current?.[item.functionAsString as keyof EnrichedTextInputInstance] as (() => void) | undefined;
                       return (
                        <TouchableHapticIcon
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
                    text="Speichern"
                    hasViewCustomStyle={true}
                    viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
                    textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle), color: linkColor }}
                    onPress={() => { onAfterSave() }} />
                </View>
          </View>



        </View>


      </View>




      
    </View>
  );
};

export default ScreenTrayActionTemplate;  