import { PropsWithChildren } from "react";
import { Dimensions, ScrollView, View, ViewStyle } from "react-native";

import { DropdownContextPositionProps } from "@/context/DropdownContext";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import { measureInWindowLeft } from "@/helpers/System";
import TouchableDropdownStyle from "@/styles/components/button/TouchableDropdown";
import { STYLES } from "@codemize/constants/Styles";

const DIM = Dimensions.get("window");

export const DEFAULT_DROPDOWN_WIDTH = 175;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.42
 * @version 0.0.1
 * @type */
export enum TouchableDropdownFloat {
  RIGHT = "right",
  LEFT = "left"
}
/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type TouchableDropdownProps = PropsWithChildren & ViewStyle & {
  style?: ViewStyle|ViewStyle[];
  gapBetweenItems?: number;
  width?: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.3
 * @type */
export type OpenDropdownProps = PropsWithChildren & {
  refTouchable: React.RefObject<View|null>;
  relativeToRef?: React.RefObject<View|null>;
  containerWidth?: number;
  hostId?: string;
  paddingHorizontal?: number;
  float?: "right" | "left";
  openOnTop?: boolean;
  open: (children: React.ReactNode, position: DropdownContextPositionProps|null, hostId?: string) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.4
 * @param {OpenDropdownProps} param0 
 * @param {React.RefObject<View>} param0.refTouchable - The touchable ref
 * @param {React.RefObject<View>} param0.relativeToRef - The relative to ref for calculating the position
 * @param {number} param0.containerWidth - The dropdown width
 * @param {string} param0.hostId - So that different overlay hosts can be controlled e.g. "tray" or "dashboard"
 * @param {Function} param0.open - The open function
 * @param {string} param0.float - The float direction of the dropdown -> right or left
 * @param {boolean} param0.openOnTop - If true, the dropdown will be opened on the top of the relative to ref
 * @param {React.ReactNode} param0.children - The children (content of the dropdown)
 * @function */
export const open = ({
  refTouchable,
  relativeToRef,
  containerWidth = DEFAULT_DROPDOWN_WIDTH,
  hostId,
  open,
  paddingHorizontal = STYLES.paddingHorizontal,
  float = "right",
  openOnTop = false,
  children,
}: OpenDropdownProps) => {
  refTouchable?.current?.measureInWindow((touchX, touchY, touchWidth, touchHeight) => {
    const applyPosition = (baseX: number, baseY: number, width: number, height: number, containerX: number, containerY: number) => {
      const position = float === TouchableDropdownFloat.RIGHT 
        ? { right: DIM.width - (baseX + touchWidth + paddingHorizontal) } 
        : { left: baseX - 2 }

      open(children, { 
        top: baseY + touchHeight + 10,
        ...position,
      }, hostId)
    };

    if (relativeToRef?.current) {
      relativeToRef.current.measureInWindow((containerX, containerY, width, height) => applyPosition(touchX, touchY, width, height, containerX, containerY));
    } else applyPosition(touchX, touchY, DIM.width, 0, 0, 0);
  });
}

/**
 * @public
 * @todo REMOVE THIS COMPONENT
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a positioned dropdown based on parent component
 * @since 0.0.2
 * @version 0.0.3
 * @param {Object} param0 
 * @param {ViewStyle} param0.style - Custom dropdown style
 * @param {number} param0.gapBetweenItems - Gap between items */
const TouchableDropdown = ({ 
  style,
  gapBetweenItems = 4,
  children,
  width = DEFAULT_DROPDOWN_WIDTH,
  ...props
}: TouchableDropdownProps) => {  
  const colors = useThemeColors();
  return (
    <></>
    /*<View 
      style={[TouchableDropdownStyle.view, {
        backgroundColor: colors.primaryBgColor,
        borderColor: colors.tertiaryBorderColor,
        width,
      }, style]}
      {...props}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[{ gap: gapBetweenItems }]}>
            {children}
        </ScrollView>
    </View>*/
  )
}

export default TouchableDropdown;