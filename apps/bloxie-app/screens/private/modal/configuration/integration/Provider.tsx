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
import { SIZES } from "@codemize/constants/Fonts";
import Divider from "@/components/container/Divider";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.16
 * @version 0.0.3
 * @type */
type ScreenConfigurationIntegrationProviderContextProps = {
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
  const { primaryBorderColor } = useThemeColors();

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
          <View style={{ gap: 8 }}>
          <ListItemGroup 
            key={`${KEYS.providerGroup}-${group.title}`}
            title={group.title}
            style={{ paddingHorizontal: 6 }}>
          </ListItemGroup>
            {group.items.map((item, index) => (
              <ScreenConfigurationIntegrationProviderItem
                key={`${KEYS.providerGroupItem}-${item.integrationKey}`}
                {...item}
                integrations={integrations}
                hasConnections={hasGoogleConnections(item.integrationKey)}/>
          ))}
          </View>
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
  const { infoColor, successColor, errorColor, inactiveColor, secondaryBgColor, primaryBorderColor, tertiaryBgColor } = useThemeColors();
  const { t } = useTranslation();

  /**
   * @description Get the runtime from the context for checking if the user has reached the limit of linked provider integrations
   * @see {@link context/UserContext} */
  const runtime = useUserContextStore((state) => state.runtime);

  /**
   * @description Get the initial integration state for the given integration key
   * @param {ProviderIntegrationEnum} integrationKey - The integration key to get the state for
   * @function */
  //const getIntegrationState = (integrationKey: ProviderIntegrationEnum) => settings?.integrations?.find((integration) => integration.integrationKey === integrationKey)?.state ?? false;

  return (
    <View style={[ProviderStyle.item, { backgroundColor: shadeColor(secondaryBgColor, 0), gap: 6, paddingTop: 6  }]}>
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
      </View>
      {(info && ((shouldBeCheckedForRuntime && integrations.length >= runtime.license.counter.linkedProviderCount) || !shouldBeCheckedForRuntime)) && <TextBase 
        text={info} 
        type="label" 
        preText={t("i18n.global.hint")} 
        preTextStyle={{ color: infoColor, fontSize: Number(SIZES.label) - 1 }}
        style={[GlobalTypographyStyle.labelText, { paddingHorizontal: 8, paddingVertical: 4, color: shadeColor(infoColor, 0.3), fontSize: Number(SIZES.label) - 1 }]} />}
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
            {children && children}
          </View>
        </View>
      </View>
    </View>

  );
};

export default ScreenConfigurationIntegrationProvider;