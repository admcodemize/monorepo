import React from "react";
import { Image, View } from "react-native";
import { useTranslation } from "react-i18next";
import { faLink } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { formatDistanceToNow } from "date-fns";

import { useMutation } from "convex/react";
import { api } from "../../../../../../../packages/backend/convex/_generated/api";
import { Id } from "../../../../../../../packages/backend/convex/_generated/dataModel";

import { STYLES } from "@codemize/constants/Styles";
import { shadeColor } from "@codemize/helpers/Colors";
import { ConvexCalendarAPIProps, ConvexCalendarQueryAPIProps } from "@codemize/backend/Types";

import { PNG_ASSETS } from "@/assets/png";
import { KEYS } from "@/constants/Keys";

import ListItemGroup from "@/components/container/ListItemGroup";
import TextBase from "@/components/typography/Text";
import TouchableTag from "@/components/button/TouchableTag";

import { useIntegrationContextStore } from "@/context/IntegrationContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { getLocalization } from "@/helpers/System";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import ScreenConfigurationIntegrationSynchronisationStyle from "@/styles/screens/private/modal/configuration/integration/Synchronisation";

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
const ScreenConfigurationIntegrationSynchronisation = (
) => {
  const { secondaryBgColor, primaryBorderColor } = useThemeColors();

  /**
   * @description Get the integrations from the context for updating the UI/UX accordingly
   * @see {@link context/IntegrationContext} */
  const integrations = useIntegrationContextStore((state) => state.integrations);

  return (
    <View style={ScreenConfigurationIntegrationSynchronisationStyle.view}>
      <ListItemGroup 
        title={"i18n.screens.integrations.synchronization.groupTitle"}>   
          {integrations.map((integration) => (
            <View 
              key={`${KEYS.integrationConnection}-${integration._id}`}
              style={{ gap: STYLES.sizeGap }}>
                <View style={[ScreenConfigurationIntegrationSynchronisationStyle.viewHeader, { 
                  backgroundColor: shadeColor(secondaryBgColor, -0.01), 
                  borderColor: primaryBorderColor
                }]}>
                  <IntegrationHeader integration={integration} />
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
  const { infoColor } = useThemeColors();
  const { t } = useTranslation();

  return (
    <View style={[ScreenConfigurationIntegrationSynchronisationStyle.viewHeaderContent, GlobalContainerStyle.rowCenterBetween]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
        <Image 
          source={PNG_ASSETS.googleCalendar} 
          style={[ScreenConfigurationIntegrationSynchronisationStyle.image]} 
          resizeMode="cover"/>
        <View style={{ gap: 1 }}>
          <TextBase 
            text={integration.email} 
            type="label" 
            style={[GlobalTypographyStyle.textSubtitle, { color: infoColor }]} />
          <TextBase 
            text={integration.lastSync 
              ? `${t("i18n.screens.integrations.synchronization.lastSync", { time: formatDistanceToNow(integration.lastSync, { locale: getLocalization() }) })}` 
              : t("i18n.screens.integrations.synchronization.noSync")} 
            type="label" 
            style={[GlobalTypographyStyle.labelText, { color: shadeColor(infoColor, 0.3) }]} />
        </View>
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
  const update = 
    (calendarId: Id<"calendar">) => 
    async(isActive: boolean) => {
      await updateCalendarProperty({ 
        _id: calendarId, 
        property: "isRelevantForSynchronization", 
        value: isActive 
      });
    };

  return (
    <View style={[ScreenConfigurationIntegrationSynchronisationStyle.viewBottom, { 
      backgroundColor: shadeColor(tertiaryBgColor, 0.8), 
      borderColor: primaryBorderColor 
    }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4, flexWrap: "wrap", width: "100%" }]}>
        {calendars?.map((calendar) => (
          <TouchableTag
            key={`${KEYS.integrationConnectionCalendar}-${calendar._id}`}
            icon={faLink as IconProp}
            text={calendar.description}
            colorActive={linkColor}
            isActive={calendar.isRelevantForSynchronization}
            showActivityIcon={true}
            onPress={update(calendar._id as Id<"calendar">)} />
        ))}
      </View>
    </View>
  )
}

export default ScreenConfigurationIntegrationSynchronisation;