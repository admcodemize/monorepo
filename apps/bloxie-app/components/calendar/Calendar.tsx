import React from "react";
import { View } from "react-native";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { getMonthWide } from "@codemize/helpers/DateTime";
import { STYLES } from "@codemize/constants/Styles";

import { useCalendarStore } from "@/context/CalendarContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHaptic from "../button/TouchableHaptic";
import TextBase from "../typography/Text";
import CalendarDay from "./day/CalendarDay";
import CalendarWeek from "./week/CalendarWeek";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import { getLocalization } from "@/helpers/System";

/** @description Height constants for expand/collapse */
const COLLAPSED_HEIGHT = 56;
const EXPANDED_HEIGHT = 300;
const DRAG_THRESHOLD = 50;

const Calendar = ({
  showDragHandle = false
}: {
  showDragHandle?: boolean;
}) => {
  const colors = useThemeColors();
  const locale = getLocalization();

  const week = useCalendarStore((state) => state.week);

  return (
    <View style={{ flex: 1 }}>
      <View style={[GlobalContainerStyle.rowCenterBetween, { 
        paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: colors.primaryBorderColor, height: 30,
        borderBottomWidth: 1, borderBottomColor: colors.primaryBorderColor,
        backgroundColor: colors.tertiaryBgColor
      }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 2 }]}>
          <TextBase 
            type="subtitle" 
            text={`${getMonthWide({ number: week.month, locale })} ${week.year}`}
            style={[GlobalTypographyStyle.titleSubtitle, { fontSize: 11, color: colors.infoColor }]} />
          <FontAwesomeIcon icon={faCaretDown as IconProp} size={STYLES.sizeFaIcon} color={colors.infoColor} />
        </View>
        <TouchableHaptic style={[{  padding: 4, paddingHorizontal: 6, borderRadius: 4 }, 
          GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
          <TextBase 
            type="label" 
            text={"Heute"}
            style={[GlobalTypographyStyle.titleSubtitle, { fontSize: 11, color: colors.infoColor }]} />
        </TouchableHaptic>
      </View>
      <View style={[ { 
        borderBottomWidth: 1, 
        borderBottomColor: colors.primaryBorderColor,  
        overflow: "hidden",
        paddingVertical: 4,
        paddingBottom: 2,
        height: 60
      }]}>
          <CalendarWeek />
      </View>
      <CalendarDay now={week.startOfWeek} />
    </View>
  );
};

export default Calendar;
