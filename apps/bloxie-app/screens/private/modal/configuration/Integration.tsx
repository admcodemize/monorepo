import ListItemWithChildren, { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";
import { TRAY_CONFIGURATION_ITEMS } from "@/constants/Models";
import { icon, IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowUpRightFromSquare } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { STYLES } from "@codemize/constants/Styles";
import { View } from "react-native";
import { SVG_ASSETS } from "@/assets/svg";
import { PNG_ASSETS } from "@/assets/png";
import ListItemGroup from "@/components/container/ListItemGroup";
import TouchableHapticSwitch from "@/components/button/TouchableHapticSwitch";
import TextBase from "@/components/typography/Text";
import TouchableHapticGoogle from "@/components/button/oauth/TouchableHapticGoogle";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import { shadeColor } from "@codemize/helpers/Colors";
import { faAlarmClock, faHourglass, faHourglassHalf, faLink, faPaperPlane } from "@fortawesome/duotone-thin-svg-icons";
import { faLinkSlash } from "@fortawesome/duotone-thin-svg-icons";
import HorizontalNavigation from "@/components/container/HorizontalNavigation";
import { SceneMap } from "react-native-tab-view";
import ViewBase from "@/components/container/View";
import React from "react";
import Divider from "@/components/container/Divider";
import SearchField from "@/components/container/SearchField";
import { useIntegrationContextStore } from "@/context/IntegrationContext";
import { useIntegrations } from "@/hooks/integrations/useIntegrations";
import { ConvexUsersAPIProps } from "@codemize/backend/Types";
import { Id } from "../../../../../../packages/backend/convex/_generated/dataModel";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useTrays } from "react-native-trays";
import TouchableCheckbox from "@/components/button/TouchableCheckbox";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";
import TouchableHapticGmail from "@/components/button/oauth/TouchableHapticGmail.tsx";
import { unlinkGoogleAccount } from "@/helpers/Provider";
import { Image } from "react-native";
import { useToastStore } from "@/context/ToastContext";

const ScreenConfigurationIntegration = () => {

  const { linkColor, textColor, successColor, errorColor, secondaryBgColor, infoColor, tertiaryBgColor, primaryBorderColor, focusedBgColor, focusedContentColor } = useThemeColors();

  const integrations = useIntegrationContextStore((state) => state.integrations);

  const { open, close } = useToastStore((state) => state);

  const hContentLeft = () =>       <View style={{ paddingHorizontal: STYLES.paddingHorizontal, paddingVertical: STYLES.paddingVertical + 4, gap: STYLES.sizeGap * 3 }}>

    <ListItemGroup 
        title={"i18n.screens.trayAction.items.integration.group1.title"}
        gap={STYLES.sizeGap}>   



      <View style={{ borderRadius: 10, backgroundColor: secondaryBgColor, padding: 2 }}>
        <View style={[GlobalContainerStyle.rowCenterBetween, { paddingHorizontal: 8 }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
          <Image source={PNG_ASSETS.googleCalendar} style={{ height: STYLES.sizeFaIcon + 18, width: STYLES.sizeFaIcon + 16 }} resizeMode="cover"/>
          <View style={{ gap: 1 }}>
            <TextBase text="Google Kalender" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: infoColor }]} />
            <TextBase text="Synchronisierung von Google Kalendern" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor(infoColor, 0.3) }]} />
          </View>
        </View>
        <TouchableHapticSwitch state={true} onStateChange={() => {}} />
        </View>

        <View style={{ backgroundColor: tertiaryBgColor, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 0.5, borderColor: primaryBorderColor,
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
         }}>

        <View style={GlobalContainerStyle.rowCenterBetween}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#159F85", 0.8), padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#159F85", -0.1)} />
                <TextBase text="Aktive Verknüpfungen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#159F85", -0.1) }]} />
              </View>
              <TouchableHapticGoogle />
            </View>

        </View>
      </View>

      <View style={{ borderRadius: 10, backgroundColor: secondaryBgColor, padding: 2 }}>
        <View style={[GlobalContainerStyle.rowCenterBetween, { paddingHorizontal: 8 }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
          <Image source={PNG_ASSETS.googleMail} style={{ height: STYLES.sizeFaIcon + 18, width: STYLES.sizeFaIcon + 16 }} resizeMode="cover"/>
          <View style={{ gap: 1 }}>
            <TextBase text="Google Gmail" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: infoColor }]} />
            <TextBase text="Personalisierter E-Mail-Versand" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor(infoColor, 0.3) }]} />
          </View>
        </View>
        <TouchableHapticSwitch state={true} onStateChange={() => {}} />
        </View>

        <View style={{ backgroundColor: tertiaryBgColor, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 0.5, borderColor: primaryBorderColor,
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
         }}>

         <View style={{ gap: 4 }}>
            <View style={GlobalContainerStyle.rowCenterBetween}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ababab", 0.8), padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                  <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#ababab", -0.1)} />
                  <TextBase text="Keine Verknüpfungen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ababab", -0.1) }]} />
              </View>
              <TouchableHapticGmail grantScopeGmail={true} />
            </View>
            <TextBase text="E-Mails welche über einen Workflow ausgelöst werden, sind über das verknüpfte Gmail Konto personalisiert." type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9 }]} />
          </View>
        </View>
      </View>


      <View style={{ borderRadius: 10, backgroundColor: secondaryBgColor, padding: 2 }}>
        <View style={[GlobalContainerStyle.rowCenterBetween, { paddingHorizontal: 8 }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
          <Image source={PNG_ASSETS.googleMeet} style={{ height: STYLES.sizeFaIcon + 18, width: STYLES.sizeFaIcon + 16 }} resizeMode="cover"/>
          <View style={{ gap: 1 }}>
            <TextBase text="Google Meet" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: infoColor }]} />
            <TextBase text="Videokonferenz- und Instant-Messaging-Dienst" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor(infoColor, 0.3) }]} />
          </View>
        </View>
        <TouchableHapticSwitch state={true} onStateChange={() => {}} />
        </View>

        <View style={{ backgroundColor: tertiaryBgColor, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 0.5, borderColor: primaryBorderColor,
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
         }}>

         <View style={{ gap: 4 }}>
            <View style={GlobalContainerStyle.rowCenterBetween}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ababab", 0.8), padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                  <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#ababab", -0.1)} />
                  <TextBase text="Keine Verwendungen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ababab", -0.1) }]} />
              </View>
            </View>
            <TextBase text="Aktivierung von Online-Besprechungen über Google Meet für Termintypen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9 }]} />
          </View>
        </View>
      </View>
      </ListItemGroup>


      <ListItemGroup 
        title={"i18n.screens.trayAction.items.integration.group2.title"}
        gap={STYLES.sizeGap}>    
          <View style={{ borderRadius: 10, backgroundColor: secondaryBgColor, padding: 2 }}>
            <View style={[GlobalContainerStyle.rowCenterBetween, { paddingHorizontal: 8 }]}>
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
              <Image source={PNG_ASSETS.microsoftOutlook} style={{ height: STYLES.sizeFaIcon + 18, width: STYLES.sizeFaIcon + 16 }} resizeMode="cover"/>
              <View style={{ gap: 1 }}>
                <TextBase text="Microsoft Outlook" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: infoColor }]} />
                <TextBase text="Synchronisierung von Office 365 Kalendern" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor(infoColor, 0.3) }]} />
              </View>
            </View>
            <TouchableHapticSwitch state={false} onStateChange={() => {}} />
            </View>

            <View style={{ backgroundColor: tertiaryBgColor, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 0.5, borderColor: primaryBorderColor,
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
            }}>

            <View style={{ gap: 4 }}>
                <View style={GlobalContainerStyle.rowCenterBetween}>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ababab", 0.8), padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                    <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#ababab", -0.1)} />
                    <TextBase text="Keine Verknüpfungen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ababab", -0.1) }]} />
                  </View>
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ea7373", 0.8), padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                    <FontAwesomeIcon icon={faAlarmClock as IconProp} size={10} color={shadeColor("#ea7373", -0.1)} />
                    <TextBase text="Bald verfügbar" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ea7373", -0.1) }]} />
                  </View>
                </View>
                  <TouchableHapticGmail grantScopeGmail={true} />
                </View>
              </View>
            </View>
          </View>
      </ListItemGroup>

      <ListItemGroup 
        title={"i18n.screens.trayAction.items.integration.group4.title"}
        gap={STYLES.sizeGap}> 

        <View style={{ borderRadius: 10, backgroundColor: secondaryBgColor, padding: 2 }}>
            <View style={[GlobalContainerStyle.rowCenterBetween, { paddingHorizontal: 8 }]}>
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
              <Image source={PNG_ASSETS.slackCalendar} style={{ height: STYLES.sizeFaIcon + 18, width: STYLES.sizeFaIcon + 16 }} resizeMode="cover"/>
              <View style={{ gap: 1 }}>
                <TextBase text="Slack Kalender" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: infoColor }]} />
                <TextBase text="Synchronisierung von Slack Kalendern" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor(infoColor, 0.3) }]} />
              </View>
            </View>
            <TouchableHapticSwitch state={false} onStateChange={() => {}} />
            </View>

            <View style={{ backgroundColor: tertiaryBgColor, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 0.5, borderColor: primaryBorderColor,
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
            }}>

            <View style={{ gap: 4 }}>
                <View style={GlobalContainerStyle.rowCenterBetween}>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ababab", 0.8), padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                    <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#ababab", -0.1)} />
                    <TextBase text="Keine Verknüpfungen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ababab", -0.1) }]} />
                  </View>
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ea7373", 0.8), padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                    <FontAwesomeIcon icon={faAlarmClock as IconProp} size={10} color={shadeColor("#ea7373", -0.1)} />
                    <TextBase text="Bald verfügbar" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ea7373", -0.1) }]} />
                  </View>
                </View>
                  <TouchableHapticGmail grantScopeGmail={true} />
                </View>
              </View>
            </View>
          </View>

          <View style={{ borderRadius: 10, backgroundColor: secondaryBgColor, padding: 2 }}>
            <View style={[GlobalContainerStyle.rowCenterBetween, { paddingHorizontal: 8 }]}>
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
              <Image source={PNG_ASSETS.paypalPayments} style={{ height: STYLES.sizeFaIcon + 18, width: STYLES.sizeFaIcon + 16 }} resizeMode="cover"/>
              <View style={{ gap: 1 }}>
                <TextBase text="PayPal - Bezahldienst" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: infoColor }]} />
                <TextBase text="Empfangen von Zahlungen für kostenpflichtige Termine" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor(infoColor, 0.3) }]} />
              </View>
            </View>
            <TouchableHapticSwitch state={false} onStateChange={() => {}} />
            </View>

            <View style={{ backgroundColor: tertiaryBgColor, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 0.5, borderColor: primaryBorderColor,
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
            }}>

            <View style={{ gap: 4 }}>
                <View style={GlobalContainerStyle.rowCenterBetween}>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ababab", 0.8), padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                    <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#ababab", -0.1)} />
                    <TextBase text="Keine Verknüpfungen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ababab", -0.1) }]} />
                  </View>
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ea7373", 0.8), padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                    <FontAwesomeIcon icon={faAlarmClock as IconProp} size={10} color={shadeColor("#ea7373", -0.1)} />
                    <TextBase text="Bald verfügbar" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ea7373", -0.1) }]} />
                  </View>
                </View>
                  <TouchableHapticGmail grantScopeGmail={true} />
                </View>
              </View>
            </View>
          </View>

      </ListItemGroup>

        {/*<ListItemWithChildren
          image={PNG_ASSETS.googleCalendar} 
          title={"Google Kalender"} 
          description={"Synchronisierung von Google Kalendern"}
          type={ListItemWithChildrenTypeEnum.custom}
          right={<TouchableHapticSwitch state={true} onStateChange={() => {}} />}
          top={
            <View style={GlobalContainerStyle.rowCenterBetween}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#159F85", 0.8), padding: 6, paddingVertical: 2, borderRadius: 4 }]}>
                <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#159F85", -0.1)} />
                <TextBase text="Aktive Verknüpfungen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#159F85", -0.1) }]} />
              </View>
              <TouchableHapticGoogle />
            </View>
          } />
          <Divider />
          <ListItemWithChildren
          image={PNG_ASSETS.googleMeet} 
          title={"Google Meet"} 
          description={"Videokonferenz- und Instant-Messaging-Dienst "}
          type={ListItemWithChildrenTypeEnum.custom}
          right={<TouchableHapticSwitch state={false} onStateChange={() => {}} />}
          bottom={
            <TextBase text="Aktivierung von Online-Besprechungen über Google Meet für Termintypen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9 }]} />
        } />
          <Divider />
        <ListItemWithChildren
          image={PNG_ASSETS.googleMail} 
          title={"Google Gmail"} 
          description={"Personalisierter E-Mail-Versand"}
          type={ListItemWithChildrenTypeEnum.custom}
          right={<TouchableHapticSwitch state={false} onStateChange={() => {}} />}
          top={
            <View style={GlobalContainerStyle.rowCenterBetween}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ababab", 0.8), padding: 6, paddingVertical: 2, borderRadius: 4 }]}>
                  <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#ababab", -0.1)} />
                  <TextBase text="Keine Verknüpfungen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ababab", -0.1) }]} />
                </View>
              </View>
              <TouchableHapticGmail grantScopeGmail={true} />
            </View>
          }
          bottom={
              <TextBase text="E-Mails welche über einen Workflow ausgelöst werden, sind über das verknüpfte Gmail Konto personalisiert. Standard-E-Mail-Vesand: notifications@bloxie.ch." type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9 }]} />
          } />
          
      </ListItemGroup>
      <ListItemGroup 
        title={"i18n.screens.trayAction.items.integration.group2.title"}
        gap={STYLES.sizeGap}>        
        <ListItemWithChildren
          image={PNG_ASSETS.microsoftOutlook} 
          title={"Microsoft Outlook"} 
          description={"Synchronisierung von Office 365 Kalendern"}
          type={ListItemWithChildrenTypeEnum.custom}
          right={<TouchableHapticSwitch state={false} onStateChange={() => {}} />}
          top={
            <View style={GlobalContainerStyle.rowCenterBetween}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ea7373", 0.8), padding: 6, paddingVertical: 2, borderRadius: 4 }]}>
                  <FontAwesomeIcon icon={faAlarmClock as IconProp} size={10} color={shadeColor("#ea7373", -0.1)} />
                  <TextBase text="Bald verfügbar" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ea7373", -0.1) }]} />
                </View>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ababab", 0.8), padding: 6, paddingVertical: 2, borderRadius: 4 }]}>
                  <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#ababab", -0.1)} />
                  <TextBase text="Keine Verknüpfungen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ababab", -0.1) }]} />
                </View>
              </View>
              <TouchableHapticGoogle />
            </View>
          } 
          bottom={
              <TextBase text="Für die Synchronisierung von Microsoft Outlook Geschäftskonten muss Bloxie als autorisierte Anwendung hinzugefügt werden." type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9 }]} />
          } />
        </ListItemGroup>*/}
        {/*<ListItemGroup 
        title={"i18n.screens.trayAction.items.integration.group4.title"}
        gap={STYLES.sizeGap}>        
        <ListItemWithChildren
          image={PNG_ASSETS.slackCalendar} 
          title={"Slack Kalender"} 
          description={"Synchronisierung von Slack Kalendern"}
          type={ListItemWithChildrenTypeEnum.custom}
          right={<TouchableHapticSwitch state={false} onStateChange={() => {}} />}
          top={
            <View style={GlobalContainerStyle.rowCenterBetween}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ea7373", 0.8), padding: 6, paddingVertical: 2, borderRadius: 4 }]}>
                  <FontAwesomeIcon icon={faAlarmClock as IconProp} size={10} color={shadeColor("#ea7373", -0.1)} />
                  <TextBase text="Bald verfügbar" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ea7373", -0.1) }]} />
                </View>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ababab", 0.8), padding: 6, paddingVertical: 2, borderRadius: 4 }]}>
                  <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#ababab", -0.1)} />
                  <TextBase text="Keine Verknüpfungen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ababab", -0.1) }]} />
                </View>
              </View>
              <TouchableHapticGoogle />
            </View>
          }  />
          <Divider />
        <ListItemWithChildren
          image={PNG_ASSETS.paypalPayments} 
          title={"PayPal - Bezahldienst"} 
          description={"Empfangen von Zahlungen für kostenpflichtige Termine"}
          type={ListItemWithChildrenTypeEnum.custom}
          right={<TouchableHapticSwitch state={false} onStateChange={() => {}} />}
          top={
            <View style={GlobalContainerStyle.rowCenterBetween}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ea7373", 0.8), padding: 6, paddingVertical: 2, borderRadius: 4 }]}>
                  <FontAwesomeIcon icon={faAlarmClock as IconProp} size={10} color={shadeColor("#ea7373", -0.1)} />
                  <TextBase text="Bald verfügbar" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ea7373", -0.1) }]} />
                </View>
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ababab", 0.8), padding: 6, paddingVertical: 2, borderRadius: 4 }]}>
                  <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#ababab", -0.1)} />
                  <TextBase text="Keine Verknüpfungen" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ababab", -0.1) }]} />
                </View>
              </View>
              <TouchableHapticGoogle />
            </View>
          }  />
        </ListItemGroup>*/}
      </View>;
  const hContentRight = () => 
  
  
  
<View style={{ paddingHorizontal: STYLES.paddingHorizontal, paddingVertical: STYLES.paddingVertical + 4, gap: STYLES.sizeGap }}>

<ListItemGroup 
  title={"i18n.screens.trayAction.items.integration.connections.group1.title"}
  gap={STYLES.sizeGap}>   
{integrations.map((integration, index) => (
  <View style={{ gap: STYLES.sizeGap}}>

      <View style={{ borderRadius: 10, backgroundColor: secondaryBgColor, padding: 2 }}>
        <View style={[GlobalContainerStyle.rowCenterBetween, { paddingHorizontal: 8 }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
          <Image source={PNG_ASSETS.googleCalendar} style={{ height: STYLES.sizeFaIcon + 18, width: STYLES.sizeFaIcon + 16 }} resizeMode="cover"/>
          <View style={{ gap: 1 }}>
            <TextBase text={integration.email} type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: infoColor }]} />
            <TextBase text="Letzte Synchronisation vor 5 Minuten" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor(infoColor, 0.3) }]} />
          </View>
        </View>
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
    
              <TouchableHaptic
              onPress={async () => { 
                await unlinkGoogleAccount({ providerId: integration.providerId, open });
                close();
                
              }}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor(errorColor, 0.8), padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                <FontAwesomeIcon icon={faLinkSlash as IconProp} size={11} color={shadeColor(errorColor, -0.1)} />
                <TextBase text="Trennen" i18nTranslation={false} type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor(errorColor, -0.1) }]} />
              </View>
              </TouchableHaptic>
            </View>
        </View>

        <View style={{ backgroundColor: tertiaryBgColor, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 0.5, borderColor: primaryBorderColor,
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
        }}>

        <View style={{ gap: 4 }}>

              <View style={[GlobalContainerStyle.rowCenterBetween]}>
                
                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, flexWrap: "wrap" }]}>
                  {integration.calendars?.map((calendar) => (
                    <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#159F85", 0.8), padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                      <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#159F85", -0.1)} />
                      <TextBase text={calendar.description} type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#159F85", -0.1) }]} />
                    </View>
                  ))}
                </View>

                <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                  <Divider vertical />
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: integration.hasMailPermission ? focusedBgColor : shadeColor("#ababab", 0.7), padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                    <FontAwesomeIcon icon={faPaperPlane as IconProp} size={10} color={integration.hasMailPermission ? focusedContentColor : shadeColor("#ababab", -0.1)} />
                    <TextBase text="Gmail" type="label" style={[{ fontSize: 10, color: integration.hasMailPermission ? focusedContentColor : shadeColor("#ababab", -0.1) }]} />
                  </View>
                </View>

              </View>
          </View>
        </View>
      </View>


    {/*<ListItemWithChildren
      image={PNG_ASSETS.googleCalendar} 
      title={integration.email} 
      description={"Letzte Synchronisation vor 5 Minuten"}
      type={ListItemWithChildrenTypeEnum.custom}
      top={
        <View style={GlobalContainerStyle.rowCenterBetween}>
          <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#ababab", 0.8), padding: 6, paddingVertical: 2, borderRadius: 4 }]}>
            <TextBase text="Synchronisierte Ereignisse:" i18nTranslation={false} type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ababab", -0.1) }]} />
            <TextBase text={integration.calendars?.reduce((acc, calendar) => acc + (calendar.eventsCount ?? 0), 0).toString() ?? "0"} type="label" style={[GlobalTypographyStyle.headerSubtitle, { fontSize: 9, fontWeight: "bold", color: shadeColor("#ababab", -0.1) }]} />
            </View>

            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor(integration.hasMailPermission ? successColor : errorColor, 0.8), padding: 6, paddingVertical: 2, borderRadius: 4 }]}>
              <FontAwesomeIcon icon={faPaperPlane as IconProp} size={10} color={shadeColor(integration.hasMailPermission ? successColor : errorColor, -0.1)} />
              <TextBase text="Gmail" type="label" style={[{ fontSize: 10, color: shadeColor(integration.hasMailPermission ? successColor : errorColor, -0.1) }]} />
            </View>
          </View>
          <View style={[GlobalContainerStyle.rowCenterStart, { gap: 14 }]}>
            <TouchableHapticIcon
              icon={faLinkSlash as IconProp}
              iconSize={12}
              iconColor={linkColor}
              hideBorder={true}
              hasViewCustomStyle={true}
              onPress={() => { unlinkGoogleAccount({ providerId: integration.providerId }); }}
            />
          </View>
        </View>

      }
      bottom={
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
          {integration.calendars?.map((calendar) => (
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: shadeColor("#159F85", 0.8), padding: 6, paddingVertical: 2, borderRadius: 4 }]}>
              <FontAwesomeIcon icon={faLink as IconProp} size={12} color={shadeColor("#159F85", -0.1)} />
              <TextBase text={calendar.description} type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#159F85", -0.1) }]} />
            </View>
          ))}
        </View>
        /*<View style={[GlobalContainerStyle.columnStartStart, { gap: 4 }]}>
          <TextBase text="Synchronisierte Kalender:" i18nTranslation={false} type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: textColor }]} />
          {integration.calendars?.map((calendar) => (
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 2 }]}>
              <TouchableCheckbox 
              item={{ title: calendar.description, color: linkColor }} 
              textComponent={<View style={{ paddingHorizontal: 4 }}>
                <TextBase text={calendar.description} type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 9 }]} />
              </View>} />
            </View>
          ))}
        </View>*
      } />*/}
      {index !== integrations.length - 1 && <Divider />}
    </View>
    ))}
  </ListItemGroup>
  </View>
    ;

    const hContentRight1 = () => <View></View>
    /** 
   * @description The scene renderer for the horizontal navigation
   * -> Handles the rendering of the horizontal navigation content
   * @see {@link https://reactnavigation.org/docs/tab-based-navigation#scene-map} */
   const renderScene = React.useMemo(() => SceneMap({
    provider: hContentLeft,
    connections: hContentRight,
    synchronization: hContentRight1
  }), []);

  const navigationState = React.useMemo(() => ({
    index: 0,
    routes: [
      { key: "provider", title: "Provider", index: 0 },
      { key: "connections", title: "Verknüpfungen", index: 1 },
      { key: "synchronization", title: "Synchronisation", index: 2 },
    ],
  }), []);

  return (
    <ViewBase style={{  }}>
      <HorizontalNavigation 
        renderScene={renderScene}
        navigationState={navigationState} />
    </ViewBase>
  )
}

export default ScreenConfigurationIntegration;