import { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSquareInfo } from "@fortawesome/pro-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";
import TouchableHaptic from "@/components/button/TouchableHaptic";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @type */
export type ListItemGroupProps = PropsWithChildren & {
  title?: string;
  description?: string;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.4
 * @description A container for a group of settings
 * -> Used for components such as ListItemWithChildren or all the other components that are registered in the path components/list/..
 * @param {ListItemGroupProps} param0
 * @param {string} param0.title - The title of the group
 * @param {string} param0.description - The description of the group will be displayed in a bottom sheet
 * @param {number} param0.gap - The gap of the group between the items
 * @param {React.ReactNode} param0.children - The children of the group
 * @component */
const ListItemGroup = ({
  title,
  description,
  gap = 14,
  children,
  style
}: ListItemGroupProps) => {
  const { primaryIconColor } = useThemeColors();
  return (
    <View style={[style, { gap }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
        {title && <TextBase 
          text={title}
          type="label"
          style={[{ 
            textTransform: "uppercase",
            fontSize: 10
          }]} />}
        {description && <TouchableHaptic onPress={() => { console.log(description); }}>
          <FontAwesomeIcon 
              icon={faSquareInfo as IconProp} 
              size={12} 
              color={primaryIconColor} />
          </TouchableHaptic>}
      </View>
      {children}
    </View>
  )
}

export default ListItemGroup;