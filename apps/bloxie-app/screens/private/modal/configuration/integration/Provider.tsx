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
import { getProviderItemsGoogle, PROVIDER_ITEMS_GOOGLE, PROVIDER_ITEMS_MICROSOFT, PROVIDER_ITEMS_OTHERS, ProviderEnum, ProviderIntegrationEnum, ProviderItemProps } from "@/constants/Provider";
import { useUserContextStore } from "@/context/UserContext";
import { handleConvexError } from "@/helpers/Convex";

import ListItemGroup from "@/components/container/ListItemGroup";
import TouchableHapticSwitch from "@/components/button/TouchableHapticSwitch";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import ProviderStyle from "@/styles/screens/private/modal/configuration/integration/Provider";
import { update } from "../../../../../../../packages/backend/convex/sync/settings/action";
import { convertToCleanObjectForUpdate } from "@codemize/backend/Convert";
import { KEYS } from "@/constants/Keys";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.16
 * @version 0.0.1
 * @type */
type ScreenConfigurationIntegrationProviderContextProps = {
  settings: ConvexSettingsAPIProps;
  integrationSettings: ConvexSettingsAPIProps["integrations"];
  setIntegrationSettings: (integrationSettings: ConvexSettingsAPIProps["integrations"]) => void;
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
 * @version 0.0.2
 * @type */
type ScreenConfigurationIntegrationProviderItemProps = ScreenConfigurationIntegrationProviderContextProps & {
  integrationKey: ProviderIntegrationEnum;
  image: ImageSourcePropType;
  title: string;
  description: string;
  info?: string;
  hasConnections?: boolean;
  isCommingSoon?: boolean;
  children?: React.ReactNode;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.2
 * @component */
const ScreenConfigurationIntegrationProvider = () => {
  /**
   * @description Get the settings from the context for updating the integration state
   * @see {@link context/UserContext} */
  const settings = useUserContextStore((state) => state.settings);

  /**
   * @description Get the integration settings from the context for updating the integration state
   * @see {@link context/UserContext} */
  const [integrationSettings, setIntegrationSettings] = React.useState<ConvexSettingsAPIProps["integrations"]>([]);

  React.useEffect(() => {
    setIntegrationSettings(Object.values(ProviderIntegrationEnum).map((key) => ({
      integrationKey: key as ProviderIntegrationEnum,
      state: settings?.integrations?.find((integration) => integration.integrationKey === key as ProviderIntegrationEnum)?.state ?? false
    })));
  }, [settings]);

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
                integrationSettings={integrationSettings}
                setIntegrationSettings={setIntegrationSettings}
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
 * @version 0.0.1
 * @param {ScreenConfigurationIntegrationProviderItemProps} param0
 * @param {ConvexSettingsAPIProps} param0.settings - The settings of the currently signed in user.
 * @param {ConvexSettingsAPIProps["integrations"]} param0.integrationSettings - The integration settings of each item to update the state when user changes the usage of the integration.
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
  integrationSettings,
  setIntegrationSettings,
  integrationKey,
  image,
  title,
  description,
  info,
  hasConnections = false,
  isCommingSoon = false,
  children
}: ScreenConfigurationIntegrationProviderItemProps) => {
  const { secondaryBgColor, infoColor, tertiaryBgColor, primaryBorderColor, successColor, errorColor } = useThemeColors();

  /** @description Used for updating the integration state for the currently signed in user */
  const update: ReactAction<typeof api.sync.settings.action.update> = useAction(api.sync.settings.action.update);



  const getIntegrationState = (integrationKey: ProviderIntegrationEnum) => integrationSettings?.find((integration) => integration.integrationKey === integrationKey)?.state ?? false;

  //const [state, setState] = React.useState(getIntegrationState(integrationKey));


  const onStateChange = async (
    nextState: boolean
  ) => {
    const updatedIntegrations = integrationSettings?.map((integration) => integration.integrationKey === integrationKey ? { ...integration, state: nextState } : integration) || integrationSettings || [];

    debugger;

    const { hasErr, err } = await update({
      _id: settings?._id as Id<"settings">,
      ...convertToCleanObjectForUpdate({ ...settings, integrations: updatedIntegrations }),
    });

    if (hasErr) {
      handleConvexError(err);
    } else setIntegrationSettings(updatedIntegrations);
  };

  return (
    <View style={[ProviderStyle.item, { backgroundColor: secondaryBgColor }]}>
      <View style={[GlobalContainerStyle.rowCenterBetween, ProviderStyle.itemHeader]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
          <Image source={image} style={ProviderStyle.itemImage} resizeMode="cover"/>
          <View style={{ gap: 1 }}>
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
          disabled={isCommingSoon}
          state={getIntegrationState(integrationKey)} 
          onStateChange={onStateChange} />
      </View>
      <View style={[ProviderStyle.itemBottom, {
        backgroundColor: shadeColor(tertiaryBgColor, 0.8), 
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
                  style={[GlobalTypographyStyle.labelText, { color: shadeColor("#ababab", -0.1) }]} />
              </View>}
              {hasConnections && <View style={[GlobalContainerStyle.rowCenterStart, ProviderStyle.itemBottomContent, { backgroundColor: shadeColor(successColor, 0.8) }]}>
                <FontAwesomeIcon 
                  icon={faLink as IconProp} 
                  size={12} 
                  color={shadeColor(successColor, -0.1)} />
                <TextBase 
                  text={"i18n.screens.integrations.activeConnections"} 
                  type="label" 
                  style={[GlobalTypographyStyle.labelText, { color: shadeColor(successColor, -0.1) }]} />
              </View>}
              {isCommingSoon && <View style={[GlobalContainerStyle.rowCenterStart, ProviderStyle.itemBottomContent, { backgroundColor: shadeColor(errorColor, 0.8) }]}>
                <FontAwesomeIcon
                  icon={faAlarmClock as IconProp} 
                  size={10} 
                  color={shadeColor(errorColor, -0.1)} />
                <TextBase 
                  text={"i18n.global.comingSoon"} 
                  type="label" 
                  style={[GlobalTypographyStyle.labelText, { color: shadeColor(errorColor, -0.1) }]} />
              </View>}
            </View>
            {children && getIntegrationState(integrationKey) && children}
          </View>
          {info && <TextBase 
            text={info} 
            type="label" 
            style={[GlobalTypographyStyle.labelText]} />}
        </View>
      </View>
  </View>
  );
};

export default ScreenConfigurationIntegrationProvider;