import { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import TextBase from "@/components/typography/Text";

import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ListItemGroupProps = PropsWithChildren & {
  title?: string;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @description A container for a group of settings
 * -> Used for components such as ListItemWithChildren or all the other components that are registered in the path components/list/..
 * @param {ListItemGroupProps} param0
 * @param {string} param0.title - The title of the group
 * @param {number} param0.gap - The gap of the group between the items
 * @param {React.ReactNode} param0.children - The children of the group
 * @component */
const ListItemGroup = ({
  title,
  gap = 10,
  children,
  style
}: ListItemGroupProps) => {
  return (
    <View style={[style, { gap }]}>
      {title && <TextBase 
        text={title}
        type="label"
        style={[GlobalTypographyStyle.standardText, { 
          fontSize: 9,
          textTransform: "uppercase"
      }]} />}
      {children}
    </View>
  )
}

export default ListItemGroup;