import { PropsWithChildren } from "react";
import { ImageSourcePropType } from "react-native";

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
 * @version 0.0.2
 * @type */
export type ProviderItemProps = PropsWithChildren & {
  integrationKey: ProviderIntegrationEnum;
  image: ImageSourcePropType;
  title: string;
  description: string;
  info?: string;
  hasConnections?: boolean;
  isCommingSoon?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.3
 * @constant */
export const PROVIDER_ITEMS_GOOGLE: ProviderItemProps[] = [{
    integrationKey: ProviderIntegrationEnum.GOOGLE_CALENDAR,
    image: PNG_ASSETS.googleCalendar,
    title: "i18n.screens.integrations.provider.google.calendar.title",
    description: "i18n.screens.integrations.provider.google.calendar.description",
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
 * @version 0.0.2
 * @constant */
export const PROVIDER_ITEMS_MICROSOFT: ProviderItemProps[] = [{
  integrationKey: ProviderIntegrationEnum.MICROSOFT_CALENDAR,
  image: PNG_ASSETS.microsoftOutlook,
  title: "i18n.screens.integrations.provider.microsoft.calendar.title",
  description: "i18n.screens.integrations.provider.microsoft.calendar.description",
  hasConnections: false,
  isCommingSoon: true,
}]

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.15
 * @version 0.0.2
 * @constant */
export const PROVIDER_ITEMS_OTHERS: ProviderItemProps[] = [{
  integrationKey: ProviderIntegrationEnum.SLACK_CALENDAR,
  image: PNG_ASSETS.slackCalendar,
  title: "i18n.screens.integrations.provider.others.calendar.title",
  description: "i18n.screens.integrations.provider.others.calendar.description",
  hasConnections: false,
  isCommingSoon: true,
}, {
  integrationKey: ProviderIntegrationEnum.PAYPAL_PAYMENTS,
  image: PNG_ASSETS.paypalPayments,
  title: "i18n.screens.integrations.provider.others.paypal.title",
  description: "i18n.screens.integrations.provider.others.paypal.description",
  hasConnections: false,
  isCommingSoon: true,
}]