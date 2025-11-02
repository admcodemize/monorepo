import React from "react";
import { Dimensions, GestureResponderEvent, ScrollView, StyleSheet, Text, View } from "react-native";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCalendarDays, faCalendarRange, faCaretLeft, faCaretRight, faChevronLeft, faChevronRight, faCircleChevronLeft, faCircleChevronRight, faGlobe, faRectangleHistory, faStopwatch, faUserSecret } from "@fortawesome/duotone-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { getMonthWide } from "@codemize/helpers/DateTime";
import { STYLES } from "@codemize/constants/Styles";

import { useCalendarContextStore } from "@/context/CalendarContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useDropdown } from "@/hooks/button/useDropdown";

import TouchableDropdown, { open as _open } from "@/components/button/TouchableDropdown";
import TouchableHaptic from "../button/TouchableHaptic";
import TextBase from "../typography/Text";
import CalendarDay from "./day/CalendarDay";
import CalendarWeek from "./week/CalendarWeek";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import { getLocalization } from "@/helpers/System";
import TouchableHapticDropdown from "../button/TouchableHapticDropdown";
import TouchableHapticIcon from "../button/TouchableHaptichIcon";
import Divider from "../container/Divider";
import CalendarWeekList from "./week/CalendarWeekList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TouchableHapticText from "../button/TouchableHaptichText";
import { useTrays } from "react-native-trays";
import { DROPDOWN_CALENDAR_VIEWS, DROPDOWN_DASHBOARD_PERIOD } from "@/constants/Models";
import TouchableDropdownItemBase from "../button/TouchableDropdownItemBase";
import BottomSheet, { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import ViewBase from "../container/View";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import CalendarStyle from "@/styles/components/calendar/Calendar";
import TrayHeader from "../container/TrayHeader";
import BottomSheetHeader from "../container/BottomSheetHeader";

/** @description Height constants for expand/collapse */
const COLLAPSED_HEIGHT = 56;
const EXPANDED_HEIGHT = 300;
const DRAG_THRESHOLD = 50;

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type CreateEventSheetProps = {
  snapPoints: (string | number)[];
  onPressCreate: () => void;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type TouchableDropdownBaseProps = {
  onPress: (itemKey: string|number) => void;
}

const Calendar = ({
  refContainer,
  showDragHandle = false
}: {
  showDragHandle?: boolean;
  refContainer: React.RefObject<View>;
}) => {
  const colors = useThemeColors();
  const locale = getLocalization();

  const week = useCalendarContextStore((state) => state.week);

  const bottomSheetRef = React.useRef<BottomSheet>(null);


  const refCalendar = React.useRef<View>(null);
   
  const { open } = useDropdown();

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
    <>
    <View style={{ flex: 1 }}>
      <View 
      style={[GlobalContainerStyle.rowCenterBetween, { 
        paddingHorizontal: 14, 
        borderTopWidth: 0, 
        borderTopColor: colors.primaryBorderColor, height: 30,
        marginBottom: 10,
        gap: 6
      }]}>
        <View 
          style={[GlobalContainerStyle.rowCenterCenter, { gap: 6 }]}>
            <TouchableHapticDropdown
              icon={faCalendarRange as IconProp}
              text={`${getMonthWide({ number: week.month, locale })} ${week.year.toString().substring(2)}`}
              backgroundColor={colors.tertiaryBgColor}
              onPress={() => {}} />
            <TouchableHapticDropdown
              icon={faStopwatch as IconProp}
              text={`GMT+10`}
              backgroundColor={colors.tertiaryBgColor}
              onPress={() => {}} />
            <TouchableHapticIcon
              ref={refCalendar}
              icon={faRectangleHistory as IconProp}
              backgroundColor={colors.tertiaryBgColor}
              onPress={onPressDropdown(refCalendar)(<TouchableDropdownBaseView onPress={() => {}} />)} />
            <Divider vertical />
        </View>

          {/*<ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}>
              {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"].map((time) => (
                <TouchableHaptic style={[{  padding: 4, paddingHorizontal: 6, borderRadius: 4, 
                backgroundColor: colors.focusedBgColor, height: 26
               }, 
                  GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                  <TextBase 
                    type="label" 
                    text={time}
                    i18nTranslation={false}
                    style={[GlobalTypographyStyle.titleSubtitle, { fontSize: 10, color: colors.focusedContentColor }]} />
                </TouchableHaptic>
              ))}
          </ScrollView>*/}
        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 6 }]}>
          <Divider vertical />
          <TouchableHapticText text="Heute" type="label" onPress={() => { console.log("Heute"); }} />
        </View>
      </View>
      <View style={[GlobalContainerStyle.rowCenterBetween, { 
        borderTopWidth: 1,
        backgroundColor: "#fcfcfc",
        borderBottomColor: colors.primaryBorderColor,  
        borderTopColor: colors.primaryBorderColor,
        height: 36,
        paddingHorizontal: 14
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 10 }]}>
        <View style={{ backgroundColor: colors.secondaryBgColor, padding: 4, borderRadius: 6, borderWidth: 1, borderColor: colors.primaryBorderColor }}>
        <FontAwesomeIcon
          icon={faUserSecret as IconProp}
          size={STYLES.sizeFaIcon + 2}
          color={colors.primaryIconColor} />
        </View>
          <View>
            <TextBase
              text="Private Kalender"
              style={[GlobalTypographyStyle.headerSubtitle, { color: colors.infoColor, fontSize: 10 }]}/>
            <TextBase
              text="Persönliche Termine"
              style={[GlobalTypographyStyle.labelText, { fontSize: 9, color: colors.infoColor }]} />
          </View>
        </View>
        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 10}]}>
          <View style={{ backgroundColor: colors.secondaryBgColor, padding: 4, borderRadius: 14, borderWidth: 1, borderColor: colors.primaryBorderColor,
           }}>
          <FontAwesomeIcon
            icon={faChevronLeft as IconProp}
            size={STYLES.sizeFaIcon}
            color={colors.primaryIconColor} />
          </View>
        <Divider vertical />
        <View style={{ backgroundColor: colors.secondaryBgColor, padding: 4, borderRadius: 14, borderWidth: 1, borderColor: colors.primaryBorderColor,
           }}>
          <FontAwesomeIcon
            icon={faChevronRight as IconProp}
            size={STYLES.sizeFaIcon}
            color={colors.primaryIconColor} />
          </View>
        </View>
      </View>
      <Divider style={{ width: "94%", marginLeft: "3%" }} />
      <View style={[ {  
        flex: 1,
        borderBottomWidth: 1,
        backgroundColor: colors.tertiaryBgColor,
        borderBottomColor: colors.primaryBorderColor,  
        borderTopColor: colors.primaryBorderColor
      }]}>
          <CalendarWeek now={new Date()} />
      </View>
      

    </View>
      <CreateEventSheet 
        ref={bottomSheetRef} 
        snapPoints={[Dimensions.get("window").height - 68 - 36 - 169]} 
        onPressCreate={() => { }} />
    </>
  );
};

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @description The sheet for creating a new event
 * @since 0.0.2
 * @version 0.0.1
 * @component */
const CreateEventSheet = React.forwardRef<BottomSheet, CreateEventSheetProps>(({
  snapPoints,
  onPressCreate
}, ref) => {
  const colors = useThemeColors();
  const { bottom } = useSafeAreaInsets();
  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      style={[CalendarStyle.sheetContainer, { borderColor: colors.primaryBorderColor }]}
      backgroundStyle={CalendarStyle.sheetBackgroundStyle}>
      <BottomSheetView style={[CalendarStyle.sheetContentContainer, { paddingBottom: bottom + 10 }]}>
        <View>
        <BottomSheetHeader
          title="Neuer Termin"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />

        </View>
      </BottomSheetView>
    </BottomSheet>
  )
});

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @description The dropdown component for displaying the possible periods for displaying the analytics
 * @component */
const TouchableDropdownBaseView = ({
  onPress
}: TouchableDropdownBaseProps) => {
  /**
   * @description Get the dropdown context store for handling the selected item key for teams and calendar.
   * @see {@link context/CalendarContext} */
   const setDropdown = useCalendarContextStore((state) => state.setDropdown);
   const dropdown = useCalendarContextStore((state) => state.dropdown);

  /**
   * @description Used to handle the press event of the dropdown item
   * @param {GestureResponderEvent} e - The event of the dropdown item
   * @param {string|number} key - The key of the dropdown item
   * @function */
  const onPressItem = React.useCallback(
    (key: string|number) => {
      onPress(key);
      setDropdown("itemKeyView", key);
    }, [onPress]);

  return (
    <TouchableDropdown>
      {DROPDOWN_CALENDAR_VIEWS.map((period) => (
        <TouchableDropdownItemBase
          key={period.key}
          itemKey={period.key}
          icon={period.iconDuotone as IconProp}
          text={period.title}
          isSelected={dropdown.itemKeyView === period.key}
          onPress={onPressItem} />
      ))}
    </TouchableDropdown>
  )
}

export default Calendar;