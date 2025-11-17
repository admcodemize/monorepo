import React from "react";
import { useTranslation } from "react-i18next";
import { GestureResponderEvent, View } from "react-native";
import { faCalendarCheck, faCheckDouble, faStopwatch, faWallet, faXmark } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { STYLES } from "@codemize/constants/Styles";

import { useDashboardContextStore } from "@/context/DashboardContext";

import DashboardHeatmap from "@/components/layout/dashboard/DashboardHeatmap";
import ChartLineArea, { ChartLineAreaDataProps } from "@/components/chart/ChartLineArea";
import { ChartLineAreaPointer } from "@/components/chart/ChartLineAreaPointer";
import DashboardCard, { DashboardCardPercentageType } from "@/components/layout/dashboard/DashboardCard";
import TitleWithDescription from "@/components/typography/TitleWithDescription";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/** @todo Refactor the whole component!! */

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DashboardStatisticsProps = {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DashboardStatisticsChartPointerProps = {
  value: string;
  now: Date|undefined;
  showCurrency?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {DashboardStatisticsProps} param0 
 * @param {boolean} param0.new - Whether the statistics are new
 * @component */
const DashboardStatistics = ({

}: DashboardStatisticsProps) => {
  const { t } = useTranslation();

  /**
   * @description The function to set the properties of the chart
   * @see {@link @/context/DashboardContext.tsx} */
  const setChartProperties = useDashboardContextStore((state) => state.setChartProperties);

  /**
   * @description The function to handle the press event of the card which will update the chart
   * @param {string} title - The title of the card
   * @param {boolean} showCurrency - Whether to show the currency of the card
   * @param {GestureResponderEvent} e - The event of the card
   * @function */
  const onPressCard = React.useCallback(
    (title: string, showCurrency: boolean) => 
    (e: GestureResponderEvent) => {
    setChartProperties(title, showCurrency);
  }, [setChartProperties]);

  /** 
   * @description The style of a specific card 
   * -> This is used to make the cards equal width */
  const cardStyle = React.useMemo(() => ({ 
    flex: 1
  }), []);

  return (
    <View style={[{ gap: STYLES.sizeGap }]}>
      <TitleWithDescription
        title={"Zeitachse"}
        description={"Klicken Sie auf eine der nachfolgenden Statistiken um eine zeitliche Übersicht zu erhalten."} />
      <DashboardStatisticsChart />
      <TitleWithDescription
        title={t("i18n.screens.dashboard.statistics.title")}
        description={t("i18n.screens.dashboard.statistics.description")} />
      <DashboardCard
        icon={faWallet as IconProp}
        title={t("i18n.screens.dashboard.statistics.cards.income")}
        value="59'490.00 CHF"
        percentage="3.5"
        percentageType={DashboardCardPercentageType.upwards}
        showDetails={true}
        onPress={onPressCard("i18n.screens.dashboard.statistics.cards.income", true)}
        onPressDetails={() => { console.log("details") }} />
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <DashboardCard
          icon={faStopwatch as IconProp}
          title={t("i18n.screens.dashboard.statistics.cards.freeSlots")}
          value="48"
          percentage="4"
          percentageType={DashboardCardPercentageType.downwards}
          onPress={onPressCard("i18n.screens.dashboard.statistics.cards.freeSlots", false)}
          style={cardStyle} />
        <DashboardCard
          icon={faCalendarCheck as IconProp}
          title={t("i18n.screens.dashboard.statistics.cards.newAppointments")}
          value="50"
          percentage="23"
          percentageType={DashboardCardPercentageType.downwards}
          onPress={onPressCard("i18n.screens.dashboard.statistics.cards.newAppointments", false)}
          style={cardStyle} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <DashboardCard
          icon={faCheckDouble as IconProp}
          title={t("i18n.screens.dashboard.statistics.cards.confirmedAppointments")}
          value="8"
          percentage="18"
          percentageType={DashboardCardPercentageType.downwards}
          onPress={onPressCard("i18n.screens.dashboard.statistics.cards.confirmedAppointments", false)}
          style={cardStyle} />
        <DashboardCard
          icon={faXmark as IconProp}
          title={t("i18n.screens.dashboard.statistics.cards.rejectedAppointments")}
          value="4"
          percentage="34"
          percentageType={DashboardCardPercentageType.upwards}
          onPress={onPressCard("i18n.screens.dashboard.statistics.cards.rejectedAppointments", false)}
          style={cardStyle} />
      </View>
      <View style={{ gap: STYLES.sizeGap, paddingTop: 10 }}>
      {/*<TitleWithDescription
        title={"Buchungsaktivität"}
        description={"Übersicht der gebuchten Slots basierend der Wochentage/Stunden zum ausgewählten Zeitraum."} />*/}
      {/*<DashboardHeatmap events={[
          // Woche 1 (14-16 Okt) - Montag bis Mittwoch (erweitert)
          { userId: "1", start: "2025-10-14T06:00:00Z", end: "2025-10-14T06:30:00Z", title: "Early Standup" },
          { userId: "1", start: "2025-10-14T07:00:00Z", end: "2025-10-14T08:00:00Z", title: "Morning Review" },
          { userId: "1", start: "2025-10-14T08:30:00Z", end: "2025-10-14T09:30:00Z", title: "Planning Meeting" },
          { userId: "1", start: "2025-10-14T09:00:00Z", end: "2025-10-14T10:00:00Z", title: "Team Standup" },
          { userId: "1", start: "2025-10-14T10:30:00Z", end: "2025-10-14T11:30:00Z", title: "Design Review" },
          { userId: "1", start: "2025-10-14T12:00:00Z", end: "2025-10-14T13:00:00Z", title: "Lunch & Learn" },
          { userId: "1", start: "2025-10-14T13:00:00Z", end: "2025-10-14T14:30:00Z", title: "Client Meeting" },
          { userId: "1", start: "2025-10-14T15:00:00Z", end: "2025-10-14T16:00:00Z", title: "Project Sync" },
          { userId: "1", start: "2025-10-14T16:30:00Z", end: "2025-10-14T17:30:00Z", title: "Code Review" },
          { userId: "1", start: "2025-10-14T18:00:00Z", end: "2025-10-14T19:00:00Z", title: "Late Client Call" },
          
          { userId: "1", start: "2025-10-15T05:30:00Z", end: "2025-10-15T07:30:00Z", title: "Early Sync" },
          { userId: "1", start: "2025-10-15T08:00:00Z", end: "2025-10-15T09:00:00Z", title: "Planning Session" },
          { userId: "1", start: "2025-10-15T09:30:00Z", end: "2025-10-15T10:30:00Z", title: "Team Meeting" },
          { userId: "1", start: "2025-10-15T10:00:00Z", end: "2025-10-15T11:30:00Z", title: "Design Workshop" },
          { userId: "1", start: "2025-10-15T12:00:00Z", end: "2025-10-15T13:00:00Z", title: "Product Demo" },
          { userId: "1", start: "2025-10-15T14:00:00Z", end: "2025-10-15T15:00:00Z", title: "1:1 Meeting" },
          { userId: "1", start: "2025-10-15T15:30:00Z", end: "2025-10-15T16:30:00Z", title: "Strategy Session" },
          { userId: "1", start: "2025-10-15T17:00:00Z", end: "2025-10-15T18:00:00Z", title: "Sprint Retro" },
          { userId: "1", start: "2025-10-15T20:00:00Z", end: "2025-10-15T21:00:00Z", title: "Evening Workshop" },
          
          { userId: "1", start: "2025-10-16T04:00:00Z", end: "2025-10-16T07:00:00Z", title: "Morning Kickoff" },
          { userId: "1", start: "2025-10-16T07:30:00Z", end: "2025-10-16T08:30:00Z", title: "Early Call" },
          { userId: "1", start: "2025-10-16T09:00:00Z", end: "2025-10-16T10:00:00Z", title: "Team Standup" },
          { userId: "1", start: "2025-10-16T10:30:00Z", end: "2025-10-16T11:30:00Z", title: "Client Presentation" },
          { userId: "1", start: "2025-10-16T11:00:00Z", end: "2025-10-16T12:00:00Z", title: "Sprint Review" },
          { userId: "1", start: "2025-10-16T13:00:00Z", end: "2025-10-16T14:00:00Z", title: "Tech Discussion" },
          { userId: "1", start: "2025-10-16T13:30:00Z", end: "2025-10-16T15:00:00Z", title: "Architecture Discussion" },
          { userId: "1", start: "2025-10-16T15:30:00Z", end: "2025-10-16T16:30:00Z", title: "Team Sync" },
          { userId: "1", start: "2025-10-16T17:00:00Z", end: "2025-10-16T18:30:00Z", title: "Workshop" },
          
          // Woche 2 (7-11 Okt) - Montag bis Freitag (erweitert)
          { userId: "1", start: "2025-10-07T05:30:00Z", end: "2025-10-07T07:30:00Z", title: "Early Standup" },
          { userId: "1", start: "2025-10-07T08:00:00Z", end: "2025-10-07T09:00:00Z", title: "Weekly Planning" },
          { userId: "1", start: "2025-10-07T09:30:00Z", end: "2025-10-07T10:30:00Z", title: "Client Sync" },
          { userId: "1", start: "2025-10-07T10:00:00Z", end: "2025-10-07T11:00:00Z", title: "Team Meeting" },
          { userId: "1", start: "2025-10-07T11:30:00Z", end: "2025-10-07T12:30:00Z", title: "Design Review" },
          { userId: "1", start: "2025-10-07T13:00:00Z", end: "2025-10-07T14:00:00Z", title: "Project Update" },
          { userId: "1", start: "2025-10-07T14:00:00Z", end: "2025-10-07T16:00:00Z", title: "Workshop" },
          { userId: "1", start: "2025-10-07T16:30:00Z", end: "2025-10-07T17:30:00Z", title: "Code Review" },
          { userId: "1", start: "2025-10-07T18:00:00Z", end: "2025-10-07T19:00:00Z", title: "Late Sync" },
          
          { userId: "1", start: "2025-10-08T05:00:00Z", end: "2025-10-08T07:00:00Z", title: "Morning Meeting" },
          { userId: "1", start: "2025-10-08T07:30:00Z", end: "2025-10-08T08:30:00Z", title: "Team Sync" },
          { userId: "1", start: "2025-10-08T09:00:00Z", end: "2025-10-08T09:30:00Z", title: "Daily Standup" },
          { userId: "1", start: "2025-10-08T10:00:00Z", end: "2025-10-08T11:00:00Z", title: "Planning Session" },
          { userId: "1", start: "2025-10-08T11:00:00Z", end: "2025-10-08T12:00:00Z", title: "Client Call" },
          { userId: "1", start: "2025-10-08T12:30:00Z", end: "2025-10-08T13:30:00Z", title: "Lunch Meeting" },
          { userId: "1", start: "2025-10-08T13:00:00Z", end: "2025-10-08T14:00:00Z", title: "Code Review" },
          { userId: "1", start: "2025-10-08T14:30:00Z", end: "2025-10-08T15:30:00Z", title: "Tech Discussion" },
          { userId: "1", start: "2025-10-08T15:00:00Z", end: "2025-10-08T16:30:00Z", title: "Sprint Planning" },
          { userId: "1", start: "2025-10-08T17:00:00Z", end: "2025-10-08T18:00:00Z", title: "Team Retro" },
          { userId: "1", start: "2025-10-08T20:30:00Z", end: "2025-10-08T21:30:00Z", title: "Evening Call" },
          
          /*{ userId: "1", start: "2025-10-09T06:30:00Z", end: "2025-10-09T07:30:00Z", title: "Early Review" },
          { userId: "1", start: "2025-10-09T08:00:00Z", end: "2025-10-09T09:00:00Z", title: "Morning Standup" },
          { userId: "1", start: "2025-10-09T08:30:00Z", end: "2025-10-09T09:30:00Z", title: "Design Review" },
          { userId: "1", start: "2025-10-09T10:00:00Z", end: "2025-10-09T11:00:00Z", title: "Team Sync" },
          { userId: "1", start: "2025-10-09T11:30:00Z", end: "2025-10-09T12:30:00Z", title: "Client Meeting" },
          { userId: "1", start: "2025-10-09T13:00:00Z", end: "2025-10-09T14:00:00Z", title: "Product Demo" },
          { userId: "1", start: "2025-10-09T14:00:00Z", end: "2025-10-09T15:30:00Z", title: "Strategy Meeting" },
          { userId: "1", start: "2025-10-09T16:00:00Z", end: "2025-10-09T17:00:00Z", title: "1:1 Meeting" },
          { userId: "1", start: "2025-10-09T17:30:00Z", end: "2025-10-09T18:30:00Z", title: "Project Sync" },
          
          { userId: "1", start: "2025-10-10T06:00:00Z", end: "2025-10-10T07:00:00Z", title: "Early Call" },
          { userId: "1", start: "2025-10-10T07:30:00Z", end: "2025-10-10T08:30:00Z", title: "Team Meeting" },
          { userId: "1", start: "2025-10-10T09:00:00Z", end: "2025-10-10T10:00:00Z", title: "Standup" },
          { userId: "1", start: "2025-10-10T10:30:00Z", end: "2025-10-10T11:30:00Z", title: "Design Workshop" },
          { userId: "1", start: "2025-10-10T11:00:00Z", end: "2025-10-10T12:30:00Z", title: "Product Demo" },
          { userId: "1", start: "2025-10-10T13:00:00Z", end: "2025-10-10T14:00:00Z", title: "Client Call" },
          { userId: "1", start: "2025-10-10T13:30:00Z", end: "2025-10-10T14:30:00Z", title: "1:1 with Manager" },
          { userId: "1", start: "2025-10-10T15:00:00Z", end: "2025-10-10T16:00:00Z", title: "Tech Discussion" },
          { userId: "1", start: "2025-10-10T16:30:00Z", end: "2025-10-10T17:30:00Z", title: "Architecture Review" },
          { userId: "1", start: "2025-10-10T18:00:00Z", end: "2025-10-10T19:00:00Z", title: "Late Meeting" },
          { userId: "1", start: "2025-10-10T20:00:00Z", end: "2025-10-10T21:00:00Z", title: "Evening Workshop" },*
          
          { userId: "1", start: "2025-10-11T06:30:00Z", end: "2025-10-11T07:30:00Z", title: "Morning Sync" },
          { userId: "1", start: "2025-10-11T08:00:00Z", end: "2025-10-11T09:00:00Z", title: "Team Retro" },
          { userId: "1", start: "2025-10-11T09:30:00Z", end: "2025-10-11T10:30:00Z", title: "Planning" },
          { userId: "1", start: "2025-10-11T10:00:00Z", end: "2025-10-11T11:00:00Z", title: "Client Presentation" },
          { userId: "1", start: "2025-10-11T11:30:00Z", end: "2025-10-11T12:30:00Z", title: "Sprint Review" },
          { userId: "1", start: "2025-10-11T13:00:00Z", end: "2025-10-11T14:00:00Z", title: "Team Lunch" },
          { userId: "1", start: "2025-10-11T14:00:00Z", end: "2025-10-11T15:00:00Z", title: "Weekly Review" },
          { userId: "1", start: "2025-10-11T15:30:00Z", end: "2025-10-11T16:30:00Z", title: "Code Review" },
          { userId: "1", start: "2025-10-11T17:00:00Z", end: "2025-10-11T18:00:00Z", title: "Team Sync" },
          { userId: "1", start: "2025-10-11T18:30:00Z", end: "2025-10-11T19:00:00Z", title: "Wrap-up" },
          
          // Woche 3 (30 Sep - 4 Okt) - erweitert
          { userId: "1", start: "2025-09-30T06:00:00Z", end: "2025-09-30T07:00:00Z", title: "Early Meeting" },
          { userId: "1", start: "2025-09-30T07:30:00Z", end: "2025-09-30T08:30:00Z", title: "Planning" },
          { userId: "1", start: "2025-09-30T09:00:00Z", end: "2025-09-30T10:00:00Z", title: "Team Standup" },
          { userId: "1", start: "2025-09-30T10:30:00Z", end: "2025-09-30T11:30:00Z", title: "Design Review" },
          { userId: "1", start: "2025-09-30T12:00:00Z", end: "2025-09-30T13:00:00Z", title: "Team Lunch" },
          { userId: "1", start: "2025-09-30T13:00:00Z", end: "2025-09-30T14:30:00Z", title: "Client Meeting" },
          { userId: "1", start: "2025-09-30T15:00:00Z", end: "2025-09-30T16:00:00Z", title: "Planning" },
          { userId: "1", start: "2025-09-30T16:30:00Z", end: "2025-09-30T17:30:00Z", title: "Code Review" },
          { userId: "1", start: "2025-09-30T18:00:00Z", end: "2025-09-30T19:00:00Z", title: "Late Call" },
          
          { userId: "1", start: "2025-10-01T06:30:00Z", end: "2025-10-01T07:30:00Z", title: "Early Sync" },
          { userId: "1", start: "2025-10-01T08:00:00Z", end: "2025-10-01T09:00:00Z", title: "Morning Sync" },
          { userId: "1", start: "2025-10-01T09:30:00Z", end: "2025-10-01T10:30:00Z", title: "Client Call" },
          { userId: "1", start: "2025-10-01T10:00:00Z", end: "2025-10-01T11:30:00Z", title: "Design Workshop" },
          { userId: "1", start: "2025-10-01T12:00:00Z", end: "2025-10-01T13:00:00Z", title: "Product Demo" },
          { userId: "1", start: "2025-10-01T13:30:00Z", end: "2025-10-01T14:30:00Z", title: "Architecture Meeting" },
          { userId: "1", start: "2025-10-01T14:00:00Z", end: "2025-10-01T15:00:00Z", title: "1:1 Meeting" },
          { userId: "1", start: "2025-10-01T15:30:00Z", end: "2025-10-01T16:30:00Z", title: "Team Sync" },
          { userId: "1", start: "2025-10-01T17:00:00Z", end: "2025-10-01T18:00:00Z", title: "Sprint Review" },
          { userId: "1", start: "2025-10-01T20:00:00Z", end: "2025-10-01T21:00:00Z", title: "Evening Workshop" },
          
          { userId: "1", start: "2025-10-02T06:00:00Z", end: "2025-10-02T07:00:00Z", title: "Morning Call" },
          { userId: "1", start: "2025-10-02T07:30:00Z", end: "2025-10-02T08:30:00Z", title: "Team Meeting" },
          { userId: "1", start: "2025-10-02T09:00:00Z", end: "2025-10-02T09:30:00Z", title: "Daily Standup" },
          { userId: "1", start: "2025-10-02T10:00:00Z", end: "2025-10-02T11:00:00Z", title: "Client Sync" },
          { userId: "1", start: "2025-10-02T11:00:00Z", end: "2025-10-02T12:00:00Z", title: "Architecture Review" },
          { userId: "1", start: "2025-10-02T12:30:00Z", end: "2025-10-02T13:30:00Z", title: "Lunch Meeting" },
          { userId: "1", start: "2025-10-02T13:00:00Z", end: "2025-10-02T14:00:00Z", title: "Team Sync" },
          { userId: "1", start: "2025-10-02T14:30:00Z", end: "2025-10-02T15:30:00Z", title: "Design Review" },
          { userId: "1", start: "2025-10-02T15:30:00Z", end: "2025-10-02T17:00:00Z", title: "Sprint Planning" },
          { userId: "1", start: "2025-10-02T17:30:00Z", end: "2025-10-02T18:30:00Z", title: "Code Review" },
          { userId: "1", start: "2025-10-02T20:30:00Z", end: "2025-10-02T21:30:00Z", title: "Late Call" },
          
          { userId: "1", start: "2025-10-03T06:30:00Z", end: "2025-10-03T07:30:00Z", title: "Early Review" },
          { userId: "1", start: "2025-10-03T08:00:00Z", end: "2025-10-03T09:00:00Z", title: "Morning Standup" },
          { userId: "1", start: "2025-10-03T08:30:00Z", end: "2025-10-03T09:30:00Z", title: "Client Call" },
          { userId: "1", start: "2025-10-03T10:00:00Z", end: "2025-10-03T11:00:00Z", title: "Team Meeting" },
          { userId: "1", start: "2025-10-03T11:00:00Z", end: "2025-10-03T12:30:00Z", title: "Product Review" },
          { userId: "1", start: "2025-10-03T13:00:00Z", end: "2025-10-03T14:00:00Z", title: "Strategy Session" },
          { userId: "1", start: "2025-10-03T14:00:00Z", end: "2025-10-03T15:00:00Z", title: "Tech Talk" },
          { userId: "1", start: "2025-10-03T15:30:00Z", end: "2025-10-03T16:30:00Z", title: "1:1 Meeting" },
          { userId: "1", start: "2025-10-03T16:00:00Z", end: "2025-10-03T17:00:00Z", title: "Review Meeting" },
          { userId: "1", start: "2025-10-03T17:30:00Z", end: "2025-10-03T18:30:00Z", title: "Team Retro" },
          
          { userId: "1", start: "2025-10-04T06:00:00Z", end: "2025-10-04T07:00:00Z", title: "Early Call" },
          { userId: "1", start: "2025-10-04T07:30:00Z", end: "2025-10-04T08:30:00Z", title: "Planning" },
          { userId: "1", start: "2025-10-04T09:00:00Z", end: "2025-10-04T10:00:00Z", title: "Team Meeting" },
          { userId: "1", start: "2025-10-04T10:30:00Z", end: "2025-10-04T11:30:00Z", title: "Design Workshop" },
          { userId: "1", start: "2025-10-04T11:00:00Z", end: "2025-10-04T12:00:00Z", title: "Client Sync" },
          { userId: "1", start: "2025-10-04T12:30:00Z", end: "2025-10-04T13:30:00Z", title: "Lunch & Learn" },
          { userId: "1", start: "2025-10-04T14:00:00Z", end: "2025-10-04T15:30:00Z", title: "Workshop" },
          { userId: "1", start: "2025-10-04T16:00:00Z", end: "2025-10-04T17:00:00Z", title: "Sprint Review" },
          { userId: "1", start: "2025-10-04T17:30:00Z", end: "2025-10-04T18:30:00Z", title: "Team Sync" },
          { userId: "1", start: "2025-10-04T18:00:00Z", end: "2025-10-04T19:00:00Z", title: "Late Meeting" },
          
          // Woche 4 (23-27 Sep)
          { userId: "1", start: "2025-09-23T08:00:00Z", end: "2025-09-23T09:00:00Z", title: "Weekly Kickoff" },
          { userId: "1", start: "2025-09-23T10:00:00Z", end: "2025-09-23T11:00:00Z", title: "Team Standup" },
          { userId: "1", start: "2025-09-23T13:00:00Z", end: "2025-09-23T14:30:00Z", title: "Client Demo" },
          { userId: "1", start: "2025-09-23T15:00:00Z", end: "2025-09-23T16:00:00Z", title: "Planning Session" },
          
          { userId: "1", start: "2025-09-24T09:00:00Z", end: "2025-09-24T10:00:00Z", title: "Standup" },
          { userId: "1", start: "2025-09-24T11:00:00Z", end: "2025-09-24T12:30:00Z", title: "Design Review" },
          { userId: "1", start: "2025-09-24T14:00:00Z", end: "2025-09-24T15:00:00Z", title: "1:1 Coaching" },
          
          { userId: "1", start: "2025-09-25T08:00:00Z", end: "2025-09-25T09:30:00Z", title: "Project Kickoff" },
          { userId: "1", start: "2025-09-25T10:00:00Z", end: "2025-09-25T11:00:00Z", title: "Team Meeting" },
          { userId: "1", start: "2025-09-25T13:30:00Z", end: "2025-09-25T15:00:00Z", title: "Architecture Workshop" },
          { userId: "1", start: "2025-09-25T16:00:00Z", end: "2025-09-25T17:00:00Z", title: "Code Review" },
          
          { userId: "1", start: "2025-09-26T09:00:00Z", end: "2025-09-26T09:30:00Z", title: "Daily Sync" },
          { userId: "1", start: "2025-09-26T10:00:00Z", end: "2025-09-26T11:00:00Z", title: "Client Call" },
          { userId: "1", start: "2025-09-26T13:30:00Z", end: "2025-09-26T15:00:00Z", title: "Design Workshop" },
          { userId: "1", start: "2025-09-26T15:30:00Z", end: "2025-09-26T16:30:00Z", title: "Team Retro" },
          
          { userId: "1", start: "2025-09-27T08:00:00Z", end: "2025-09-27T09:00:00Z", title: "Weekly Review" },
          { userId: "1", start: "2025-09-27T09:00:00Z", end: "2025-09-27T10:30:00Z", title: "Team Standup" },
          { userId: "1", start: "2025-09-27T11:00:00Z", end: "2025-09-27T12:00:00Z", title: "Product Planning" },
          { userId: "1", start: "2025-09-27T14:00:00Z", end: "2025-09-27T16:00:00Z", title: "Workshop" },
          
          // Woche 5 (16-20 Sep) - Ältere Events
          { userId: "1", start: "2025-09-16T09:00:00Z", end: "2025-09-16T10:00:00Z", title: "Team Meeting" },
          { userId: "1", start: "2025-09-16T14:00:00Z", end: "2025-09-16T15:30:00Z", title: "Client Sync" },
          
          { userId: "1", start: "2025-09-17T08:00:00Z", end: "2025-09-17T09:00:00Z", title: "Planning" },
          { userId: "1", start: "2025-09-17T10:00:00Z", end: "2025-09-17T11:30:00Z", title: "Workshop" },
          { userId: "1", start: "2025-09-17T13:00:00Z", end: "2025-09-17T14:00:00Z", title: "1:1" },
          
          { userId: "1", start: "2025-09-18T09:00:00Z", end: "2025-09-18T10:00:00Z", title: "Standup" },
          { userId: "1", start: "2025-09-18T11:00:00Z", end: "2025-09-18T12:00:00Z", title: "Design Review" },
          { userId: "1", start: "2025-09-18T14:00:00Z", end: "2025-09-18T16:00:00Z", title: "Sprint Planning" },
          
          { userId: "1", start: "2025-09-19T08:30:00Z", end: "2025-09-19T09:30:00Z", title: "Client Meeting" },
          { userId: "1", start: "2025-09-19T10:00:00Z", end: "2025-09-19T11:00:00Z", title: "Team Sync" },
          { userId: "1", start: "2025-09-19T15:00:00Z", end: "2025-09-19T16:00:00Z", title: "Review" },
          
          { userId: "1", start: "2025-09-20T09:00:00Z", end: "2025-09-20T10:00:00Z", title: "Friday Standup" },
          { userId: "1", start: "2025-09-20T11:00:00Z", end: "2025-09-20T12:00:00Z", title: "Demo" },
          { userId: "1", start: "2025-09-20T14:00:00Z", end: "2025-09-20T15:00:00Z", title: "Weekly Review" },
        ]} />*/}
      </View>
    </View>
  )
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @description The chart component for the dashboard statistic cards
 * -> The informations for the chart are stored in the dashboard context "DashboardContext"
 * @component */
const DashboardStatisticsChart = () => {
  /**
   * @description Contains the title and the line area data for the chart
   */
  const chart = useDashboardContextStore((state) => state.chart);

  /** @description The initial item that the pointer component is pointing to */
  const [lineAreaData, setLineAreaData] = React.useState<ChartLineAreaDataProps>(chart.lineAreaData);

  const generateData = () => {
    const data = [];
    const today = new Date();
    let currentValue = 120; // Start with a mid-range value
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Generate small random change between -15 and +15
      const change = (Math.random() * 30) - 10;
      currentValue = Math.max(20, Math.min(240, currentValue + change));
      
      data.push({
        value: Math.floor(currentValue),
        now: date,
        dataPointLabel: `${currentValue.toFixed(2)}`,
      });
    }
    
    return data;
  }
  const [data, setData] = React.useState(() => {
    return generateData();
  });

  React.useLayoutEffect(() => {
    setData(generateData());
  }, [chart.title]);

  return (
    <>
    <ChartLineAreaPointer
      title={chart.title}
      value={chart.showCurrency ? lineAreaData.value.toFixed(2) : lineAreaData.value.toString()}
      now={lineAreaData.now}
      showCurrency={chart.showCurrency} />
    <ChartLineArea
      data={data}
      showReferenceLine1={true}
      showCurrency={chart.showCurrency}
      onPointerComponentMove={setLineAreaData}
      pointerComponentColor="#75B39B"
      pointerStripColor="#75B39B"
      startFillColor="#75B39B"
      endFillColor="#8ad3b7"/>
    </>
  )
}

export default DashboardStatistics;