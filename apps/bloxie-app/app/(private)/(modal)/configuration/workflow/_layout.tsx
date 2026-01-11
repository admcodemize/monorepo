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
import { useFontFamily, useFontSize } from "@/hooks/typography/useFont";
import { useConvexUser } from "@/hooks/auth/useConvexUser";
import { useTemplates } from "@/hooks/configuration/useTemplate";
import { useWorkflows } from "@/hooks/configuration/useWorkflows";
import { ConvexUsersAPIProps } from "@codemize/backend/Types";
import { STYLES } from "@codemize/constants/Styles";
import { TRAY_CONFIGURATION_ITEMS } from "@/constants/Models";

import StackModalHeader from "@/components/container/StackModalHeader";
import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";
import DropdownOverlay from "@/components/container/DropdownOverlay";
import { useMaterialTabs } from "@/hooks/container/useMaterialTabs";
import React from "react";
import LoadingScreen from "@/screens/private/LoadingScreen";

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
 * @since 0.0.46
 * @version 0.0.1
 * @type */
type LoadedProps = {
  workflowsFetchFinished: boolean;
  templatesFetchFinished: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.29
 * @version 0.0.5
 * @component */
const ModalConfigurationWorkflowLayout = () => {
  const { tertiaryBgColor } = useThemeColors();
  const { t } = useTranslation();
  const { convexUser } = useConvexUser();

  const tray = TRAY_CONFIGURATION_ITEMS.find((item) => item.key === "workflow");

  /** 
   * @description Returns the default screen options for the material top tabs
   * @see {@link hooks/container/useMaterialTabs} */
  const { screenOptions } = useMaterialTabs();

  /**
   * @description Loads the workflows for the currently signed in user
   * @see {@link hooks/configuration/useWorkflows} */
  useWorkflows({ convexUser: convexUser as ConvexUsersAPIProps });

  /**
   * @description Loads the templates for the currently signed in user and also the global templates created by the system (bloxie)
   * @see {@link hooks/configuration/useTemplates} */
  useTemplates({ convexUser: convexUser as ConvexUsersAPIProps });

  return (
    <SafeAreaContextViewBase style={{ backgroundColor: shadeColor(tertiaryBgColor, 0.1) }}>
      <ToastifyProvider config={config} />
      <StackModalHeader 
        title={tray!.title} 
        description={tray?.modal} />
      <MaterialTopTabs screenOptions={screenOptions}>
        <MaterialTopTabs.Screen name="(builder)" options={{ title: t("i18n.screens.workflow.horizontalNavigation.builder") }} />
        <MaterialTopTabs.Screen name="(history)" options={{ title: t("i18n.screens.workflow.horizontalNavigation.history") }} />
      </MaterialTopTabs>
      <DropdownOverlay />
    </SafeAreaContextViewBase>
  );
}

export default ModalConfigurationWorkflowLayout;