import { getLocalization } from "@/helpers/System";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { View } from "react-native";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import { Dimensions } from "react-native";
import TextBase from "@/components/typography/Text";
import { LegendListRenderItemProps } from "@legendapp/list";
import { DatesInMonthInfoProps, WeeksInMonthProps } from "@codemize/helpers/DateTime";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import CalendarMonthDay from "./CalendarMonthDay";
import React from "react";
import { STYLES } from "@codemize/constants/Styles";

const DIM = Dimensions.get("window");

const CalendarMonthListItem = ({ 
  year,
  month,
  weeks
}: DatesInMonthInfoProps) => {
  return (
    <View style={{ 
      width: DIM.width,
    }}>
        {/* Weeks with Days */}
        <View>
          {weeks.map((week, weekIdx) => (
            <CalendarMonthWeekRow 
              key={`week-${week.number}-${weekIdx}`}
              week={week}
              currentMonth={month}
              currentYear={year} />
          ))}
        </View>
      </View>
  )
}

/**
| * @private
| * @author Marc Stöckli - Codemize GmbH 
| * @description Renders a single week row in the month calendar
| * @since 0.0.5
| * @version 0.0.1
| * @component */
const CalendarMonthWeekRow = React.memo(({ 
  week, 
  currentMonth,
  currentYear
}: { 
  week: WeeksInMonthProps;
  currentMonth: number;
  currentYear: number;
}) => {
  const colors = useThemeColors();
  const today = new Date();
  
  return (
    <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 1, marginVertical: 0.5 }]}>
      <TextBase text={week.number.toString()} i18nTranslation={false} type="label" style={[GlobalTypographyStyle.labelText, { 
        fontSize: 9, width: STYLES.calendarHourWidth, textAlign: "center", color: colors.infoColor,

      }]} />
      {week.dates.map((dateInWeek, idx) => {
        const isCurrentMonth = dateInWeek.now.getMonth() === currentMonth;
        const isToday = dateInWeek.now.getDate() === today.getDate() && 
                       dateInWeek.now.getMonth() === today.getMonth() &&
                       dateInWeek.now.getFullYear() === today.getFullYear();
        
        return (
          <CalendarMonthDay 
            key={`date-${idx}-${dateInWeek.number}${dateInWeek.now.toISOString()}`}
            dateInWeek={dateInWeek} 
            selected={new Date()}
            month={currentMonth}
             />
         /*} <TouchableHaptic
            key={`date-${idx}-${date.number}`}
            onPress={() => console.log('Selected:', date.now)}
            style={{ 
              width: DAY_SIZE,
              height: 26,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isToday ? colors.primaryBgColor : 'transparent'
            }}>
            <TextBase 
              text={date.number.toString()}
              i18nTranslation={false}
              type="label"
              style={[GlobalTypographyStyle.labelText, { 
                fontSize: 12,
                color: isToday 
                  ? colors.primaryContentColor
                  : isCurrentMonth 
                    ? colors.primaryContentColor
                    : colors.infoColor,
                opacity: isCurrentMonth ? 1 : 0.4
              }]} />
          </TouchableHaptic>*/
        );
      })}
    </View>
  );
});

export default CalendarMonthListItem;