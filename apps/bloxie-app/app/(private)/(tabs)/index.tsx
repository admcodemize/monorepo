import { INITIAL_CHART_POINTER_ITEM } from "@/components/chart/ChartLineAreaPointer";
import DropdownOverlay from "@/components/container/DropdownOverlay";

import DashboardProvider, { DashboardDropdownItemKeyDays } from "@/context/DashboardContext";

import ScreenDashboard from "@/screens/private/tabs/Dashboard";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.3
 * @component */
const TabIndex = () => {
  return (
    <DashboardProvider 
      chart={{
        title: "i18n.screens.dashboard.statistics.pointer.income",
        showCurrency: true,
        showReferenceLine1: true,
        lineAreaData: INITIAL_CHART_POINTER_ITEM
      }}
      dropdown={{ 
        itemKeyTeam: 0, 
        itemKeyDays: DashboardDropdownItemKeyDays.last30Days
      }}>
        <ScreenDashboard />
        <DropdownOverlay />
    </DashboardProvider>
  );
}

export default TabIndex;