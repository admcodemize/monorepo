import React from "react";
import { View } from "react-native";

import DashboardAnalytics from "@/components/layout/dashboard/DashboardAnalytics";
import DashboardProvider, { DashboardDropdownItemKeyDays } from "@/context/DashboardContext";
import DashboardStatistics from "@/components/layout/dashboard/DashboardStatistics";
import Divider from "@/components/container/Divider";
import DropdownOverlay from "@/components/container/DropdownOverlay";
import TrayHeader from "@/components/container/TrayHeader";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";
import { useTranslation } from "react-i18next";


// https://www.lucidmeetings.com/meeting-types

/** @todo Refactor the whole screen!! */


/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @component */
const ScreenTrayDashboard = (

) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const refContainer = React.useRef<View>(null);
  const chart = React.useMemo(() => ({
    title: "i18n.screens.dashboard.statistics.cards.income",
    showCurrency: true,
    showReferenceLine1: true,
    lineAreaData: {
      value: 0,
      now: undefined,
      dataPointLabel: "0"
    }
  }), []);

  const dropdown = React.useMemo(() => ({
    itemKeyTeam: 0,
    itemKeyDays: DashboardDropdownItemKeyDays.last30Days
  }), []);

  const onPressRefresh = React.useCallback(() => {

  }, []);

  const onPressTeams = React.useCallback(() => {

  }, []);

  const onPressDays = React.useCallback(() => {

  }, []);

  return (
    <DashboardProvider
      chart={chart}
      dropdown={dropdown}>
      <View 
        ref={refContainer}
        style={{ 
          padding: STYLES.paddingHorizontal, 
          backgroundColor: colors.primaryBgColor, 
          borderColor: colors.primaryBorderColor 
      }}>
        <View style={{ gap: STYLES.sizeGap }}>
          <TrayHeader
            title={t("i18n.screens.dashboard.analytics.title")}
            description={t("i18n.screens.dashboard.analytics.description")} />
          <Divider />
          <DashboardAnalytics
            refContainer={refContainer}
            onPressRefresh={onPressRefresh}
            onPressTeams={onPressTeams}
            onPressDays={onPressDays} />
          <DashboardStatistics />
        </View>
        <DropdownOverlay 
          hostId="tray"
          backgroundColor="" />
      </View>
    </DashboardProvider>
  );
}

export default ScreenTrayDashboard;