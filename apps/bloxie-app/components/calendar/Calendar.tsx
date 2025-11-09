import React from "react";
import { Dimensions, GestureResponderEvent, ScrollView, StyleSheet, Text, View } from "react-native";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft, faAngleRight, faCalendarDays, faCalendarRange, faCaretLeft, faCaretRight, faChevronLeft, faChevronRight, faCircleChevronLeft, faCircleChevronRight, faGlobe, faRectangleHistory, faSparkles, faStopwatch, faUserSecret } from "@fortawesome/duotone-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";

import { getDatesInMonth, getMonthWide, DatesInMonthInfoProps, WeeksInMonthProps, DatesInWeekInfoProps } from "@codemize/helpers/DateTime";
import { STYLES } from "@codemize/constants/Styles";
import { Month } from "date-fns";

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

import { useSafeAreaInsets } from "react-native-safe-area-context";
import TouchableHapticText from "../button/TouchableHaptichText";
import { useTrays } from "react-native-trays";
import { DROPDOWN_CALENDAR_VIEWS, DROPDOWN_DASHBOARD_PERIOD } from "@/constants/Models";
import TouchableDropdownItemBase from "../button/TouchableDropdownItemBase";
import ViewBase from "../container/View";
import CalendarStyle from "@/styles/components/calendar/Calendar";
import TrayHeader from "../container/TrayHeader";
import BottomSheetHeader from "../container/BottomSheetHeader";
import CalendarHeaderRight from "./CalendarHeaderRight";
import CalendarHeaderWeek from "./CalendarHeaderLeft";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import CalendarWeekDay from "./week/CalendarWeekDay";
import CalendarMonthDay from "./month/CalendarMonthDay";
import CalendarMonthHeaderMonth from "./month/CalendarMonthHeaderMonth";
import CalendarMonthHeaderYear from "./month/CalendarMonthHeaderYear";
import CalendarHeaderLeft from "./CalendarHeaderLeft";
import CalendarMonthHeader from "./month/CalendarMonthHeader";
import CalendarMonth from "./month/CalendarMonth";

/** @description Height constants for expand/collapse */
const COLLAPSED_HEIGHT = 0;
const EXPANDED_HEIGHT = 250;

/** @description Dimensions for month calendar */
const DIM = Dimensions.get("window");
const MONTH_WIDTH = DIM.width; // Full screen width for proper snapping
const MONTH_CONTENT_WIDTH = MONTH_WIDTH; // Content width with padding
const DAY_SIZE = MONTH_CONTENT_WIDTH / 7; // 7 days

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

  const setIsTodayPressed = useCalendarContextStore((state) => state.setIsTodayPressed);
  
  //const isMonthCalendarOpen = React.useRef(false);


  const isMonthExpanded = useSharedValue(false);
  
  // Toggle month calendar visibility
  const toggleMonthCalendar = () => {
    const newValue = !isMonthExpanded.value;
    isMonthExpanded.value = newValue;
  };
  
  return (
    <View style={{ flex: 1 }}>
      <View 
      style={[GlobalContainerStyle.rowCenterBetween, { 
        paddingHorizontal: 14, 
        height: 30,
        gap: 6,
        borderBottomWidth: 1,
        borderBottomColor: colors.primaryBorderColor,
        backgroundColor: "#f9f9f9"
      }]}>
          <CalendarHeaderLeft onPress={toggleMonthCalendar} />
          <CalendarHeaderRight refContainer={refContainer} />
      </View>


      {/* reanimated view opening when month is pressed */}
      <CalendarMonth isExpanded={isMonthExpanded} />


      <View style={[GlobalContainerStyle.rowCenterBetween, { 
        backgroundColor: "#f9f9f9",
        borderBottomColor: colors.primaryBorderColor,  
        height: 36,
        paddingHorizontal: 14
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 6 }]}>
        <View style={{ }}>
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

        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 6 }]}>
          <View style={{ 

           }}>
          <FontAwesomeIcon
            icon={faAngleLeft as IconProp}
            size={STYLES.sizeFaIcon}
            color={colors.primaryIconColor} />
          </View>
          <Divider vertical />
          <View style={{ 

            }}>
            <FontAwesomeIcon
              icon={faAngleRight as IconProp}
              size={STYLES.sizeFaIcon}
              color={colors.primaryIconColor} />
            </View>
        </View>

      </View>

      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 6 }]}>
      <TouchableHapticText text="Heute" onPress={() => setIsTodayPressed(true)} hasViewCustomStyle={true} viewCustomStyle={{}} />
        <Divider vertical />
        <TouchableHapticDropdown
          text="AI"
          icon={faSparkles as IconProp}
          onPress={() => {}}
          hasViewCustomStyle={true}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
        />
      </View>




      </View>






      <Divider />
      <View style={[ {  
        flex: 1,

        backgroundColor: colors.tertiaryBgColor,
        borderBottomColor: colors.primaryBorderColor,  
        borderTopColor: colors.primaryBorderColor
      }]}>
          <CalendarWeek now={new Date()} />
      </View>
      

    </View>
  );
};


export default Calendar;

          /*<ScrollView 
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
          </ScrollView>*/