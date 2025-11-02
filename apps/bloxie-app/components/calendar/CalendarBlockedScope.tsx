import { View } from "react-native";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { GlobalLayoutProps } from "@/types/GlobalLayout";

import CalendarBlockedScopeStyle from "@/styles/components/calendar/CalendarBlockedScope";


/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export interface CalendarBlockedScopeProps {
  layout: GlobalLayoutProps;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {CalendarBlockedScopeProps} param0
 * @param {GlobalLayoutProps} param0.layout - The layout of the blocked scope (top, left, width, height)
 * @function */
const CalendarBlockedScope = ({
  layout
}: CalendarBlockedScopeProps) => {
  const colors = useThemeColors();
  return (
    <View
      pointerEvents="none"
      style={[CalendarBlockedScopeStyle.view, {
        height: layout.height,
        width: layout.width,
        backgroundColor: colors.blockedScopeBgColor,
        top: layout.top,
        left: layout.left
      }]}
    />
  )
}

export default CalendarBlockedScope;