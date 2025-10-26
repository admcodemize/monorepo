import React from "react";
import { View } from "react-native";




import DashboardAnalytics from "@/components/layout/dashboard/DashboardAnalytics";
import DashboardStatistics from "@/components/layout/dashboard/DashboardStatistics";
import TitleWithDescription from "@/components/typography/TitleWithDescription";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import DashboardStyle from "@/styles/screens/private/tabs/Dashboard";
import { useTranslation } from "react-i18next";

// https://www.lucidmeetings.com/meeting-types

/** @todo Refactor the whole screen!! */


/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @component */
const ScreenDashboard = (

) => {
  const refContainer = React.useRef<any>(null)

  const onPressRefresh = React.useCallback(() => {

  }, []);

  const onPressTeams = React.useCallback(() => {

  }, []);

  const onPressDays = React.useCallback(() => {

  }, []);

  return (
    <View 
      ref={refContainer}
      style={DashboardStyle.view}>
        <DashboardAnalytics
          refContainer={refContainer}
          onPressRefresh={onPressRefresh}
          onPressTeams={onPressTeams}
          onPressDays={onPressDays} />
        <DashboardStatistics />
    </View>
  );
}

export default ScreenDashboard;