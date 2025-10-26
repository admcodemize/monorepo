import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import { LanguageCodes } from "@codemize/utils/languageCodes";

import de from "@/i18n/locales/de/translation.json";
import en from "@/i18n/locales/en/translation.json";

/** 
 * @author Marc Stöckli - Codemize GmbH
 * @version 0.0.1
 * @since 0.0.1
 *  @description Set the resources for the different languages */
const resources = { 
  de: { translation: de },
  en: { translation: en }
};

/** 
 * @author Marc Stöckli - Codemize GmbH
 * @version 0.0.1
 * @since 0.0.1
 * @description Get the device language and set this as the default language. 
 * -> If no language is found, set the default language to English. */
const deviceLanguage = getLocales()[0].languageCode ?? LanguageCodes.en;

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH
 * @version 0.0.1
 * @since 0.0.1
 * @description Initialize the i18n instance */
i18n
  .use(initReactI18next)
  .init({
    debug: false,
    compatibilityJSON: 'v4',
    resources,
    lng: deviceLanguage,
    fallbackLng: LanguageCodes.en,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;