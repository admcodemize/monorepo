import { ParamListBase, RouteProp } from "@react-navigation/native";
import { MaterialTopTabNavigationOptions, MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";

import { shadeColor } from "@codemize/helpers/Colors";
import { useFontFamily, useFontSize } from "../typography/useFont";
import { useThemeColors } from "../theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @function */
export function useMaterialTabs() {
  const { tertiaryBgColor, primaryBorderColor, focusedBgColor } = useThemeColors();
  return {
    screenOptions: {
      swipeEnabled: true, 
      tabBarLabelStyle: { fontSize: useFontSize("text") + 1, fontFamily: useFontFamily("text") },
      tabBarItemStyle: { width: "auto" },
      tabBarIndicatorStyle: { backgroundColor: focusedBgColor },
      tabBarIndicatorContainerStyle: { borderBottomWidth: 0.5, borderBottomColor: primaryBorderColor },
      tabBarStyle: { 
        height: STYLES.layoutTabBarHeight,
        backgroundColor: shadeColor(tertiaryBgColor, 0.1),
      } 
    } as MaterialTopTabNavigationOptions | ((props: {
      route: RouteProp<ParamListBase, string>;
      navigation: MaterialTopTabNavigationProp<ParamListBase, string, string | undefined>;
      theme: ReactNavigation.Theme;
    }) => MaterialTopTabNavigationOptions) | undefined
  }
}