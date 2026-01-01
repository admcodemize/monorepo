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
import { faBold, faItalic, faUnderline, faListOl, faListUl, faH1, faQuoteLeft } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import WorkflowFooterStyle from "@/styles/components/layout/footer/private/WorkflowFooter";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";

import TouchableHapticText from "@/components/button/TouchableHapticText";
import ListItemWithChildren, { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";
import ListItemGroup from "@/components/container/ListItemGroup";
import ListItemWithChildrenRow from "@/components/lists/item/ListItemWithChildrenRow";
import { useConfigurationContextStore } from "@/context/ConfigurationContext";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.1
 * @type */
export type ScreenTrayEditActionProps = {
  onAfterSave: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.1
 * @param {ScreenTrayEditActionProps} param0
 * @component */
const ScreenTrayEditAction = ({ 
  onAfterSave
}: ScreenTrayEditActionProps) => {
  const ref = React.useRef<EnrichedTextInputInstance>(null);
  const selectionRef = React.useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  /** @description Used to get the theme based colors */
  const { secondaryBgColor, primaryBorderColor, infoColor, tertiaryBgColor, primaryBgColor, linkColor, textColor } = useThemeColors();

  const { convexUser } = useConvexUser();

  /** @description Used to get all the linked mail accounts for the currently signed in user */
  const linkedMailAccounts = useQuery(api.sync.integrations.query.linkedWithMailPermission, {
    userId: convexUser?._id as Id<"users">
  });


  const [html, setHtml] = React.useState('');

  const normalizeHtml = (value: string) =>
    value.trim().replace(/>\s+</g, "><");

  const TEMPLATE = normalizeHtml(`
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
  
  const MENTION_VARIABLES = [
    "EventParticipant",
    "EventTitle",
    "EventDate",
    "EventStartTime",
    "EventLocation",
    "EventDescription",
    "EventOrganizer",
    "CompanyAddress",
  ];
  
  const variableMentionMarkup = (name: string) =>
    `<mention indicator="#" text="${name}" type="variable">${name}</mention>\u200B`;
  
  // Hilfsfunktion zum Ersetzen
  const hydrateTemplate = (html: string) =>
    MENTION_VARIABLES.reduce(
      (acc, variable) =>
        acc.replaceAll(
          `{{${variable}}}`,
          variableMentionMarkup(variable)
        ),
      html
    );
  
  const initialHtml = React.useMemo(() => hydrateTemplate(TEMPLATE), []);
  
  React.useEffect(() => {
    const htmlWithMentions = initialHtml;
    setHtml(htmlWithMentions);
    ref.current?.setValue(htmlWithMentions);
  }, [initialHtml]);


  /** @description Returns all the workflows stored in the context for the currently signed in user */
  const templates = useConfigurationContextStore((state) => state.templates).filter((template) => template.isGlobal);
  const memoizedTemplates = React.useMemo(() => templates.filter((template) => template.isGlobal), [templates]);


  
  const EDITOR_BASE_HEIGHT = 220;
  const VARIABLES_HEIGHT = 332;
  const TEMPLATES_HEIGHT = 332;
  const TOOLBAR_HEIGHT = 40;

  const [areVariablesVisible, setAreVariablesVisible] = React.useState(false);
  const [areTemplatesVisible, setAreTemplatesVisible] = React.useState(false);
  const variablesHeight = useSharedValue(0);
  const templatesHeight = useSharedValue(0);

  const toggleVariables = React.useCallback(() => {
    setAreVariablesVisible((prev) => {
      const next = !prev;
      variablesHeight.value = withTiming(next ? VARIABLES_HEIGHT : 0, { duration: 220 });
      return next;
    });
  }, [variablesHeight]);
  
  const toggleTemplates = React.useCallback(() => {
    setAreTemplatesVisible((prev) => {
      const next = !prev;
      templatesHeight.value = withTiming(next ? TEMPLATES_HEIGHT : 0, { duration: 220 });
      return next;
    });
  }, [templatesHeight]);


  const editorAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      height: EDITOR_BASE_HEIGHT + (140 - variablesHeight.value - 10),
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

    const collapseTrailingEmptyParagraphs = (html: string) =>
      html.replace(/(<p><br><\/p>)+$/g, '');
    
    const collapseRedundantBreaks = (html: string) =>
      html.replace(/(<br\s*\/?>\s*)+<\/p>/g, '</p>');

    const plainToHtmlOffset = (html: string, plainIndex: number) => {
      let plainPos = 0;
      for (let htmlPos = 0; htmlPos < html.length; htmlPos += 1) {
        const char = html[htmlPos];
        if (char === '<') {
          while (html[htmlPos] !== '>' && htmlPos < html.length) htmlPos += 1;
        } else if (char === '&') {
          const entityEnd = html.indexOf(';', htmlPos);
          if (entityEnd !== -1) {
            if (plainPos === plainIndex) return htmlPos;
            plainPos += 1;
            htmlPos = entityEnd;
            continue;
          }
        } else {
          if (plainPos === plainIndex) return htmlPos;
          plainPos += 1;
        }
      }
      return html.length;
    };

    const insertVariable = async (variable: string) => {
       /* let currentHtml = await ref.current?.getHTML() ?? '';
      const { start, end } = selectionRef.current;

      const startIdx = plainToHtmlOffset(currentHtml, start);
      const endIdx = plainToHtmlOffset(currentHtml, end);

      let nextHtml = [
        currentHtml.slice(0, startIdx + 1),
        `<code>#${variable}</code><span />`,
        currentHtml.slice(endIdx + 1),
      ].join('');

      nextHtml = collapseTrailingEmptyParagraphs(
        collapseRedundantBreaks(nextHtml)
      );

      ref.current?.setValue(nextHtml);
      setHtml(nextHtml);*/


      // Auswahl wiederherstellen
      ref.current?.focus();

 
      const indicator = "#";
 
      // Mention einleiten
      ref.current?.startMention(indicator);
 
      // Mention setzen – Text und Meta-Info
      ref.current?.setMention(indicator, variable, { type: "variable" });

    }

  return (
    <View style={{ 
      //padding: STYLES.paddingHorizontal, 
      backgroundColor: primaryBgColor, 
      borderColor: primaryBorderColor,
    }}>
      <View style={{ gap: STYLES.sizeGap }}>
        {/*<TrayHeader
          title={"Bearbeiten"}
          description={"E-Mail an alle Teilnehmer senden"} />
        <Divider />*/}


        <View style={[ProviderStyle.item, { backgroundColor: shadeColor(secondaryBgColor, 0.3), borderRadius: 14, padding: 4 }]}>
          <View style={[GlobalContainerStyle.rowCenterBetween, ProviderStyle.itemHeader]}>
            <TextBase text="E-Mail an alle Teilnehmer senden" type="label" style={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }} />
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, height: 28 }]}>
              <Image source={PNG_ASSETS.googleMail} style={{ height: 18, width: 18 }} resizeMode="cover"/>
              <TouchableHapticDropdown
                text={linkedMailAccounts?.[0].email || "notifications@bloxie.ch"}
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
            height: EDITOR_BASE_HEIGHT + 140 + TOOLBAR_HEIGHT,
            borderRadius: 10,
            paddingBottom: TOOLBAR_HEIGHT,
          }]}>
          <Animated.View style={[editorAnimatedStyle, { gap: 4, paddingHorizontal: 8 }]}>
            <EnrichedTextInput
                ref={ref}
                placeholder="Betreff"
                placeholderTextColor={infoColor}
                onChangeMention={(event) => {
                  console.log("onChangeMention");
                  console.log(event.text);
                  console.log(event.indicator);
                }}
                onEndMention={(event) => {
                  console.log("onEndMention");
                  console.log(event)
                }}
                mentionIndicators={["#"]}
                onMentionDetected={(event) => {
                  console.log("onMentionDetected");
                  console.log(event.attributes);
                  console.log(event.indicator);
                  console.log(event.text);
                }}
                htmlStyle={{ 
                  mention: {
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    textDecorationLine: "underline",
                  },
                  /*h1: {
                    fontSize: 11,
                    bold: true,
                  },*/
                  a: {
                    color: linkColor,
                    textDecorationLine: "underline",
                  },
                  ol: {
                    gapWidth: 10,
                    marginLeft: 10,
                    markerFontWeight: "bold",
                    markerColor: infoColor,
                  },
                  ul: {
                    bulletColor: infoColor,
                    bulletSize: 4,
                    marginLeft: 10,
                    gapWidth: 10,
                  }
                }}
                style={{
                  fontStyle: "normal",
                  fontSize: Number(SIZES.text),
                  color: "#000",
                  padding: 4,
                  minHeight: 24,
                  borderBottomWidth: 1,
                  borderBottomColor: primaryBorderColor,
                }} />
              <EnrichedTextInput
                ref={ref}
                //placeholder="<html><h1>hallohh</h1></html>"
                defaultValue={html}
                placeholderTextColor={infoColor}
                selectionColor={"#000"}
                autoFocus={false}
                autoCapitalize="none"
                mentionIndicators={["#"]}
                onChangeMention={(event) => {
                  console.log("onChangeMention");
                  console.log(event.text);
                  console.log(event.indicator);
                }}
                onEndMention={(event) => {
                  console.log("onEndMention");
                  console.log(event)
                }}
                onMentionDetected={(event) => {
                  console.log(event.attributes);
                  console.log(event.indicator);
                  console.log(event.text);
                }}
                onLinkDetected={(event) => {
                  console.log(event.url, event.text);
                }}
                editable={true}
                onChangeSelection={async(event) => {
                  console.log(event.nativeEvent.start, event.nativeEvent.end, event.nativeEvent.text);
                  
                  selectionRef.current = {
                    start: event.nativeEvent.start,
                    end: event.nativeEvent.end,
                  };

                  console.log(await ref.current?.getHTML());
                }}
                
                onChangeText={(event) => {
                  console.log(event.nativeEvent.value);
                }}
                onChangeState={(event) => {
                  console.log(event.nativeEvent.isBold);
                }}
                htmlStyle={{ 
                  mention: {
                    "#": {
                      backgroundColor: "#d5d5d5",
                      color: textColor,
                      textDecorationLine: "none",
                    },
                  },
                  code: {
                    backgroundColor: "#d5d5d5",
                    color: textColor,
                  },
                  /*h1: {
                    fontSize: 11,
                    bold: true,
                  },*/
                  a: {
                    color: linkColor,
                    textDecorationLine: "underline",
                  },
                  ol: {
                    gapWidth: 10,
                    marginLeft: 10,
                    markerFontWeight: "bold",
                    markerColor: infoColor,
                  },
                  ul: {
                    bulletColor: infoColor,
                    bulletSize: 4,
                    marginLeft: 10,
                    gapWidth: 10,
                  }
                }}
                style={{
                  flex: 1,
                  fontStyle: "normal",
                  fontSize: Number(SIZES.text),
                  color: infoColor,
                  padding: 4,
                }}
              />
            </Animated.View>

            <Animated.View
              pointerEvents={areVariablesVisible ? "auto" : "none"}
              style={[
                variablesAnimatedStyle,
                {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: TOOLBAR_HEIGHT,
                  overflow: "hidden",
                },
              ]}
            >
              <View style={[{ gap: 4, height: VARIABLES_HEIGHT, paddingHorizontal: 14, paddingVertical: 4, paddingBottom: 10, backgroundColor: shadeColor(secondaryBgColor, 0.3),
                borderTopWidth: 1, borderTopColor: primaryBorderColor, borderBottomWidth: 1, borderBottomColor: primaryBorderColor }]}>

                    <ListItemGroup
                      title="Dynamische Inhalte"
                      gap={8}
                      style={{ paddingVertical: 6 }} />
                      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                        <TouchableHaptic onPress={async () => insertVariable("EventTitle")}>
                        <ListItemWithChildrenRow
                          title="Titel des Ereignisses"
                          description="{{EventTitle}}"
                          iconSize={12}
                          type={ListItemWithChildrenTypeEnum.custom}/>
                        </TouchableHaptic>
                        <TouchableHaptic onPress={async () => insertVariable("EventDescription")}>
                        <ListItemWithChildrenRow
                          title="Beschreibung des Ereignisses"
                          description="{{EventDescription}}"
                          iconSize={12}
                          type={ListItemWithChildrenTypeEnum.custom}/>
                        </TouchableHaptic>
                        <TouchableHaptic onPress={async () => insertVariable("EventDate")}>
                        <ListItemWithChildrenRow
                          title="Datum des Ereignisses"
                          description="{{EventDate}}"
                          iconSize={12}
                          type={ListItemWithChildrenTypeEnum.custom}/>
                        </TouchableHaptic>
                        <TouchableHaptic onPress={async () => insertVariable("EventStartTime")}>
                        <ListItemWithChildrenRow
                          title="Startuhrzeit des Ereignisses"
                          description="{{EventStartTime}}"
                          iconSize={12}
                          type={ListItemWithChildrenTypeEnum.custom}/>
                        </TouchableHaptic>
                        <TouchableHaptic onPress={async () => insertVariable("EventLocation")}>
                        <ListItemWithChildrenRow
                          title="Ort des Ereignisses"
                          description="{{EventLocation}}"
                          iconSize={12}
                          type={ListItemWithChildrenTypeEnum.custom}/>
                        </TouchableHaptic>
                        <TouchableHaptic onPress={async () => insertVariable("EventParticipant")}>
                        <ListItemWithChildrenRow
                          title="Teilnehmer des Ereignis"
                          description="{{EventParticipant}}"
                          iconSize={12}
                          type={ListItemWithChildrenTypeEnum.custom}/>
                        </TouchableHaptic>
                        <TouchableHaptic onPress={async () => insertVariable("EventOrganizer")}>
                        <ListItemWithChildrenRow
                          title="Organisator des Ereignis"
                          description="{{EventOrganizer}}"
                          iconSize={12}
                          type={ListItemWithChildrenTypeEnum.custom}/>
                        </TouchableHaptic>
                        <TouchableHaptic onPress={async () => insertVariable("CompanyAddress")}>
                        <ListItemWithChildrenRow
                          title="Firmenanschrift"
                          description="{{CompanyAddress}}"
                          iconSize={12}
                          type={ListItemWithChildrenTypeEnum.custom}/>
                        </TouchableHaptic>
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
              <View style={[{ gap: 4, height: TEMPLATES_HEIGHT, paddingHorizontal: 14, paddingVertical: 4, paddingBottom: 10, backgroundColor: shadeColor(secondaryBgColor, 0.3),
                borderTopWidth: 1, borderTopColor: primaryBorderColor, borderBottomWidth: 1, borderBottomColor: primaryBorderColor}]}>

<ListItemGroup 
          title="Öffentliche Vorlagen"
          gap={STYLES.sizeGap}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {memoizedTemplates.map((template) => (
              <TouchableHaptic 
                key={template._id}
                onPress={() => { 
                  

                  const htmlWithMentions = hydrateTemplate(template.content);
                  setHtml(htmlWithMentions);
                  ref.current?.setValue(htmlWithMentions);

                 }}>
                <ListItemWithChildren
                  title={template.name || ""}
                  description={template.description || ""}
                  type={ListItemWithChildrenTypeEnum.navigation}
                  icon={resolveRuntimeIcon(template.icon || "faFileDashedLine")} />
              </TouchableHaptic>
            ))}
            </ScrollView>
        </ListItemGroup>
                   
              </View>
            </Animated.View>

            <View style={[{ position: "absolute", bottom: 0, width: "100%", gap: 4, height: 40, alignItems: "flex-end", justifyContent: "center"  }]}>

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
                  type="label"
                  hasViewCustomStyle={true}
                  viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 6 }}
                  textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
                  onPress={toggleVariables} />
              </View>
            </View>



          </View>
          <View style={[GlobalContainerStyle.rowCenterBetween, { height: 30, paddingRight: 12 }]}>
          <View style={[GlobalContainerStyle.rowCenterCenter, {
                  //backgroundColor: shadeColor(secondaryBgColor, 0.3),
                  borderRadius: 6,
                  height: "100%",
                  gap: 14,
                  paddingHorizontal: 10,
                }]}>
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 14 }]}>
                    <TouchableHapticIcon
                      icon={faH1 as IconProp}
                      iconSize={14}
                      iconColor={shadeColor(infoColor, 0.3)}
                      hasViewCustomStyle={true}
                      onPress={() => {  }} />
                    <TouchableHapticIcon
                      icon={faListOl as IconProp}
                      iconSize={14}
                      iconColor={shadeColor(infoColor, 0.3)}
                      hasViewCustomStyle={true}
                      onPress={() => { ref?.current?.toggleOrderedList() }} />
                    <TouchableHapticIcon
                      icon={faListUl as IconProp}
                      iconSize={14}
                      iconColor={shadeColor(infoColor, 0.3)}
                      hasViewCustomStyle={true}
                      onPress={() => { ref?.current?.toggleUnorderedList() }} />
                    <TouchableHapticIcon
                      icon={faBold as IconProp}
                      iconSize={14}
                      iconColor={"#000000"}
                      hasViewCustomStyle={true}
                      onPress={() => { ref?.current?.toggleBold() }} />
                    <TouchableHapticIcon
                      icon={faItalic as IconProp}
                      iconSize={14}
                      iconColor={shadeColor(infoColor, 0.3)}
                      hasViewCustomStyle={true}
                      onPress={() => { ref?.current?.toggleItalic() }} />
                    <TouchableHapticIcon
                      icon={faUnderline as IconProp}
                      iconSize={14}
                      iconColor={"#000000"}
                      hasViewCustomStyle={true}
                      onPress={() => { ref?.current?.toggleUnderline() }} />
                    <TouchableHapticIcon
                      icon={faStrikethrough as IconProp}
                      iconSize={14}
                      iconColor={"#000000"}
                      hasViewCustomStyle={true}
                      onPress={() => { ref?.current?.toggleStrikeThrough() }} />
                    <TouchableHapticIcon
                      icon={faLink as IconProp}
                      iconSize={18}
                      hasViewCustomStyle={true}
                      onPress={() => {}} />
                  </View>
                  
                  <Divider vertical style={{ height: 14 }} />

                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 14 }]}>
                  <TouchableHapticIcon
                    icon={faKeyboardDown as IconProp}
                    iconSize={16}
                    hasViewCustomStyle={true}
                    onPress={() => { ref?.current?.blur() }} />
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





        {/*<View style={[GlobalContainerStyle.rowCenterStart, { gap: 8 }]}>
          <TextBase text="E-Mail-Adresse für das Versenden:" type="label" style={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }} />
          <TouchableHapticDropdown
            text={linkedMailAccounts?.[0].email || "notifications@bloxie.ch"}
            hasViewCustomStyle
            textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
            viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
            onPress={() => {}}/>
        </View>*/}
      </View>




      
    </View>
  );
};

export default ScreenTrayEditAction;