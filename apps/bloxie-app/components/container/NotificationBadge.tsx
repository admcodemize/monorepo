import { View } from "react-native"

import { useThemeColor } from "@/hooks/theme/useThemeColor";

import NotificationBadgeStyle from "@/styles/components/container/NotificationBadge";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
export type NotificationBadgeProps = {
  hide?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a component with generic children which handles the visibility of a top right corner badge
 * @since 0.0.1
 * @version 0.0.1
 * @param {Object} param0 - Handles the styling and activity of an icon based button
 * @param {IconProp} param0.hide - Hiding badge component */
const NotificationBadge: React.FC<React.PropsWithChildren<NotificationBadgeProps>> = ({
  hide = false,
  children
}) => {
  const errorColor = useThemeColor("error");

  return (
    <View>
      <View style={[NotificationBadgeStyle.view, { 
        display: hide ? "none" : "flex",
        backgroundColor: errorColor
      }]}/>
      {children}
    </View>
  )
}

export default NotificationBadge;