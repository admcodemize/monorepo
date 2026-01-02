import { withLayoutContext } from "expo-router";
import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import ToastifyProvider from 'toastify-react-native';

import { config } from "@/helpers/Toastify";
import { shadeColor } from "@codemize/helpers/Colors";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useFontSize } from "@/hooks/typography/useFont";
import { TRAY_CONFIGURATION_ITEMS } from "@/constants/Models";
import { STYLES } from "@codemize/constants/Styles";

import StackModalHeader from "@/components/container/StackModalHeader";
import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";

const { Navigator } = createMaterialTopTabNavigator();

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a navigator that automatically injects matched routes and renders nothing when there are no children. 
 * Return type with children prop optional. Enables use of other built-in React Navigation navigators and other navigators 
 * built with the React Navigation custom navigator API.
 * @since 0.0.29
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
 * @since 0.0.29
 * @version 0.0.2
 * @component */
const ModalConfigurationIntegrationLayout = () => {
  const { tertiaryBgColor, primaryBorderColor, focusedBgColor } = useThemeColors();
  const { t } = useTranslation();

  const tray = TRAY_CONFIGURATION_ITEMS.find((item) => item.key === "integration");

  return (
    <SafeAreaContextViewBase style={{ backgroundColor: shadeColor(tertiaryBgColor, 0.1) }}>
      <ToastifyProvider config={config} />
      <StackModalHeader 
        title={tray!.title} 
        description={tray?.modal || ""} />
      <MaterialTopTabs 
        screenOptions={{ 
          swipeEnabled: true, 
          tabBarLabelStyle: { fontSize: useFontSize("text") },
          tabBarItemStyle: { width: "auto" },
          tabBarIndicatorStyle: { backgroundColor: focusedBgColor },
          tabBarIndicatorContainerStyle: { borderBottomWidth: 0.5, borderBottomColor: primaryBorderColor },
          tabBarStyle: { 
            height: STYLES.layoutTabBarHeight,
            backgroundColor: shadeColor(tertiaryBgColor, 0.1),
          } 
        }}>
          <MaterialTopTabs.Screen name="index" options={{ title: t("i18n.screens.integrations.horizontalNavigation.provider") }} />
          <MaterialTopTabs.Screen name="connection" options={{ title: t("i18n.screens.integrations.horizontalNavigation.connections") }} />
          <MaterialTopTabs.Screen name="synchronisation" options={{ title: t("i18n.screens.integrations.horizontalNavigation.synchronization") }} />
      </MaterialTopTabs>
    </SafeAreaContextViewBase>
  );
}

export default ModalConfigurationIntegrationLayout;