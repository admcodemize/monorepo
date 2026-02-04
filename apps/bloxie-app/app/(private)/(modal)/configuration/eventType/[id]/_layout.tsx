import { useLocalSearchParams, withLayoutContext } from "expo-router";
import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useMaterialTabs } from "@/hooks/container/useMaterialTabs";
import TextBase from "@/components/typography/Text";
import { View } from "react-native";
import ViewBase from "@/components/container/View";
import { shadeColor } from "@codemize/helpers/Colors";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";

const { Navigator } = createMaterialTopTabNavigator();

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a navigator that automatically injects matched routes and renders nothing when there are no children. 
 * Return type with children prop optional. Enables use of other built-in React Navigation navigators and other navigators 
 * built with the React Navigation custom navigator API.
 * @since 0.0.57
 * @version 0.0.1
 * @component */
export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.57
 * @version 0.0.1
 * @component */
const ModalConfigurationEventTypeLayout = () => {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { tertiaryBgColor } = useThemeColors();

  /** 
   * @description Returns the default screen options for the material top tabs
   * @see {@link hooks/container/useMaterialTabs} */
  const { screenOptions } = useMaterialTabs();

  return (
    <MaterialTopTabs screenOptions={screenOptions}>
      <MaterialTopTabs.Screen name="index" options={{ title: "Allgemein".toUpperCase() }} />
      <MaterialTopTabs.Screen name="additional" options={{ title: "Weitere Einstellungen".toUpperCase() }} />
    </MaterialTopTabs>
  );
}

export default ModalConfigurationEventTypeLayout;