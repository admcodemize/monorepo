import React from "react";
import { GestureResponderEvent, View } from "react-native";
import { ConvexWorkflowActionAPIProps } from "@codemize/backend/Types";

import { ConvexWorkflowDecisionAPIProps } from "@codemize/backend/Types";

import WorkflowDecision from "@/components/layout/workflow/WorkflowDecision";
import WorkflowAction from "@/components/layout/workflow/WorkflowAction";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.1
 * @type */
export type WorkflowProcessStepsItemProps = {
  item: (ConvexWorkflowActionAPIProps & { nodeType: "action" }) | (ConvexWorkflowDecisionAPIProps & { nodeType: "decision" });
  onRemoveItem: (item: ConvexWorkflowActionAPIProps | ConvexWorkflowDecisionAPIProps) => void;
  onPressAction: (isActive: boolean) => void;
  onPressDrag: (e: GestureResponderEvent) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.1
 * @param {WorkflowProcessStepsItemProps} param0
 * @param {ConvexWorkflowActionAPIProps & { nodeType: "action" } | ConvexWorkflowDecisionAPIProps & { nodeType: "decision" }} param0.item - The item to render
 * @param {(item: ConvexWorkflowActionAPIProps | ConvexWorkflowDecisionAPIProps) => void} param0.onRemoveItem - Callback function when the remove button is pressed
 * @param {(isActive: boolean) => void} param0.onPressAction - Callback function when the active play/pause button is pressed
 * @param {(e: GestureResponderEvent) => void} param0.onPressDrag - Callback function when the drag button is pressed
 * @component */
const WorkflowProcessStepsItem = ({
  item,
  onRemoveItem,
  onPressAction,
  onPressDrag
}: WorkflowProcessStepsItemProps) => {
  return (
    <View style={{ marginVertical: 3 }}>
      {item.nodeType === "action" ? (
        <WorkflowAction
          action={item as ConvexWorkflowActionAPIProps}
          onPressRemove={onRemoveItem}
          onPressActive={onPressAction}
          onPressDrag={onPressDrag} />
      ) : (
        <WorkflowDecision
          decision={item as ConvexWorkflowDecisionAPIProps}
          onPressRemove={onRemoveItem}
          onPressDrag={onPressDrag} />)}
    </View>
  );
};

export default React.memo(WorkflowProcessStepsItem);