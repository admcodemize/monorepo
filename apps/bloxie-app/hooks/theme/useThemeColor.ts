import * as React from 'react';
import { useColorScheme } from 'react-native';
import { COLORS } from '@codemize/constants/Colors';

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type ThemeProps = {
  light?: string;
  dark?: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns theme based color
 * @since 0.0.1
 * @version 0.0.1
 * @param {string} prop - The property to get the color from inside the color constants object
 * @param {ThemeProps} props - Handles individual color styling based on the theme
 * @function */
export const useThemeColor = (
  prop: keyof typeof COLORS.light & keyof typeof COLORS.dark,
  props: ThemeProps = {},
) => {
  const theme = useColorScheme() || "light";
  const colorFromProps = props[theme];

  if (colorFromProps) return colorFromProps;
  return COLORS[theme][prop];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns theme based colors (memoized to prevent unnecessary re-renders)
 * @since 0.0.1
 * @version 0.0.2
 * @function */
export const useThemeColors = (): Record<string, string> => {
  const theme = useColorScheme() || "light";
  return React.useMemo(() => {
    return Object.keys(COLORS[theme]).reduce((acc, key) => {
      acc[`${key}Color`] = COLORS[theme][key as keyof typeof COLORS.light & keyof typeof COLORS.dark];
      return acc;
    }, {} as Record<string, string>);
  }, [theme]);
}