import { PNG_ASSETS } from "@/assets/png";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import Divider from "@/components/container/Divider";
import ListItemGroup from "@/components/container/ListItemGroup";
import TextBase from "@/components/typography/Text";
import { useIntegrationContextStore } from "@/context/IntegrationContext";
import { useToastStore } from "@/context/ToastContext";
import { unlinkGoogleAccount } from "@/helpers/Provider";
import { useConvexUser } from "@/hooks/auth/useConvexUser";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import { STYLES } from "@codemize/constants/Styles";
import { shadeColor } from "@codemize/helpers/Colors";
import { faLink, faLinkSlash, faPaperPlane } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Dimensions, Image, View } from "react-native";
import { Id } from "../../../../../../../packages/backend/convex/_generated/dataModel";
import { KEYS } from "@/constants/Keys";
import TouchableTag from "@/components/button/TouchableTag";
import ScreenConfigurationIntegrationConnectionStyle from "@/styles/screens/private/modal/configuration/integration/Connection";
import { formatDistanceToNow } from "date-fns";
import { getLocalization } from "@/helpers/System";
import { t } from "i18next";
import { useTranslation } from "react-i18next";


const DIM = Dimensions.get("window");

const ScreenConfigurationIntegrationConnection = () => {
  const integrations = useIntegrationContextStore((state) => state.integrations);
  const { secondaryBgColor, infoColor, tertiaryBgColor, primaryBorderColor, focusedBgColor, focusedContentColor, errorColor, linkColor, successColor } = useThemeColors();
  const { convexUser } = useConvexUser();
  const { open, close } = useToastStore((state) => state);
  const { t } = useTranslation();
  return (
    <View style={{ 
      paddingHorizontal: STYLES.paddingHorizontal, 
      paddingVertical: STYLES.paddingVertical + 4, 
      gap: STYLES.sizeGap, 
      width: DIM.width
    }}>
      <ListItemGroup 
        title={"i18n.screens.integrations.connection.groupTitle"}
        gap={STYLES.sizeGap}>   
          {integrations.map((integration, index) => (
            <View 
              key={`${KEYS.integrationConnection}-${integration._id}`}
              style={{ gap: STYLES.sizeGap }}>
                <View style={[ScreenConfigurationIntegrationConnectionStyle.viewHeader, { 
                  backgroundColor: secondaryBgColor 
                }]}>

                  <View style={[ScreenConfigurationIntegrationConnectionStyle.viewHeaderContent, GlobalContainerStyle.rowCenterBetween]}>
                    <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                      <Image 
                        source={PNG_ASSETS.googleCalendar} 
                        style={[ScreenConfigurationIntegrationConnectionStyle.image]} 
                        resizeMode="cover"/>
                      <View style={{ gap: 1 }}>
                        <TextBase 
                          text={integration.email} 
                          type="label" 
                          style={[GlobalTypographyStyle.textSubtitle, { color: infoColor }]} />
                        <TextBase 
                          text={integration.lastSync ? `${t("i18n.screens.integrations.connection.lastSync", { time: formatDistanceToNow(integration.lastSync, { locale: getLocalization() }) })}` : t("i18n.screens.integrations.connection.noSync")} 
                          type="label" 
                          style={[GlobalTypographyStyle.labelText, { color: shadeColor(infoColor, 0.3) }]} />
                      </View>
                    </View>
                    <TouchableHaptic
                      onPress={async () => { 
                        if (!convexUser?._id) return;
                        await unlinkGoogleAccount({ userId: convexUser._id as Id<"users">, providerId: integration.providerId, open });
                        close();
                      }}>
                        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, backgroundColor: focusedBgColor, padding: 6, paddingVertical: 4, borderRadius: 4 }]}>
                          <FontAwesomeIcon icon={faLinkSlash as IconProp} size={11} color={focusedContentColor} />
                          <TextBase text={"i18n.screens.integrations.connection.disconnect"} style={[GlobalTypographyStyle.labelText, { color: focusedContentColor }]} />
                        </View>
                    </TouchableHaptic>
                  </View>

                  <View style={{ backgroundColor: shadeColor(tertiaryBgColor, 0.8), paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 0.5, borderColor: primaryBorderColor,
                    borderTopRightRadius: 8,
                    borderTopLeftRadius: 8,
                  }}>

                    <View style={{ gap: 4 }}>

                      <View style={[GlobalContainerStyle.rowStartBetween]}>
                
                        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, flexWrap: "wrap", maxWidth: "80%" }]}>
                          {integration.calendars?.map((calendar) => (
                            <TouchableTag
                              key={`${KEYS.integrationConnectionCalendar}-${calendar._id}`}
                              icon={faLink as IconProp}
                              text={calendar.description}
                              colorActive={linkColor}
                              isActive={true}
                              onPress={() => {
                                console.log("calendar", calendar);
                              }} />
                          ))}
                        </View>
                        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                          <Divider vertical />
                          <TouchableTag
                            icon={faPaperPlane as IconProp}
                            text="Gmail"
                            colorActive={successColor}
                            isActive={integration.hasMailPermission}
                            disabled={true}
                          />
                        </View>

                      </View>
                    </View>
                  </View>
                </View>
            </View>
          ))}
        </ListItemGroup>
      </View>
  );
};

export default ScreenConfigurationIntegrationConnection;