import { FAMILIY, SIZES } from "@codemize/constants/Fonts";

import { TextBaseTypes } from "@/components/typography/Text";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the font family based on text type
 * @since 0.0.1
 * @version 0.0.1
 * @param {TextBaseTypes} textType Generic text type for determing the font family
 * @function */
export const useFontFamily = (
  textType: TextBaseTypes
) => String(FAMILIY[textType as keyof typeof FAMILIY]) || String(FAMILIY.text);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns the font size based on text type
 * @since 0.0.1
 * @version 0.0.1
 * @param {TextBaseTypes} textType Generic text type for determing the font size */
export const useFontSize = (
  textType: TextBaseTypes
) => Number(SIZES[textType as keyof typeof SIZES]) || Number(SIZES.text);