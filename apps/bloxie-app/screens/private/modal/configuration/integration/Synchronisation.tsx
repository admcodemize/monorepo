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
import { useMutation } from "convex/react";
import { api } from "../../../../../../../packages/backend/convex/_generated/api";
import { ConvexCalendarAPIProps, ConvexCalendarQueryAPIProps } from "@codemize/backend/Types";
import React from "react";


const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.19
 * @version 0.0.1
 * @description The screen for the integration connection
 * @component */
const ScreenConfigurationIntegrationSynchronisation = (

) => {
  const { secondaryBgColor, infoColor, tertiaryBgColor, primaryBorderColor, focusedBgColor, focusedContentColor, linkColor, successColor } = useThemeColors();
  const { t } = useTranslation();

  /**
   * @description Get the integrations from the context for updating the UI/UX accordingly
   * @see {@link context/IntegrationContext} */
  const integrations = useIntegrationContextStore((state) => state.integrations);

  /**
   * @description Get the convex user from the context for unlinking an account
   * @see {@link context/ConvexUserContext} */
  const { convexUser } = useConvexUser();

  /**
   * @description Get the mutation function for updating a calendar property such as the relevant for conflict detection
   * @see {@link backend/convex/sync/integrations/mutation} */
  const updateCalendarProperty = useMutation(api.sync.integrations.mutation.updateCalendarProperty);

  /** @description Get the callback function for updating the relevant for conflict detection */
  const update = React.useCallback( 
    (calendarId: Id<"calendar">) => 
    async(isActive: boolean) => {
      await updateCalendarProperty({ 
        _id: calendarId, 
        property: "isRelevantForSynchronization", 
        value: isActive 
      });
  }, [updateCalendarProperty]);

  return (
    <View style={{ 
      paddingHorizontal: STYLES.paddingHorizontal, 
      paddingVertical: STYLES.paddingVertical + 4, 
      gap: STYLES.sizeGap + 4, 
      width: DIM.width,
    }}>
      <TextBase text="Aktiviere einen oder mehrere Kalender für das Synchronisieren von neuen Kalenderereignissen aus Bloxie" type="label" style={[GlobalTypographyStyle.labelText, { fontSize: 10, color: infoColor }]} />
      <ListItemGroup 
        title={"i18n.screens.integrations.synchronization.groupTitle"}
        gap={STYLES.sizeGap}>   
          {integrations.map((integration) => (
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
  
                  </View>

                  <View style={{ backgroundColor: shadeColor(tertiaryBgColor, 0.8), paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 0.5, borderColor: primaryBorderColor,
                    borderTopRightRadius: 8,
                    borderTopLeftRadius: 8,
                  }}>

                    <View style={{ gap: 4 }}>

                      <View style={[GlobalContainerStyle.rowStartBetween]}>
                
                        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, flexWrap: "wrap" }]}>
                          {integration.calendars?.map((calendar) => (
                            <TouchableTag
                              key={`${KEYS.integrationConnectionCalendar}-${calendar._id}`}
                              icon={faLink as IconProp}
                              text={calendar.description}
                              colorActive={linkColor}
                              isActive={calendar.isRelevantForSynchronization}
                              onPress={update(calendar._id as Id<"calendar">)} />
                          ))}
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

export default ScreenConfigurationIntegrationSynchronisation;