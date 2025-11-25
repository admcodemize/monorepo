import * as React from "react";
import { Dimensions, View } from "react-native";
import { NavigationState, SceneRendererProps, TabBar, TabDescriptor, TabView } from "react-native-tab-view";

import { shadeColor } from "@codemize/helpers/Colors";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";

import HorizontalNavigationStyle from "@/styles/components/container/HorizontalNavigation";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

const DIM = Dimensions.get("window")

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.13
 * @version 0.0.1
 * @type */
export type HorizontalNavigationProps = {
  renderScene: (props: SceneRendererProps & {
    route: { key: string; title: string; };
  }) => React.ReactNode;
  navigationState: NavigationState<{ key: string; title: string; }>;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a horizontal tab navigation container
 * @since 0.0.13
 * @version 0.0.1 */
const HorizontalNavigation = ({
  renderScene,
  navigationState
}: HorizontalNavigationProps) => {
  const { primaryBorderColor, linkColor, tertiaryBgColor, infoColor } = useThemeColors();

  /** @description The index of the current tab */
  const [index, setIndex] = React.useState(navigationState.index);

  /** 
   * @description The common options for the tab bar
   * -> Handles the overall rendering of all tab bar elements
   * @see {@link https://reactnavigation.org/docs/tab-based-navigation#common-options} */
   const commonOptions = React.useMemo((): TabDescriptor<{
    key: string;
    title: string;
  }> | undefined => ({
    label({ route, focused }) {
      return (
        <View style={HorizontalNavigationStyle.label}>
          <TextBase 
            text={route.title}
            type="label"
            style={[GlobalTypographyStyle.labelText, { color: focused ? linkColor : infoColor }]} />
        </View>
      )
    },
  }), []);

  /** 
   * @description The render customtab bar function
   * -> Handles the rendering of the tab bar
   * @see {@link https://reactnavigation.org/docs/tab-based-navigation#render-tab-bar} */
  const renderTabBar = (props: SceneRendererProps & {
    navigationState: NavigationState<{ key: string; title: string; }>;
    options: Record<string, TabDescriptor<{key: string; title: string;}>> | undefined;
  }) => 
    <TabBar
      {...props}
      onTabPress={({ route }) => {
        console.log(route);
        setIndex(navigationState.routes.findIndex((r) => r.key === route.key) || 0);
      }}
      scrollEnabled={true}
      style={{ backgroundColor: "transparent"  }}
      tabStyle={HorizontalNavigationStyle.tabStyle}
      indicatorStyle={{ backgroundColor: linkColor }}
      contentContainerStyle={[HorizontalNavigationStyle.contentContainerStyle, { borderBottomColor: shadeColor(primaryBorderColor, 0.6) }]} />

  return (
    <TabView
      navigationState={{ ...navigationState, index }}
      commonOptions={commonOptions}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: DIM.width }}
      renderScene={renderScene}
      pagerStyle={{ backgroundColor: shadeColor(tertiaryBgColor, 0.4)}} />
  )
}

export default HorizontalNavigation;