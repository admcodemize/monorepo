import React from "react";
import { Image, ImageSourcePropType, ScrollView, View } from "react-native"
import { useTranslation } from "react-i18next";
import { faAlarmClock, faCloud } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ReactAction, useAction } from "convex/react";

import { STYLES } from "@codemize/constants/Styles"
import { shadeColor } from "@codemize/helpers/Colors";
import { convertToCleanObjectForUpdate } from "@codemize/backend/Convert";

import { api } from "../../../../../../../packages/backend/convex/_generated/api";
import { Id } from "../../../../../../../packages/backend/convex/_generated/dataModel";
import { ConvexCalendarQueryAPIProps, ConvexSettingsAPIProps } from "@codemize/backend/Types";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useIntegrationContextStore } from "@/context/IntegrationContext";
import { getProviderItemsGoogle, PROVIDER_ITEMS_MICROSOFT, PROVIDER_ITEMS_OTHERS, ProviderEnum, ProviderIntegrationEnum, ProviderItemProps } from "@/constants/Provider";
import { useUserContextStore } from "@/context/UserContext";
import { handleConvexError } from "@/helpers/Convex";
import { KEYS } from "@/constants/Keys";

import ListItemGroup from "@/components/container/ListItemGroup";
import TouchableHapticSwitch from "@/components/button/TouchableHapticSwitch";
import TextBase from "@/components/typography/Text";
import TouchableTag from "@/components/button/TouchableTag";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import ProviderStyle from "@/styles/screens/private/modal/configuration/integration/Provider";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.16
 * @version 0.0.3
 * @type */
type ScreenConfigurationIntegrationProviderContextProps = {
  settings: ConvexSettingsAPIProps;
  integrations: ConvexCalendarQueryAPIProps[];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.17
 * @version 0.0.1
 * @type */
type ProviderGroupItemsProps = {
  title: string;
  items: ProviderItemProps[];
};

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.3
 * @type */
type ScreenConfigurationIntegrationProviderItemProps = ScreenConfigurationIntegrationProviderContextProps & {
  integrationKey: ProviderIntegrationEnum;
  image: ImageSourcePropType;
  title: string;
  description: string;
  info?: string;
  hasConnections?: boolean;
  isCommingSoon?: boolean;
  shouldBeCheckedForRuntime?: boolean;
  children?: React.ReactNode;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.4
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

  /** @description Handles the display of the individual provider groups with the corresponding integration items*/
  const providerItems: ProviderGroupItemsProps[] = React.useMemo(() => [{
    title: "i18n.screens.integrations.provider.google.title",
    items: getProviderItemsGoogle(settings?.userId as Id<"users">),
  }, {
    title: "i18n.screens.integrations.provider.microsoft.title",
    items: PROVIDER_ITEMS_MICROSOFT,
  }, {
    title: "i18n.screens.integrations.provider.others.title",
    items: PROVIDER_ITEMS_OTHERS 
  }], []);

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={ProviderStyle.view}>
        {providerItems.map((group) => ( 
          <ListItemGroup 
            key={`${KEYS.providerGroup}-${group.title}`}
            title={group.title}
            gap={STYLES.sizeGap}>
            {group.items.map((item) => (
              <ScreenConfigurationIntegrationProviderItem
                key={`${KEYS.providerGroupItem}-${item.integrationKey}`}
                {...item}
                settings={settings}
                integrations={integrations}
                hasConnections={hasGoogleConnections(item.integrationKey)}/>
            ))}
          </ListItemGroup>
        ))}
    </ScrollView>
  );
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.4
 * @param {ScreenConfigurationIntegrationProviderItemProps} param0
 * @param {ConvexSettingsAPIProps} param0.settings - The settings of the currently signed in user.
 * @param {ConvexCalendarQueryAPIProps[]} param0.integrations - The cnnected provider integrations of the currently signed in user.
 * @param {(settings: ConvexSettingsAPIProps) => void} param0.setSettings - The function to update the settings of the currently signed in user in the context.
 * @param {ProviderIntegrationEnum} param0.integrationKey - The integration key of the item for updating the state and fetching the state from the context.
 * @param {ImageSourcePropType} param0.image - The image source of the item.
 * @param {string} param0.title - The title of the item.
 * @param {string} param0.description - The description of the item.
 * @param {string} param0.info - The info of the item.
 * @param {boolean} param0.hasConnections - Whether the item has connections.
 * @param {boolean} param0.isCommingSoon - Whether the item is already available or coming soon.
 * @param {React.ReactNode} param0.children - The custom children to display on the right side of the item.
 * @component */
const ScreenConfigurationIntegrationProviderItem = ({
  settings,
  integrations,
  integrationKey,
  image,
  title,
  description,
  info,
  hasConnections = false,
  isCommingSoon = false,
  shouldBeCheckedForRuntime = false,
  children
}: ScreenConfigurationIntegrationProviderItemProps) => {
  const { secondaryBgColor, infoColor, tertiaryBgColor, primaryBorderColor, successColor, errorColor, inactiveColor, focusedBgColor } = useThemeColors();
  const { t } = useTranslation();

  /** @description Used for updating the integration state for the currently signed in user */
  const update: ReactAction<typeof api.sync.settings.action.update> = useAction(api.sync.settings.action.update);

  /**
   * @description Get the function to update the settings from the context for updating the integration state during the state change
   * @see {@link context/UserContext} */
  const setSettings = useUserContextStore((state) => state.setSettings);

  /**
   * @description Get the runtime from the context for checking if the user has reached the limit of linked provider integrations
   * @see {@link context/UserContext} */
  const runtime = useUserContextStore((state) => state.runtime);

  /**
   * @description Get the initial integration state for the given integration key
   * @param {ProviderIntegrationEnum} integrationKey - The integration key to get the state for
   * @function */
  const getIntegrationState = (integrationKey: ProviderIntegrationEnum) => settings?.integrations?.find((integration) => integration.integrationKey === integrationKey)?.state ?? false;

  /**
   * @description Handles the state change for the integration
   * @param {boolean} nextState - The next state of the integration
   * @function */
  const onStateChange = async (
    nextState: boolean
  ) => {
    const updatedIntegrations = settings?.integrations?.map((integration) => integration.integrationKey === integrationKey 
      ? { ...integration, state: nextState } 
      : integration) || settings?.integrations || [];

    /** 
     * @description Update the integration settingsstate for the currently signed in user
     * @see {@link backend/convex/sync/settings/action.ts} */
    const { hasErr, err } = await update({
      _id: settings?._id as Id<"settings">,
      ...convertToCleanObjectForUpdate({ ...settings, integrations: updatedIntegrations }),
    });

    if (hasErr) handleConvexError(err);
    else setSettings({ ...settings, integrations: updatedIntegrations });
  };

  return (
    <View style={[ProviderStyle.item, { backgroundColor: shadeColor(secondaryBgColor, 0.3), borderColor: primaryBorderColor, borderWidth: 0.5 }]}>
      <View style={[GlobalContainerStyle.rowCenterBetween, ProviderStyle.itemHeader]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
          <Image source={image} style={ProviderStyle.itemImage} resizeMode="cover"/>
          <View>
            <TextBase 
              text={title} 
              type="label" 
              style={[GlobalTypographyStyle.textSubtitle, { color: infoColor }]} />
            <TextBase 
              text={description} 
              type="label" 
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[GlobalTypographyStyle.labelText, { color: shadeColor(infoColor, 0.3) }]} />
          </View>
        </View>
        <TouchableHapticSwitch 
          disabled={isCommingSoon || hasConnections}
          state={getIntegrationState(integrationKey)} 
          onStateChange={onStateChange} />
      </View>
      {(info && ((shouldBeCheckedForRuntime && integrations.length >= runtime.license.counter.linkedProviderCount) || !shouldBeCheckedForRuntime)) && <TextBase 
        text={info} 
        type="label" 
        preText={t("i18n.global.hint")} 
        preTextStyle={{ color: infoColor }}
        style={[GlobalTypographyStyle.labelText, { paddingHorizontal: 8, paddingVertical: 4, color: shadeColor(infoColor, 0.3)}]} />}
      <View style={[ProviderStyle.itemBottom, {
        backgroundColor: shadeColor(tertiaryBgColor, 0.8), 
        borderColor: primaryBorderColor
      }]}>
        <View style={{ gap: 4 }}>
          <View style={GlobalContainerStyle.rowCenterBetween}>
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
              <TouchableTag
                icon={faCloud as IconProp}
                text={hasConnections ? "i18n.screens.integrations.activeConnections" : "i18n.screens.integrations.noConnections"}
                isActive={hasConnections}
                backgroundColor={hasConnections ? successColor : inactiveColor}
                disabled={true}/>
              {isCommingSoon && <TouchableTag
                icon={faAlarmClock as IconProp}
                text={"i18n.global.comingSoon"}
                colorInactive={errorColor}
                isActive={false}
                disabled={true}/>}
            </View>
            {children && getIntegrationState(integrationKey) && children}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ScreenConfigurationIntegrationProvider;