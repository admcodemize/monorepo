import Constants from 'expo-constants';
import { Dimensions, Platform } from "react-native";
import { IconDefinition, IconPack, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as faDuotoneIcons from "@fortawesome/duotone-thin-svg-icons";

import { PLATFORM } from "@/constants/System";

import { Locale } from 'date-fns';
import * as Locales from 'date-fns/locale';
import * as Localization from 'expo-localization';

const DIM = Dimensions.get("window");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type PlatformProps = {
  iOS: string;
  android: string;
  web: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type TimeZoneAbbrevationProps = {
  now?: Date;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type MeasureInWindowProps = {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Is an apple ios platform/device
 * @readonly
 * @since 0.0.1
 * @version 0.0.1
 * @function */
export const isiOS = (): boolean => Platform.OS === PLATFORM.iOS;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Is a google android platform/device
 * @readonly
 * @since 0.0.1
 * @version 0.0.1
* @function */
export const isAndroid = () => Platform.OS === PLATFORM.android;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Is a web based platform/device
 * @readonly
 * @since 0.0.1
 * @version 0.0.1 
 * @function */
export const isWeb = () => Platform.OS === PLATFORM.web;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the version of the app
 * @readonly
 * @since 0.0.1
 * @version 0.0.1
 * @function */
export const getVersion = () => Constants.expoConfig?.version;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Looks up a date-fns locale from the Expo localization object.  This falls back to `en-US`
 * @since 0.0.1
 * @version 0.0.1
 * @function */
export const getLocalization = (): Locale => {
  const locales = Localization.getLocales();
  return Locales.hasOwnProperty(locales[0].languageCode as keyof typeof Locales) 
    ? Locales[locales[0].languageCode as keyof typeof Locales]
    : Locales.enUS;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Looks up a date-fns locale from the Expo localization object.  This falls back to `en-US`
 * @since 0.0.1
 * @version 0.0.1
 * @function */
export const getCountryCode = (): string|null => {
  const locales = Localization.getLocales();
  return locales[0].regionCode;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the currency of the device
 * @since 0.0.1
 * @version 0.0.1
 * @function */
export const getCurrencyCode = (): string => Localization.getLocales()[0].currencyCode || "USD";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns time zone based on localization
 * @since 0.0.1
 * @version 0.0.1
 * @function */
export const getTimeZone = (): string => Localization.getCalendars()[0]?.timeZone || String();

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the first week day based on localization
 * @since 0.0.1
 * @version 0.0.1
 * @function */
export const getFirstWeekDay = (): number => Localization.getCalendars()[0]?.firstWeekday || 0;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns time zone abbrevation based on localization
 * @since 0.0.1
 * @version 0.0.1
 * @function */
export const getTimeZoneAbbrevation = ({
  now = new Date()
}: TimeZoneAbbrevationProps): string|undefined => now.toLocaleString([getLocalization().code], {
  timeZoneName: "shortOffset"
})?.split(' ')?.pop();

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns whether the device uses 24 hour clock
 * @since 0.0.1
 * @version 0.0.1
 * @function */
export const uses24HourClock = (): boolean => Localization.getCalendars()[0]?.uses24hourClock || false;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the left position of a component based on the width of the component
 * @since 0.0.19
 * @version 0.0.19
 * @param {number} componentWidth - The width of the component
 * @param {MeasureInWindowProps} measure - The measure of the component
 * @function */
export const measureInWindowLeft = (
  componentWidth: number,
  { x, width }: MeasureInWindowProps,
  totalWidth: number = DIM.width
) => 
  /** 
   * @description Ensure the left position is within the screen width. Math.max prevents negative values. 
   * Math.min prevents the component from being off the screen. */
  Math.max(0, Math.min(
    x < componentWidth ? x : ((x + width) - componentWidth),
    (totalWidth || DIM.width) - componentWidth
  ));

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Resolves the runtime icon based on the icon key
 * @since 0.0.37
 * @version 0.0.1
 * @function */
export const resolveRuntimeIcon = (
  icon: string
): IconProp|undefined => {  
  const _icon = faDuotoneIcons[icon as keyof typeof faDuotoneIcons];
  return isFontAwesomeIcon(_icon) ? (_icon as IconProp) : undefined;
  };

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Checks if the value is a FontAwesome icon
 * @since 0.0.37
 * @version 0.0.1
 * @function */
export const isFontAwesomeIcon = (
  value: IconDefinition|IconPrefix|IconPack|unknown
): value is IconDefinition => typeof value === "object" && value !== null && "iconName" in value && "prefix" in value;
