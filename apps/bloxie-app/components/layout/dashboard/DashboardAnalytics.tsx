import { t } from "i18next";
import React from "react";
import { GestureResponderEvent, View } from "react-native";

import { faUsersBetweenLines, faRotate, faUserSecret } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { STYLES } from "@codemize/constants/Styles";

import { DROPDOWN_DASHBOARD_PERIOD } from "@/constants/Models";
import { DashboardDropdownItemKeyDays, useDashboardContextStore } from "@/context/DashboardContext";
import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableDropdown, { open as _open } from "@/components/button/TouchableDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";
import TitleWithDescription from "@/components/typography/TitleWithDescription";
import TouchableDropdownItemBase from "@/components/button/TouchableDropdownItemBase";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type TouchableDropdownBaseProps = {
  onPress: (itemKey: string|number|DashboardDropdownItemKeyDays) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DashboardAnalyticsProps = {
  refContainer: React.RefObject<View>;
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
 * @param {React.RefObject<View>} param0.refContainer - The container ref from parent component
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
  const { open } = useDropdown();

  /**
   * @description Get the dropdown context store for handling the selected item key for teams and calendar.
   * @see {@link context/DashboardContext} */
  const dropdown = useDashboardContextStore((state) => state.dropdown);

  /**
   * @description Used to open the dropdown component
   * @param {React.RefObject<View|any>} ref - The ref of the dropdown component for calculating the measurement position
   * @param {GestureResponderEvent} e - The event of the dropdown component
   * @function */
  const onPressDropdown = React.useCallback(
    (ref: React.RefObject<View|any>) =>
    (children: React.ReactNode) =>
    (e: GestureResponderEvent) => {
    /** 
     * @description Open the dropdown component based on a calculated measurement template
     * @see {@link components/button/TouchableDropdown} */
    _open({
      refTouchable: ref,
      refContainer,
      open,
      children,
    });
  }, [open]);
  
  return (
    <View style={[{ gap: STYLES.sizeGap }]}>
      <TitleWithDescription
        title={t("i18n.screens.dashboard.analytics.title")}
        description={t("i18n.screens.dashboard.analytics.description")} />
      <View style={[GlobalContainerStyle.rowCenterBetween]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
          <TouchableHapticDropdown
            ref={refTeams}
            icon={faUsersBetweenLines as IconProp}
            text={"codemize.com"}
            backgroundColor={colors.primaryBgColor}
            onPress={onPressDropdown(refTeams)(<TouchableDropdownBaseTeams onPress={onPressTeams} />)} />
          <TouchableHapticDropdown
            ref={refCalendar}
            icon={DROPDOWN_DASHBOARD_PERIOD.find(({ key}) => key === dropdown.itemKeyDays)!.iconDuotone as IconProp}
            text={t(DROPDOWN_DASHBOARD_PERIOD.find(({ key}) => key === dropdown.itemKeyDays)!.title)}
            backgroundColor={colors.primaryBgColor}
            onPress={onPressDropdown(refCalendar)(<TouchableDropdownBaseDays onPress={onPressDays} />)} />
        </View>
        <View>
          <TouchableHapticIcon
            icon={faRotate as IconProp}
            iconColor={colors.primaryIconColor}
            backgroundColor={colors.primaryBgColor}
            onPress={onPressRefresh} />
        </View>
      </View>
    </View>
  )
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @description The dropdown component for displaying the teams and the private calendar for users selection
 * @component */
const TouchableDropdownBaseTeams = ({
  onPress
}: TouchableDropdownBaseProps) => {
  /**
   * @description Get the dropdown context store for handling the selected item key for teams and calendar.
   * @see {@link context/DashboardContext} */
   const setDropdown = useDashboardContextStore((state) => state.setDropdown);
   const dropdown = useDashboardContextStore((state) => state.dropdown);

  /**
   * @description Used to handle the press event of the dropdown item
   * @param {GestureResponderEvent} e - The event of the dropdown item
   * @param {string|number} key - The key of the dropdown item
   * @function */
  const onPressItem = React.useCallback(
    (key: string|number|DashboardDropdownItemKeyDays) => {
      onPress(key);
      setDropdown("itemKeyTeam", key);
    }, [onPress]);

  return (
    <TouchableDropdown>
      <TouchableDropdownItemBase
        key={0}
        itemKey={0}
        icon={faUsersBetweenLines as IconProp}
        text="codemize.com"
        isSelected={dropdown.itemKeyTeam === 0}
        onPress={onPressItem} />
      <TouchableDropdownItemBase
        key={1}
        itemKey={1}
        icon={faUserSecret as IconProp}
        text="Privater Kalender"
        isSelected={dropdown.itemKeyTeam === 1}
        onPress={onPressItem} />
    </TouchableDropdown>
  )
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @description The dropdown component for displaying the possible periods for displaying the analytics
 * @component */
const TouchableDropdownBaseDays = ({
  onPress
}: TouchableDropdownBaseProps) => {
  /**
   * @description Get the dropdown context store for handling the selected item key for teams and calendar.
   * @see {@link context/DashboardContext} */
   const setDropdown = useDashboardContextStore((state) => state.setDropdown);
   const dropdown = useDashboardContextStore((state) => state.dropdown);

  /**
   * @description Used to handle the press event of the dropdown item
   * @param {GestureResponderEvent} e - The event of the dropdown item
   * @param {string|number} key - The key of the dropdown item
   * @function */
  const onPressItem = React.useCallback(
    (key: string|number|DashboardDropdownItemKeyDays) => {
      onPress(key as DashboardDropdownItemKeyDays);
      setDropdown("itemKeyDays", key);
    }, [onPress]);

  return (
    <TouchableDropdown>
      {DROPDOWN_DASHBOARD_PERIOD.map((period) => (
        <TouchableDropdownItemBase
          key={period.key}
          itemKey={period.key}
          icon={period.iconDuotone as IconProp}
          text={period.title}
          isSelected={dropdown.itemKeyDays === period.key}
          onPress={onPressItem} />
      ))}
    </TouchableDropdown>
  )
}

export default DashboardAnalytics;