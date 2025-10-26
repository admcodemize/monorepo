import * as React from "react";
import { PanResponder, View } from "react-native";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import DragHandleStyle from "@/styles/components/container/DragHandle";

/**  
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DragHandleProps = {
  hitSlop?: number;
  onDragStart?: () => void;
  onDragMove?: (dy: number) => void;
  onDragEnd?: (dy: number) => void;
}

/**  
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @description Interactive drag handle with gesture support
 * @param {DragHandleProps} props
 * @param {Function} props.onDragStart - Called when drag starts
 * @param {Function} props.onDragMove - Called during drag with vertical delta
 * @param {Function} props.onDragEnd - Called when drag ends with final vertical delta
 * @component */
const DragHandle = ({
  hitSlop = 10,
  onDragStart,
  onDragMove,
  onDragEnd
}: DragHandleProps = {}) => {
  const colors = useThemeColors();

  /** @description Pan responder for drag gestures */
  const panResponder = React.useRef(
    PanResponder.create({
      onPanResponderGrant: () => onDragStart?.(),
      onPanResponderMove: (_, gestureState) => onDragMove?.(gestureState.dy),
      onPanResponderRelease: (_, gestureState) => onDragEnd?.(gestureState.dy),
      onPanResponderTerminate: (_, gestureState) => onDragEnd?.(gestureState.dy),
      onStartShouldSetPanResponder: () => !!onDragStart || !!onDragMove || !!onDragEnd,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        /** @description Only respond to vertical gestures with sufficient movement */
        return Math.abs(gestureState.dy) > 5 && (!!onDragStart || !!onDragMove || !!onDragEnd);
      }
    })
  ).current;

  return (
    <View 
      {...panResponder.panHandlers}
      hitSlop={hitSlop}
      style={[DragHandleStyle.view, { backgroundColor: colors.primaryBorderColor }]} />
  );
}

export default DragHandle;