import { PropsWithChildren } from "react";
import { Dimensions, LayoutChangeEvent, View } from "react-native";

import { useDropdownContextStore } from "@/context/DropdownContext";
import { DropdownContextPositionProps } from "@/context/DropdownContext";
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
  additionalLeft?: number;
  additionalRight?: number;
  open: (children: React.ReactNode, position: DropdownContextPositionProps|null, hostId?: string, openOnTop?: boolean) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.2 */
export const useDropdown = () => {
  const open = ({
    refTouchable,
    relativeToRef,
    containerWidth = DEFAULT_DROPDOWN_WIDTH,
    hostId,
    open,
    paddingHorizontal = STYLES.paddingHorizontal,
    float = "right",
    openOnTop = false,
    additionalLeft = 0,
    additionalRight = 0,
    children,
  }: OpenDropdownProps) => {
    const resolvedHostId = hostId ?? "default";
    refTouchable?.current?.measureInWindow((touchX, touchY, touchWidth, touchHeight) => {
      const resolvedPadding = paddingHorizontal ?? STYLES.paddingHorizontal;
      const openWithCoordinates = (left: number, top: number, availableWidth: number) => {
        const position = float === TouchableDropdownFloat.RIGHT
            ? { right: availableWidth - (left + touchWidth + resolvedPadding) - (additionalRight || 0) }
            : { left: left - 2 - (additionalLeft || 0) };

        open(children, {
          top: openOnTop ? top - touchHeight + 4 : top + touchHeight + 10,
          ...position,
        }, resolvedHostId, openOnTop);
      };

      if (resolvedHostId !== "default" && relativeToRef?.current) {
        relativeToRef.current.measureInWindow((containerX, containerY, width) => {
          openWithCoordinates(touchX - containerX, touchY - containerY, width);
        });
      } else openWithCoordinates(touchX, touchY, DIM.width);
    });
  }

  /**
   * @description Handles the visibility of the global dropdown component
   * @see {@link context/DropdownContext} */
   return {
    open,
    state: useDropdownContextStore((state) => state),
   };
}