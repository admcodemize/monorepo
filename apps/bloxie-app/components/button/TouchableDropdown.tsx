import { PropsWithChildren } from "react";
import { Dimensions, ScrollView, View, ViewStyle } from "react-native";

import { DropdownContextPositionProps } from "@/context/DropdownContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import { measureInWindowLeft } from "@/helpers/System";
import TouchableDropdownStyle from "@/styles/components/button/TouchableDropdown";

const DIM = Dimensions.get("window");

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
 * @version 0.0.2
 * @type */
export type OpenDropdownProps = PropsWithChildren & {
  refTouchable: React.RefObject<View|null>;
  relativeToRef?: React.RefObject<View|null>;
  containerWidth?: number;
  hostId?: string;
  open: (children: React.ReactNode, position: DropdownContextPositionProps|null, hostId?: string) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @param {OpenDropdownProps} param0 
 * @param {React.RefObject<View>} param0.refTouchable - The touchable ref
 * @param {number} param0.containerWidth - The dropdown width
 * @param {string} param0.hostId - So that different overlay hosts can be controlled e.g. "tray" or "dashboard"
 * @param {Function} param0.open - The open function
 * @param {React.ReactNode} param0.children - The children (content of the dropdown)
 * @function */
export const open = ({
  refTouchable,
  relativeToRef,
  containerWidth = 175,
  hostId,
  open,
  children,
}: OpenDropdownProps) => {
  refTouchable?.current?.measureInWindow((touchX, touchY, touchWidth, touchHeight) => {
    const applyPosition = (baseX: number, baseY: number, availableWidth: number) => {
      open(children, { 
        top: baseY + touchHeight + 6,
        left: measureInWindowLeft(
          containerWidth,
          { x: baseX, y: baseY, width: touchWidth, height: touchHeight },
          availableWidth
        ),
      }, hostId)
    };

    if (relativeToRef?.current) {
      relativeToRef.current.measureInWindow((containerX, containerY, containerWidthMeasured) => {
        const availableWidth = containerWidthMeasured || DIM.width;
        applyPosition(touchX - containerX, touchY - containerY, availableWidth);
      });
      return;
    }

    applyPosition(touchX, touchY, DIM.width);
  });
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a positioned dropdown based on parent component
 * @since 0.0.2
 * @version 0.0.2
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
        backgroundColor: colors.primaryBgColor,
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