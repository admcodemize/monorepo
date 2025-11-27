import React from "react";
import { Image, ImageSourcePropType, ScrollView, View } from "react-native"
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAlarmClock, faLink } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ReactAction, useAction, useQuery } from "convex/react";

import { STYLES } from "@codemize/constants/Styles"
import { shadeColor } from "@codemize/helpers/Colors";

import { api } from "../../../../../../../packages/backend/convex/_generated/api";
import { Id } from "../../../../../../../packages/backend/convex/_generated/dataModel";
import { ConvexSettingsAPIProps } from "@codemize/backend/Types";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useIntegrationContextStore } from "@/context/IntegrationContext";
import { PROVIDER_ITEMS_GOOGLE, PROVIDER_ITEMS_MICROSOFT, PROVIDER_ITEMS_OTHERS, ProviderEnum, ProviderIntegrationEnum } from "@/constants/Provider";
import { useUserContextStore } from "@/context/UserContext";
import { handleConvexError } from "@/helpers/Convex";

import ListItemGroup from "@/components/container/ListItemGroup";
import TouchableHapticSwitch from "@/components/button/TouchableHapticSwitch";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import ProviderStyle from "@/styles/screens/private/modal/configuration/integration/Provider";
import { update } from "../../../../../../../packages/backend/convex/sync/settings/action";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.1
 * @type */
type ScreenConfigurationIntegrationProviderItemProps = {
  integrationKey: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
  info?: string;
  state: boolean;
  hasConnections?: boolean;
  isCommingSoon?: boolean;
  onStateChange: (state: boolean) => void | Promise<void>;
  children?: React.ReactNode;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.1
 * @component */
const ScreenConfigurationIntegrationProvider = () => {
  /**
   * @description Get the settings from the context for updating the integration state
   * @see {@link context/UserContext} */
  const settings = useUserContextStore((state) => state.settings);

  /**
   * @description Get the integrations from the context for updating the UI/UX accordingly
   * @see {@link context/IntegrationContext} */
  const integrations = useIntegrationContextStore((state) => state.integrations);

  /** @description Used for updating the integration state for the currently signed in user */
  const update: ReactAction<typeof api.sync.settings.action.update> = useAction(api.sync.settings.action.update);

  /**
   * @description Handles the state change for the integration
   * @param {ProviderIntegrationEnum} integrationKey - The integration key to update the state for
   * @param {boolean} nextState - The new state to set for the integration
   * @todo
   * @function */
  const onStateChange = 
    (integrationKey: ProviderIntegrationEnum) => 
    async (nextState: boolean) => {
      if (!settings?._id || !settings?.userId) return;

      const { hasErr, err } = await update({
        _id: settings?._id as Id<"settings">,
        userId: settings?.userId as Id<"users">,
        integrations: settings?.integrations?.length === 0 ? [{
          integrationKey: integrationKey,
          state: nextState
        }] : [...(settings?.integrations || []), {
          integrationKey: integrationKey,
          state: nextState
        }]
    });
    console.log(hasErr, err);
  };

  /**
   * @description Checks if the Google integration has connections based on the integration key
   * -> Example: If the integration key is ProviderIntegrationEnum.GOOGLE_CALENDAR, it will check if the user has connected to any Google Calendar.
   * @param {string} integrationKey - The integration key to check for connections
   * @function */
  const hasGoogleConnections = (
    integrationKey: ProviderIntegrationEnum
  ) => integrationKey === ProviderIntegrationEnum.GOOGLE_CALENDAR 
    ? integrations.some((integration) => integration.provider === ProviderEnum.GOOGLE) 
    : integrationKey === ProviderIntegrationEnum.GOOGLE_GMAIL
      ? integrations.some((integration) => integration.provider === ProviderEnum.GOOGLE && integration.hasMailPermission) 
      : false;

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={ProviderStyle.view}>
        <ListItemGroup 
          title={"i18n.screens.integrations.provider.google.title"}
          gap={STYLES.sizeGap}>
            {PROVIDER_ITEMS_GOOGLE.map((item) => (
              <ScreenConfigurationIntegrationProviderItem
                key={item.integrationKey}
                {...item}
                hasConnections={hasGoogleConnections(item.integrationKey)}
                onStateChange={onStateChange(item.integrationKey)}/>
            ))}
        </ListItemGroup>
        <ListItemGroup 
          title={"i18n.screens.integrations.provider.microsoft.title"}
          gap={STYLES.sizeGap}>
            {PROVIDER_ITEMS_MICROSOFT.map((item) => (
              <ScreenConfigurationIntegrationProviderItem
                key={item.integrationKey}
                {...item}
                onStateChange={onStateChange(item.integrationKey)} />
            ))}
        </ListItemGroup>
        <ListItemGroup 
          title={"i18n.screens.integrations.provider.others.title"}
          gap={STYLES.sizeGap}>
            {PROVIDER_ITEMS_OTHERS.map((item) => (
              <ScreenConfigurationIntegrationProviderItem
                key={item.integrationKey}
                {...item}
                onStateChange={onStateChange(item.integrationKey)} />
            ))}
        </ListItemGroup>
    </ScrollView>
  );
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.1
 * @param {ScreenConfigurationIntegrationProviderItemProps} param0
 * @param {ImageSourcePropType} param0.image - The image source of the item.
 * @param {string} param0.title - The title of the item.
 * @param {string} param0.description - The description of the item.
 * @param {string} param0.info - The info of the item.
 * @param {boolean} param0.state - The state of the item.
 * @param {boolean} param0.hasConnections - Whether the item has connections.
 * @param {boolean} param0.isCommingSoon - Whether the item is already available or coming soon.
 * @param {(state: boolean) => void|Promise<void>} param0.onStateChange - The function to call when the state changes.
 * @param {React.ReactNode} param0.children - The custom children to display on the right side of the item.
 * @component */
const ScreenConfigurationIntegrationProviderItem = ({
  image,
  title,
  description,
  info,
  state,
  onStateChange,
  hasConnections = false,
  isCommingSoon = false,
  children
}: ScreenConfigurationIntegrationProviderItemProps) => {
  const { secondaryBgColor, infoColor, tertiaryBgColor, primaryBorderColor, successColor, errorColor } = useThemeColors();

  return (
    <View style={[ProviderStyle.item, { backgroundColor: secondaryBgColor }]}>
      <View style={[GlobalContainerStyle.rowCenterBetween, ProviderStyle.itemHeader]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
          <Image source={image} style={ProviderStyle.itemImage} resizeMode="cover"/>
          <View style={{ gap: 1 }}>
            <TextBase 
              text={title} 
              type="label" 
              style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: infoColor }]} />
            <TextBase 
              text={description} 
              type="label" 
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor(infoColor, 0.3) }]} />
          </View>
        </View>
        <TouchableHapticSwitch 
          state={state} 
          onStateChange={onStateChange} />
      </View>
      <View style={[ProviderStyle.itemBottom, {
        backgroundColor: tertiaryBgColor, 
        borderColor: primaryBorderColor
      }]}>
        <View style={{ gap: 4 }}>
          <View style={GlobalContainerStyle.rowCenterBetween}>
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
              {!hasConnections && <View style={[GlobalContainerStyle.rowCenterStart, ProviderStyle.itemBottomContent, { backgroundColor: shadeColor("#ababab", 0.8) }]}>
                <FontAwesomeIcon 
                  icon={faLink as IconProp} 
                  size={12} 
                  color={shadeColor("#ababab", -0.1)} />
                <TextBase 
                  text={"i18n.screens.integrations.noConnections"} 
                  type="label" 
                  style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor("#ababab", -0.1) }]} />
              </View>}
              {hasConnections && <View style={[GlobalContainerStyle.rowCenterStart, ProviderStyle.itemBottomContent, { backgroundColor: shadeColor(successColor, 0.8) }]}>
                <FontAwesomeIcon 
                  icon={faLink as IconProp} 
                  size={12} 
                  color={shadeColor(successColor, -0.1)} />
                <TextBase 
                  text={"i18n.screens.integrations.activeConnections"} 
                  type="label" 
                  style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor(successColor, -0.1) }]} />
              </View>}
              {isCommingSoon && <View style={[GlobalContainerStyle.rowCenterStart, ProviderStyle.itemBottomContent, { backgroundColor: shadeColor(errorColor, 0.8) }]}>
                <FontAwesomeIcon
                  icon={faAlarmClock as IconProp} 
                  size={10} 
                  color={shadeColor(errorColor, -0.1)} />
                <TextBase 
                  text={"i18n.global.comingSoon"} 
                  type="label" 
                  style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: shadeColor(errorColor, -0.1) }]} />
              </View>}
            </View>
            {children && state && children}
          </View>
          {info && <TextBase 
            text={info} 
            type="label" 
            style={[GlobalTypographyStyle.labelText, { fontSize: 9 }]} />}
        </View>
      </View>
  </View>
  );
};

export default ScreenConfigurationIntegrationProvider;