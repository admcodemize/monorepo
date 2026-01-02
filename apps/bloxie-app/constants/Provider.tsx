import { PropsWithChildren, cloneElement, isValidElement } from "react";
import { ImageSourcePropType } from "react-native";
import { Id } from "../../../packages/backend/convex/_generated/dataModel";

import { PNG_ASSETS } from "@/assets/png";

import TouchableHapticGmail from "@/components/button/oauth/TouchableHapticGmail.tsx";
import TouchableHapticGoogle from "@/components/button/oauth/TouchableHapticGoogle";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.2
 * @enum */
export enum ProviderEnum {
  GOOGLE = "oauth_google",
  MICROSOFT = "oauth_microsoft",
  SLACK = "oauth_slack",
  PAYPAL = "oauth_paypal",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.1
 * @enum */
export enum ProviderIntegrationEnum {
  GOOGLE_CALENDAR = "googleCalendar",
  GOOGLE_GMAIL = "googleGmail",
  GOOGLE_MEET = "googleMeet",
  MICROSOFT_CALENDAR = "microsoftCalendar",
  SLACK_CALENDAR = "slackCalendar",
  PAYPAL_PAYMENTS = "paypalPayments",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.3
 * @type */
export type ProviderItemProps = PropsWithChildren & {
  integrationKey: ProviderIntegrationEnum;
  image: ImageSourcePropType;
  title: string;
  description: string;
  info?: string;
  hasConnections?: boolean;
  isCommingSoon?: boolean;
  shouldBeCheckedForRuntime?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.4
 * @constant */
export const PROVIDER_ITEMS_GOOGLE: ProviderItemProps[] = [{
  integrationKey: ProviderIntegrationEnum.GOOGLE_CALENDAR,
  image: PNG_ASSETS.googleCalendar,
  title: "i18n.screens.integrations.provider.google.calendar.title",
  description: "i18n.screens.integrations.provider.google.calendar.description",
  info: "i18n.screens.integrations.provider.google.calendar.info",
  shouldBeCheckedForRuntime: true,
  children: <TouchableHapticGoogle />
}, {
  integrationKey: ProviderIntegrationEnum.GOOGLE_GMAIL,
  image: PNG_ASSETS.googleMail,
  title: "i18n.screens.integrations.provider.google.gmail.title",
  description: "i18n.screens.integrations.provider.google.gmail.description",
  info: "i18n.screens.integrations.provider.google.gmail.info",
  children: <TouchableHapticGmail grantScopeGmail={true} />
}, {
  integrationKey: ProviderIntegrationEnum.GOOGLE_MEET,
  image: PNG_ASSETS.googleMeet,
  title: "i18n.screens.integrations.provider.google.meet.title",
  description: "i18n.screens.integrations.provider.google.meet.description",
  info: "i18n.screens.integrations.provider.google.meet.info",
}]

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.3
 * @constant */
export const PROVIDER_ITEMS_MICROSOFT: ProviderItemProps[] = [{
  integrationKey: ProviderIntegrationEnum.MICROSOFT_CALENDAR,
  image: PNG_ASSETS.microsoftOutlook,
  title: "i18n.screens.integrations.provider.microsoft.calendar.title",
  description: "i18n.screens.integrations.provider.microsoft.calendar.description",
  hasConnections: false,
  isCommingSoon: true,
  shouldBeCheckedForRuntime: true,
}]

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.3
 * @constant */
export const PROVIDER_ITEMS_OTHERS: ProviderItemProps[] = [{
  integrationKey: ProviderIntegrationEnum.SLACK_CALENDAR,
  image: PNG_ASSETS.slackCalendar,
  title: "i18n.screens.integrations.provider.others.calendar.title",
  description: "i18n.screens.integrations.provider.others.calendar.description",
  hasConnections: false,
  isCommingSoon: true,
  shouldBeCheckedForRuntime: true,
}, {
  integrationKey: ProviderIntegrationEnum.PAYPAL_PAYMENTS,
  image: PNG_ASSETS.paypalPayments,
  title: "i18n.screens.integrations.provider.others.paypal.title",
  description: "i18n.screens.integrations.provider.others.paypal.description",
  hasConnections: false,
  isCommingSoon: true,
  shouldBeCheckedForRuntime: true,
}]

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.17
 * @version 0.0.1
 * @param {Id<"users">} userId - The convex user id
 * @constant */
export const getProviderItemsGoogle = (
  userId: Id<"users">
) => {
  return PROVIDER_ITEMS_GOOGLE.map((item) => {
    const shouldInjectUserId = [
      ProviderIntegrationEnum.GOOGLE_CALENDAR,
      ProviderIntegrationEnum.GOOGLE_GMAIL,
    ].includes(item.integrationKey);

    /** 
     * @description Inject the userId into the children if the integration key is Google Calendar or Google Gmail 
     * -> Example: <TouchableHapticGoogle userId={userId} .... />
     * -> The original props will be passed to the component with the additional userId prop */
    if (shouldInjectUserId && isValidElement<{ userId?: Id<"users"> }>(item.children)) {
      return { ...item, children: cloneElement(item.children, { userId }) };
    } return item;
  });
}