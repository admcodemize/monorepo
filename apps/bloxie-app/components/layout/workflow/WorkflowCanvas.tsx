import React from 'react';
import { Dimensions, LayoutRectangle, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import Animated, {
  Easing,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faBolt,
  faBrightnessLow,
} from '@fortawesome/duotone-thin-svg-icons';
import GlobalContainerStyle from '@/styles/GlobalContainer';
import { shadeColor } from '@codemize/helpers/Colors';
import { FAMILIY, SIZES } from '@codemize/constants/Fonts';
import TouchableTag from '../../button/TouchableTag';
import { ConvexRuntimeAPIWorkflowDecisionProps, ConvexTemplateAPIProps, ConvexWorkflowActionAPIProps, ConvexWorkflowDecisionAPIProps, ConvexWorkflowQueryAPIProps } from '@codemize/backend/Types';
import { Id } from '../../../../../packages/backend/convex/_generated/dataModel';
import { LanguageEnumProps } from '@/helpers/System';
import TouchableHapticTrigger from '../../button/workflow/TouchableHapticTrigger';
import TouchableHapticTimePeriod from '../../button/workflow/TouchableHapticTimePeriod';
import TouchableHapticConfirmation from '../../button/workflow/TouchableHapticConfirmation';
import TouchableHapticActivityStatus from '../../button/workflow/TouchableHapticActivityStatus';
import WorkflowProcessSteps from './WorkflowProcessSteps';
import { useConfigurationContextStore } from '@/context/ConfigurationContext';
import { useDebounce } from '@codemize/hooks/useDebounce';
import WorkflowStart from './WorkflowStart';
import DottedBackground from '@/components/container/DottedBackground';
import { WorkflowEnd } from './WorkflowEnd';
import GlobalWorkflowStyle from '@/styles/GlobalWorkflow';

type ProcessItem = (ConvexWorkflowActionAPIProps & { nodeType: "action" }) | (ConvexWorkflowDecisionAPIProps & { nodeType: "decision" });

export type WorkflowNodeType = 'start' | 'generic' | 'end';

export type WorkflowNodeItemType = 'action' | 'decision';

export type WorkflowNodeItemDecisionType = 'eventType' | 'calendar';

export type WorkflowNodeItemProps = {
  id: string;
  name: string;
  description: string;
  icon: IconProp;
  language: LanguageEnumProps;
  subject: string;
  content: string;
  isActive?: boolean;
  type: WorkflowNodeItemType;
  decision?: WorkflowNodeItemDecisionType;
  _id: Id<"template">;
};

export type WorkflowNode = {
  id: string;
  type: WorkflowNodeType;
  title?: string;
  subtitle?: string;
  icon?: IconProp;
  meta?: string;
  items?: WorkflowNodeItemProps[];
  hasCancellationTerms?: boolean;
};

export type WorkflowAdditionPayload = {
  fromId: string;
  toId: string | null;
  fromIndex: number;
  toIndex: number;
  parentId?: string;
};

export type WorkflowCanvasProps = {
  workflow: ConvexWorkflowQueryAPIProps;
  onAddAction: (action: ConvexWorkflowActionAPIProps) => void;
  onAddDecision: (decision: ConvexRuntimeAPIWorkflowDecisionProps) => void;

  onRemoveItem: (item: ConvexWorkflowActionAPIProps|ConvexWorkflowDecisionAPIProps) => void;

  onNodePress?: (node: ConvexWorkflowQueryAPIProps) => void;
  onAddNode?: (connection: WorkflowAdditionPayload|null, type: WorkflowNodeType) => void;
  onRemoveNode?: (node: ConvexWorkflowQueryAPIProps) => void;
  onChangeNodeItem?: (node: ConvexWorkflowQueryAPIProps, item: WorkflowNodeItemProps) => void;
  onReorderItems?: (items: ProcessItem[]) => void;
  renderNode?: (node: ConvexWorkflowQueryAPIProps) => React.ReactNode;
  children?: React.ReactNode;
};

const CONTENT_VERTICAL_GAP = 14;

/** Shared no-op callback reused to avoid creating redundant handlers. */
const noop = () => {};




/**
 * High-level canvas that renders nodes, their connections and contextual UI for
 * building automated workflows.
 */
export function WorkflowCanvas({
  workflow,
  onNodePress,
  onAddNode,
  onRemoveNode,  
  onAddAction,
  onAddDecision,
  onRemoveItem,
  onChangeNodeItem,
  onReorderItems,
  renderNode,
  children,
}: WorkflowCanvasProps) {
  const refWorkflow = React.useRef<ConvexWorkflowQueryAPIProps>(workflow);

  const setSelectedWorkflow = useConfigurationContextStore((state) => state.setSelectedWorkflow);
  React.useEffect(() => setSelectedWorkflow(workflow), [workflow]);

  React.useEffect(() => {
    refWorkflow.current = workflow;
  }, [workflow]);

  const onChange = React.useCallback((nextWorkflow: ConvexWorkflowQueryAPIProps) => {
    refWorkflow.current = nextWorkflow;
    console.log("refWorkflow", refWorkflow.current);
  }, []);

  const getWorkflow = React.useCallback(() => refWorkflow.current, []);

  return (
      <View style={GlobalWorkflowStyle.container}>
        <DottedBackground />
        <ScrollView style={{ maxHeight: "85%"}} showsVerticalScrollIndicator={false}>
          <View style={[GlobalWorkflowStyle.content]}>
            <WorkflowStart 
              workflow={workflow} 
              getWorkflow={getWorkflow}
              onChange={onChange} />
            <WorkflowProcessSteps 
              workflow={workflow} 
              onAddAction={onAddAction}
              onAddDecision={onAddDecision}
              onRemoveItem={onRemoveItem}
              onReorderItems={onReorderItems} />
            <WorkflowEnd workflow={workflow} />
          </View>
        </ScrollView>
      </View>
  );
}