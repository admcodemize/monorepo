import { PropsWithChildren } from "react";
import { ScrollView, View, ViewStyle } from "react-native";


import { DropdownContextPositionProps } from "@/context/DropdownContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import { measureInWindowLeft } from "@/helpers/System";
import TouchableDropdownStyle from "@/styles/components/button/TouchableDropdown";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type TouchableDropdownProps = PropsWithChildren & ViewStyle & {
  style?: ViewStyle|ViewStyle[];
  gapBetweenItems?: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type OpenDropdownProps = PropsWithChildren & {
  refTouchable: React.RefObject<View|null>;
  refContainer: React.RefObject<View>;
  containerWidth?: number;
  open: (children: React.ReactNode, position: DropdownContextPositionProps|null) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {OpenDropdownProps} param0 
 * @param {React.RefObject<View>} param0.refTouchable - The touchable ref
 * @param {React.RefObject<View>} param0.refContainer - The container ref which will be used to measure the layout as reference
 * @param {number} param0.containerWidth - The dropdown width
 * @param {Function} param0.open - The open function
 * @param {React.ReactNode} param0.children - The children (content of the dropdown)
 * @function */
export const open = ({
  refTouchable,
  refContainer,
  containerWidth = 175,
  open,
  children,
}: OpenDropdownProps) => {
  refTouchable?.current?.measureLayout(refContainer?.current, (x, y, width, height) => {
    console.log(x, y, width, height);
    open(children, { 
      top: y + height + 6,
      left: measureInWindowLeft(containerWidth, { y, x, width, height }),
    })
  });
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a positioned dropdown based on parent component
 * @since 0.0.2
 * @version 0.0.1
 * @param {Object} param0 
 * @param {ViewStyle} param0.style - Custom dropdown style
 * @param {number} param0.gapBetweenItems - Gap between items */
const TouchableDropdown = ({ 
  style,
  gapBetweenItems = 4,
  children,
  ...props
}: TouchableDropdownProps) => {  
  const colors = useThemeColors();

  return (
    <View 
      style={[TouchableDropdownStyle.view, {
        backgroundColor: colors.secondaryBgColor,
        borderColor: colors.tertiaryBorderColor
      }, style]}
      {...props}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[{ 
            gap: gapBetweenItems 
          }]}>
            {children}
        </ScrollView>
    </View>
  )
}

export default TouchableDropdown;