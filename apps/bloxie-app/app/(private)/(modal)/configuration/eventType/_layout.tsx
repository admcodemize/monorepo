import { Stack, withLayoutContext } from "expo-router";
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
import { useFontFamily, useFontSize } from "@/hooks/typography/useFont";
import { TRAY_CONFIGURATION_ITEMS } from "@/constants/Models";
import { STYLES } from "@codemize/constants/Styles";

import StackModalHeader from "@/components/container/StackModalHeader";
import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";
import { useMaterialTabs } from "@/hooks/container/useMaterialTabs";

const { Navigator } = createMaterialTopTabNavigator();

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a navigator that automatically injects matched routes and renders nothing when there are no children. 
 * Return type with children prop optional. Enables use of other built-in React Navigation navigators and other navigators 
 * built with the React Navigation custom navigator API.
 * @since 0.0.54
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
 * @since 0.0.54
 * @version 0.0.1
 * @component */
const ModalConfigurationEventTypeLayout = () => {
  const { tertiaryBgColor } = useThemeColors();
  const { t } = useTranslation();

  const tray = TRAY_CONFIGURATION_ITEMS.find((item) => item.key === "type");

  /** 
   * @description Returns the default screen options for the material top tabs
   * @see {@link hooks/container/useMaterialTabs} */
  const { screenOptions } = useMaterialTabs();

  return (
    <SafeAreaContextViewBase style={{ backgroundColor: shadeColor(tertiaryBgColor, 0.1) }}>
      <ToastifyProvider config={config} />
      <StackModalHeader 
        title={tray!.title} 
        description={tray?.modal || ""} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{  }} />
      </Stack>
    </SafeAreaContextViewBase>
  );
}

export default ModalConfigurationEventTypeLayout;