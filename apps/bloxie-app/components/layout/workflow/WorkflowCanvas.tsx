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
import { ConvexTemplateAPIProps, ConvexWorkflowActionAPIProps, ConvexWorkflowDecisionAPIProps, ConvexWorkflowQueryAPIProps } from '@codemize/backend/Types';
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
  workflow?: ConvexWorkflowQueryAPIProps;
  onRemoveItem: (item: ConvexWorkflowActionAPIProps|ConvexWorkflowDecisionAPIProps) => void;

  onNodePress?: (node: ConvexWorkflowQueryAPIProps) => void;
  onAddNode?: (connection: WorkflowAdditionPayload|null, type: WorkflowNodeType) => void;
  onRemoveNode?: (node: ConvexWorkflowQueryAPIProps) => void;
  onAddNodeItem?: (node: ConvexWorkflowQueryAPIProps, variant: WorkflowNodeItemType, template: ConvexTemplateAPIProps) => void;
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
  onAddNodeItem,
  onRemoveItem,
  onChangeNodeItem,
  onReorderItems,
  renderNode,
  children,
}: WorkflowCanvasProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));


  const refStartNode = React.useRef<View>(null);

  const setSelectedWorkflow = useConfigurationContextStore((state) => state.setSelectedWorkflow);
  React.useEffect(() => {
    setSelectedWorkflow(workflow);
  }, [workflow]);

  React.useEffect(() => {
    console.log("re-render");
  }, []);

  useDebounce(() => {

  }, 1000);

  return (
      <View style={styles.container}>
        <Svg style={[StyleSheet.absoluteFill, styles.connectionLayer]} pointerEvents="none">
        <Defs>
          <Pattern id="dots" patternUnits="userSpaceOnUse" width={22} height={22}>
            <Circle cx={1} cy={1} r={1} fill="#d0d0d0" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#dots)" />
        </Svg>
        <ScrollView style={{ maxHeight: "85%"}} showsVerticalScrollIndicator={false}>
          <Animated.View
            layout={LinearTransition.duration(220).easing(Easing.inOut(Easing.ease))}
            style={[styles.content, animatedStyle]}
          >

            {/* Start Node */}
            <WorkflowStart workflow={workflow} />
            {/* Process Steps Node */}
            <WorkflowProcessSteps 
              workflow={workflow} 
              onAddNodeItem={onAddNodeItem} 
              onRemoveItem={onRemoveItem}
              onReorderItems={onReorderItems} />

            {/* End Node */}
            <View style={[
              styles.nodeWrapper,
              { maxWidth: Dimensions.get('window').width - 28 },
            ]}>
              <View style={styles.tagRow}>
                <WorkflowNodeTag icon={faBolt as IconProp} text={"Ende"} color={shadeColor(("#3F37A0"), 0)} />
                <View style={[styles.node]} pointerEvents="box-none" ref={refStartNode}>
                  <View style={[GlobalContainerStyle.rowCenterStart, styles.nodeHeaderRow]}>

                    <FontAwesomeIcon icon={faBrightnessLow as IconProp} size={16} color={"#626D7B"} />
                    <TextInput
                      editable={false}
                      value={"Abschluss"}
                      onChangeText={() => {}}
                      placeholder="Name des Workflows"
                      style={styles.workflowNameInput}/>
                  </View>
                  <View style={{ gap: 4}}>  
                  <TouchableHapticConfirmation
                    refContainer={refStartNode}
                    onPress={noop}/>
                  </View>
                </View>
              </View>
            </View>


          </Animated.View>
        </ScrollView>
      </View>
  );
}

/*type WorkflowNodeProps = {
  node: ConvexWorkflowQueryAPIProps;
  isFirst: boolean;
  isLast: boolean;
  onRemoveNode?: (node: ConvexWorkflowQueryAPIProps) => void;
  onAddNodeItem?: (node: ConvexWorkflowQueryAPIProps, variant: WorkflowNodeItemType, template: ConvexTemplateAPIProps) => void;
  onRemoveNodeItem?: (node: ConvexWorkflowQueryAPIProps, key: string) => void;
  onChangeNodeItem?: (node: ConvexWorkflowQueryAPIProps, item: WorkflowNodeItemProps) => void;
};*/


const WorkflowNodeTag = ({ icon, text, color }: { icon: IconProp, text: string, color: string }) => {
  return (
    <TouchableTag
    icon={icon}
    text={text}
    type="label"
    isActive={true}
    disabled={true}
    colorActive={color}
    viewStyle={{ paddingVertical: 3 }} />
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: CONTENT_VERTICAL_GAP,
  },
  tagRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    gap: 4
  },
  nodeWrapper: {
    gap: 4,
    overflow: 'hidden',
  },
  node: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    paddingTop: 6,
    gap: 4,
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  nodeHeaderRow: {
    paddingHorizontal: 4,
    gap: 10,
    height: 24,
  },
  workflowNameInput: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    color: "#626D7B",
    fontSize: Number(SIZES.label),
    fontFamily: String(FAMILIY.subtitle),
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  nodeHeaderActions: {
    gap: 14,
    marginLeft: 12,
  },
  connectionLayer: {
    zIndex: -1,
  },
});


