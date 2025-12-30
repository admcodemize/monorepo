import { DatesInWeekInfoProps } from "@codemize/helpers/DateTime";
import { Image, TextInput, Touchable, View } from "react-native";
import TextBase from "@/components/typography/Text";
import TrayHeader from "@/components/container/TrayHeader";
import { STYLES } from "@codemize/constants/Styles";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import Divider from "@/components/container/Divider";
import { format } from "date-fns";
import { getLocalization } from "@/helpers/System";
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
import TouchableHaptic from "@/components/button/TouchableHaptic";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAt, faHashtag, faLink } from "@fortawesome/pro-thin-svg-icons";
import { faBracketsCurly, faFileDashedLine, faFloppyDisk, faH2, faH3, faKeyboard, faKeyboardDown, faPlus } from "@fortawesome/duotone-thin-svg-icons";
import { faBold, faItalic, faUnderline, faListOl, faListUl, faH1, faQuoteLeft } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import WorkflowFooterStyle from "@/styles/components/layout/footer/private/WorkflowFooter";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";

import TouchableHapticText from "@/components/button/TouchableHapticText";

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



  const normalizeHtml = (value: string) =>
    value.trim().replace(/>\s+</g, "><");

  const [html, setHtml] = React.useState(() => normalizeHtml(`
    <html>
      <p>Sehr geehrte Damen und Herren,</p>
      <br>
      <p>Ich möchte Sie an das gebuchte Ereignis „{{<b>EventName</b>}}" am</p>
      <p>„{{<b>EventDate</b>}}" erinnern.</p>
      <br>
      <p>Bei Fragen oder Unklarheiten können Sie auf diese E-Mail antworten und ich werde Ihre Anfrage innerhalb der nächsten 24 Stunden beantworten.</p>
      <br>
      <p>Weitere Informationen zum Ereignis:</p>
      <p>Ort: {{EventLocation}}</p>
      <p>Beschreibung: {{EventDescription}}</p>
      <br>
      <p>Freundliche Grüsse</p>
      <br>
      <p><b>Max Muster</b></p>
      <p>Feldspieler 31G</p>
      <p>6539 Musterhaften</p>
    </html>
    `));

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
          <View style={[ProviderStyle.itemBottom, {
            backgroundColor: shadeColor(tertiaryBgColor, 0.8), 
            borderColor: primaryBorderColor,
            height: 320,
            borderRadius: 10
          }]}>
            <View style={{ flex: 1, gap: 4 }}>
            <EnrichedTextInput
                ref={ref}
                placeholder="Betreff"
                placeholderTextColor={infoColor}
                htmlStyle={{ 
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
                  height: "auto",
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

                onLinkDetected={(event) => {
                  console.log(event.url, event.text);
                }}
                editable={true}
                onChangeHtml={(event) => {
                  console.log("change", event.nativeEvent.value);
                }}
                onChangeSelection={(event) => {
                  console.log(event.nativeEvent.start, event.nativeEvent.end, event.nativeEvent.text);
                  selectionRef.current = {
                    start: event.nativeEvent.start,
                    end: event.nativeEvent.end,
                  };
                }}
                onChangeText={(event) => {
                  console.log(event.nativeEvent.value);
                }}
                onChangeState={(event) => {
                  console.log(event.nativeEvent.isBold);
                }}

                htmlStyle={{ 
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
                  color: infoColor,
                  padding: 4,
                  height: 260,
                }}
              />
            </View>

            <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 24, position: "absolute", bottom: 0, right: 0, paddingVertical: 12, paddingHorizontal: 10 }]}>
              <TouchableHaptic onPress={() => {

              }}>
                <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
                  <FontAwesomeIcon icon={faPlus as IconProp} size={14} color={infoColor} />
                  <TextBase text="Variabeln" type="label" style={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.text), color: infoColor }} />
                </View>
              </TouchableHaptic>
              <TouchableHaptic>
                <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
                  <FontAwesomeIcon icon={faFileDashedLine as IconProp} size={14} color={infoColor} />
                  <TextBase text="Vorlagen" type="label" style={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.text), color: infoColor }} />
                </View>
              </TouchableHaptic>
            </View>
          </View>




          <View style={[GlobalContainerStyle.rowCenterBetween, { height: 30, paddingRight: 12 }]}>
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