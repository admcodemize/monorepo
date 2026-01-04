import React from "react";
import { Image, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { faCloud, faCloudSlash, faPaperPlane } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { useMutation } from "convex/react";
import { Id } from "../../../../../../../packages/backend/convex/_generated/dataModel";
import { api } from "../../../../../../../packages/backend/convex/_generated/api";

import { shadeColor } from "@codemize/helpers/Colors";
import { STYLES } from "@codemize/constants/Styles";
import { ConvexCalendarAPIProps, ConvexCalendarQueryAPIProps } from "@codemize/backend/Types";

import { PNG_ASSETS } from "@/assets/png";
import { KEYS } from "@/constants/Keys";
import { unlinkGoogleAccount } from "@/helpers/Provider";

import { useConvexUser } from "@/hooks/auth/useConvexUser";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useIntegrationContextStore } from "@/context/IntegrationContext";
import { useToastStore } from "@/context/ToastContext";

import TouchableHaptic from "@/components/button/TouchableHaptic";
import Divider from "@/components/container/Divider";
import ListItemGroup from "@/components/container/ListItemGroup";
import TextBase from "@/components/typography/Text";
import TouchableTag from "@/components/button/TouchableTag";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import ScreenConfigurationIntegrationConnectionStyle from "@/styles/screens/private/modal/configuration/integration/Connection";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.20
 * @version 0.0.1
 * @type */
type IntegrationHeaderProps = {
  integration: ConvexCalendarQueryAPIProps;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.20
 * @version 0.0.1
 * @type */
type IntegrationScopeProps = {
  integrationId: Id<"linked">,
  scopes: string[];
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.20
 * @version 0.0.1
 * @type */
type IntegrationCalendarProps = {
  calendars: ConvexCalendarAPIProps[];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.19
 * @version 0.0.3
 * @description The screen for the integration connection
 * @component */
const ScreenConfigurationIntegrationConnection = (
) => {
  const { secondaryBgColor, primaryBorderColor } = useThemeColors();
  /**
   * @description Get the integrations from the context for updating the UI/UX accordingly
   * @see {@link context/IntegrationContext} */
  const integrations = useIntegrationContextStore((state) => state.integrations);

  return (
    <View style={ScreenConfigurationIntegrationConnectionStyle.view}>
      <ListItemGroup 
        title={"i18n.screens.integrations.connection.groupTitle"}
        gap={STYLES.sizeGap}>   
          {integrations.map((integration) => (
            <View 
              key={`${KEYS.integrationConnection}-${integration._id}`}
              style={{ gap: STYLES.sizeGap }}>
                <View style={[ScreenConfigurationIntegrationConnectionStyle.viewHeader, { 
                  backgroundColor: shadeColor(secondaryBgColor, 0.3), 
                  borderColor: primaryBorderColor
                }]}>
                  <IntegrationHeader integration={integration} />
                  <IntegrationScope 
                    integrationId={integration._id as Id<"linked">}
                    scopes={integration.scopes ?? []} />
                  <IntegrationCalendar calendars={integration.calendars ?? []} />
                </View>
            </View>
          ))}
        </ListItemGroup>
      </View>
  );
};

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.20
 * @version 0.0.1
 * @param {object} param0
 * @param {ConvexCalendarQueryAPIProps} param0.integration - The integration to display
 * @component */
const IntegrationHeader = ({
  integration
}: IntegrationHeaderProps) => {
  const { infoColor, focusedBgColor, focusedContentColor, primaryBorderColor, secondaryBgColor } = useThemeColors();
  const { t } = useTranslation();

  /**
   * @description Get the convex user from the context for unlinking an account
   * @see {@link context/ConvexUserContext} */
  const { convexUser } = useConvexUser();

  /**
   * @description Get the toast store from the context for displaying a progress toast during the unlinking of an account
   * @see {@link context/ToastContext} */
  const { open, close } = useToastStore((state) => state);

  /** @description Get the callback function for unlinking an account */
  const unlink = 
    (providerId: string) => 
    async() => {
      if (!convexUser?._id) return;
      await unlinkGoogleAccount({ userId: convexUser._id as Id<"users">, providerId, open });
      close();
    };

  return (
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
            text={`${integration.calendars?.reduce((acc, calendar) => acc + (calendar.eventsCount ?? 0), 0) ?? 0} ${t("i18n.screens.integrations.connection.events")} • ${integration.scopes?.length ?? 0} ${t("i18n.screens.integrations.connection.permissions")}`} 
            type="label" 
            style={[GlobalTypographyStyle.labelText, { color: shadeColor(infoColor, 0.3) }]} />
        </View>
      </View>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
        <TouchableTag
          icon={faPaperPlane as IconProp}
          text={integration.hasMailPermission ? t("i18n.global.active") : t("i18n.global.inactive")}
          colorActive={infoColor}
          colorInactive={infoColor}
          isActive={integration.hasMailPermission}
          disabled={true} />
        <Divider vertical />
        <TouchableHaptic
          onPress={unlink(integration.providerId)}>
            <View style={[GlobalContainerStyle.rowCenterStart, ScreenConfigurationIntegrationConnectionStyle.viewHeaderContentTouchable, { 
              backgroundColor: focusedBgColor 
            }]}>
              <FontAwesomeIcon 
                icon={faCloudSlash as IconProp} 
                size={12} 
                color={focusedContentColor} />
            </View>
        </TouchableHaptic>
      </View>
    </View>
  )
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.20
 * @version 0.0.1
 * @param {object} param0
 * @param {Id<"linked">} param0.integrationId - The integration id -> Used for the view's key inside scrollview
 * @param {string[]} param0.scopes - The scopes to display
 * @component */
const IntegrationScope = ({ 
  integrationId,
  scopes
}: IntegrationScopeProps) => {
  const { primaryBgColor, primaryBorderColor, infoColor } = useThemeColors();
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={ScreenConfigurationIntegrationConnectionStyle.scrollView}
      contentContainerStyle={{ gap: 4 }}>
        {scopes
        .sort((a, b) => a.localeCompare(b))
        .map((scope) => (
          <View 
            key={`${KEYS.integrationConnectionScope}-${integrationId}-${scope}`}
            style={[GlobalContainerStyle.rowCenterStart, ScreenConfigurationIntegrationConnectionStyle.scopeItem, { 
              backgroundColor: primaryBgColor,
              borderColor: primaryBorderColor,
            }]}>
            <TextBase 
              text={scope} 
              type="label" 
              style={[GlobalTypographyStyle.labelText, { color: infoColor }]} />
          </View>
        ))}
    </ScrollView>
  )
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.20
 * @version 0.0.1
 * @param {object} param0
 * @param {ConvexCalendarAPIProps[]} param0.calendars - The calendars to display based on the integrated providers
 * @component */
const IntegrationCalendar = ({ 
  calendars
}: IntegrationCalendarProps) => {
  const { tertiaryBgColor, primaryBorderColor, linkColor } = useThemeColors();

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
        property: "isRelevantForConflictDetection", 
        value: isActive 
      });
  }, [updateCalendarProperty]);

  return (
    <View style={[ScreenConfigurationIntegrationConnectionStyle.viewBottom, { 
      backgroundColor: shadeColor(tertiaryBgColor, 0.8), 
      borderColor: primaryBorderColor 
    }]}>
      <View style={{ gap: 4 }}>
        <View style={[GlobalContainerStyle.rowStartBetween]}>
          <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, flexWrap: "wrap", width: "100%" }]}>
            {calendars?.map((calendar) => (
              <TouchableTag
                key={`${KEYS.integrationConnectionCalendar}-${calendar._id}`}
                icon={faCloud as IconProp}
                text={calendar.description}
                colorActive={linkColor}
                isActive={calendar.isRelevantForConflictDetection}
                showActivityIcon={true}
                onPress={update(calendar._id as Id<"calendar">)} />
            ))}
          </View>
        </View>
      </View>
    </View>
    
  )
}

export default ScreenConfigurationIntegrationConnection;