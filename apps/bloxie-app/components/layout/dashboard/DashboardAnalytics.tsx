import { t } from "i18next";
import React from "react";
import { GestureResponderEvent, View } from "react-native";

import { faUsersBetweenLines } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { STYLES } from "@codemize/constants/Styles";

import { DROPDOWN_DASHBOARD_PERIOD } from "@/constants/Models";
import { DashboardDropdownItemKeyDays, useDashboardContextStore } from "@/context/DashboardContext";
import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @type */
type TouchableDropdownBaseTeamsProps = {
  onPress: (itemKey: string|number) => void;
  selectedTeam: string|number;
  onSelectTeam: (itemKey: string|number) => void;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1
 * @type */
type TouchableDropdownBaseDaysProps = {
  onPress: (itemKey: string|number|DashboardDropdownItemKeyDays) => void;
  selectedDay: DashboardDropdownItemKeyDays;
  onSelectDay: (itemKey: string|number|DashboardDropdownItemKeyDays) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DashboardAnalyticsProps = {
  refContainer: React.RefObject<View|null>;
  onPressRefresh: () => void;
  onPressTeams: (itemKey: string|number) => void;
  onPressDays: (itemKey: string|number|DashboardDropdownItemKeyDays) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {DashboardAnalyticsProps} param0
 * @param {Function} param0.onPressRefresh - The function to call when the refresh button is pressed 
 * @param {Function} param0.onPressTeams - The function to call when an item in the teams dropdown is pressed
 * @param {Function} param0.onPressDays - The function to call when an item in the days dropdown is pressed
 * @component */
const DashboardAnalytics = ({
  refContainer,
  onPressRefresh,
  onPressTeams,
  onPressDays
}: DashboardAnalyticsProps) => {
  const refTeams = React.useRef<View>(null);
  const refCalendar = React.useRef<View>(null);

  const colors = useThemeColors();

 /**
   * @description Get the dropdown functions.
   * @see {@link hooks/container/useDropdown} */
   const { state: { open }, open: _open } = useDropdown();

  /**
   * @description Get the dropdown context store for handling the selected item key for teams and calendar.
   * @see {@link context/DashboardContext} */
  const dropdown = useDashboardContextStore((state) => state.dropdown);
  const setDropdown = useDashboardContextStore((state) => state.setDropdown);

  /**
   * @description Used to handle the selection of the team dropdown item
   * @param {string|number} key - The key of the team
   * @function */
  const handleSelectTeam = React.useCallback((key: string|number) => setDropdown("itemKeyTeam", key), [setDropdown]);

  /**
   * @description Used to handle the selection of the day dropdown item
   * @param {string|number|DashboardDropdownItemKeyDays} key - The key of the day
   * @function */
  const handleSelectDay = React.useCallback((key: string|number|DashboardDropdownItemKeyDays) => setDropdown("itemKeyDays", key as DashboardDropdownItemKeyDays), [setDropdown]);

  /**
   * @description Used to open the dropdown component
   * @param {React.RefObject<View|any>} ref - The ref of the dropdown component for calculating the measurement position
   * @function */
  const onPressDropdown = 
    (ref: React.RefObject<View|any>) =>
    (children: React.ReactNode) =>
    (e: GestureResponderEvent) => {
    /** 
     * @description Open the dropdown component based on a calculated measurement template
     * @see {@link components/button/TouchableDropdown} */
    /*_open({
      refTouchable: ref,
      relativeToRef: refContainer,
      hostId: "tray",
      open,
      children,
    });*/
  }
  
  return (
    <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
      <TouchableHapticDropdown
        ref={refTeams}
        icon={faUsersBetweenLines as IconProp}
        text={"codemize.com"}
        onPress={onPressDropdown(refTeams)(<TouchableDropdownBaseTeams 
          onPress={onPressTeams} 
          selectedTeam={dropdown.itemKeyTeam} 
          onSelectTeam={handleSelectTeam} />)} />
      <TouchableHapticDropdown
        ref={refCalendar}
        icon={DROPDOWN_DASHBOARD_PERIOD.find(({ key}) => key === dropdown.itemKeyDays)!.iconDuotone as IconProp}
        text={t(DROPDOWN_DASHBOARD_PERIOD.find(({ key}) => key === dropdown.itemKeyDays)!.title)}
        onPress={onPressDropdown(refCalendar)(<TouchableDropdownBaseDays 
          onPress={onPressDays} 
          selectedDay={dropdown.itemKeyDays} 
          onSelectDay={handleSelectDay} />)} />
    </View>
  )
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @param {TouchableDropdownBaseTeamsProps} param0
 * @param {Function} param0.onPress - The function to call when the dropdown item is pressed
 * @param {string|number} param0.selectedTeam - The selected team
 * @param {Function} param0.onSelectTeam - The function to call when the dropdown item is selected
 * @description The dropdown component for displaying the teams and the private calendar for users selection
 * @component */
const TouchableDropdownBaseTeams = ({
  onPress,
  selectedTeam,
  onSelectTeam
}: TouchableDropdownBaseTeamsProps) => {
  /**
   * @description Used to handle the press event of the dropdown item
   * @param {string|number} key - The key of the dropdown item
   * @function */
  const onPressItem = 
    (key: string|number|DashboardDropdownItemKeyDays) => {
      onPress(key);
      onSelectTeam(key);
    }

  return (
    <View />
  )
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @description The dropdown component for displaying the possible periods for displaying the analytics
 * @param {TouchableDropdownBaseDaysProps} param0
 * @param {Function} param0.onPress - The function to call when the dropdown item is pressed
 * @param {DashboardDropdownItemKeyDays} param0.selectedDay - The selected day
 * @param {Function} param0.onSelectDay - The function to call when the dropdown item is selected
 * @component */
const TouchableDropdownBaseDays = ({
  onPress,
  selectedDay,
  onSelectDay
}: TouchableDropdownBaseDaysProps) => {
  /**
   * @description Used to handle the press event of the dropdown item
   * @param {string|number} key - The key of the dropdown item
   * @function */
  const onPressItem = 
    (key: string|number|DashboardDropdownItemKeyDays) => {
      onPress(key as DashboardDropdownItemKeyDays);
      onSelectDay(key as DashboardDropdownItemKeyDays);
    }

    //DROPDOWN_DASHBOARD_PERIOD
  return (
    <View />
  )
}

export default DashboardAnalytics;