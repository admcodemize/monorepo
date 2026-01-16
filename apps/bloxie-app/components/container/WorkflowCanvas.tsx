import React from 'react';
import { Dimensions, LayoutChangeEvent, LayoutRectangle, ScrollView, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleDown,
  faBolt,
  faBrightness,
  faBrightnessLow,
  faMicrochip,
  faObjectExclude,
  faPause,
  faPlay,
  faSignPost,
  faSignsPost,
  faSquare,
  faStopwatch,
  faXmark,
} from '@fortawesome/duotone-thin-svg-icons';
import GlobalContainerStyle from '@/styles/GlobalContainer';
import { shadeColor } from '@codemize/helpers/Colors';
import { useThemeColors } from '@/hooks/theme/useThemeColor';
import { FAMILIY, SIZES } from '@codemize/constants/Fonts';
import TouchableHaptic from '../button/TouchableHaptic';
import TouchableTag from '../button/TouchableTag';
import TextBase from '../typography/Text';
import TouchableHapticIcon from '../button/TouchableHaptichIcon';
import Divider from './Divider';
import { useTrays } from 'react-native-trays';
import { ConvexTemplateAPIProps, ConvexWorkflowActionAPIProps, ConvexWorkflowAPIProps, ConvexWorkflowDecisionAPIProps, ConvexWorkflowQueryAPIProps } from '@codemize/backend/Types';
import { Id } from '../../../../packages/backend/convex/_generated/dataModel';
import { LanguageEnumProps, resolveRuntimeIcon } from '@/helpers/System';
import TouchableHapticTrigger from '../button/workflow/TouchableHapticTrigger';
import TouchableHapticTimePeriod from '../button/workflow/TouchableHapticTimePeriod';
import TouchableHapticConfirmation from '../button/workflow/TouchableHapticConfirmation';
import { STYLES } from '@codemize/constants/Styles';
import { useTranslation } from 'react-i18next';
import TouchableHapticCancellationTerms from '../button/workflow/TouchableHapticCancellationTerms';
import TouchableHapticActivityStatus from '../button/workflow/TouchableHapticActivityStatus';
import WorkflowAction from '../layout/workflow/WorkflowAction';
import WorkflowDecision from '../layout/workflow/WorkflowDecision';
import GlobalWorkflowStyle from '@/styles/GlobalWorkflow';

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

export type WorkflowConnection = {
  id: string;
  from: string;
  to: string;
  fromIndex: number;
  toIndex: number;
  parentId?: string;
};

export type WorkflowNodeLayoutMap = Record<string, LayoutRectangle>;

export type WorkflowAdditionPayload = {
  fromId: string;
  toId: string | null;
  fromIndex: number;
  toIndex: number;
  parentId?: string;
};

type WorkflowCanvasProps = {
  workflow?: ConvexWorkflowQueryAPIProps;
  onNodePress?: (node: ConvexWorkflowQueryAPIProps) => void;
  onAddNode?: (connection: WorkflowAdditionPayload|null, type: WorkflowNodeType) => void;
  onRemoveNode?: (node: ConvexWorkflowQueryAPIProps) => void;
  onAddNodeItem?: (node: ConvexWorkflowQueryAPIProps, variant: WorkflowNodeItemType, template: ConvexTemplateAPIProps) => void;
  onRemoveNodeItem?: (node: ConvexWorkflowQueryAPIProps, key: string) => void;
  onChangeNodeItem?: (node: ConvexWorkflowQueryAPIProps, item: WorkflowNodeItemProps) => void;
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
  onRemoveNodeItem,
  onChangeNodeItem,
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

  const { errorColor, primaryIconColor, infoColor, secondaryBgColor, successColor } = useThemeColors();

  const refStartNode = React.useRef<View>(null);


  console.log("workflowState", workflow?.process.items);

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
            <View style={[
              styles.nodeWrapper,
              { maxWidth: Dimensions.get('window').width - 28 },
            ]}>
              <View style={styles.tagRow}>
                <WorkflowNodeTag icon={faStopwatch as IconProp} text={"Ende"} color={shadeColor(("#3F37A0"), 0)} />
                <View style={[styles.node, { }]} pointerEvents="box-none" ref={refStartNode}>
                    <View style={[GlobalContainerStyle.rowCenterStart, styles.nodeHeaderRow]}>
                      <FontAwesomeIcon icon={faBrightnessLow as IconProp} size={16} color={"#626D7B"} />
                      <TextInput
                        value={workflow?.name ?? ""}
                        onChangeText={() => {}}
                        placeholder="Name des Workflows"
                        style={{
                          color: "#626D7B",
                          fontSize: Number(SIZES.label),
                          fontFamily: String(FAMILIY.subtitle),
                          flexGrow: 0,
                        }}/>
                    </View>
                  <View style={{ gap: 4, alignSelf: 'stretch' }}>  
                  <TouchableHapticTrigger
                    refContainer={refStartNode}
                    workflow={workflow}
                    onPress={noop} />
                  <TouchableHapticTimePeriod
                    refContainer={refStartNode}
                    workflow={workflow}
                    onPress={noop}/>
                  <TouchableHapticActivityStatus
                    refContainer={refStartNode}
                    workflow={workflow}
                    onPress={noop}/>
                  </View>
                </View>
              </View>
            </View>


            {/* Process Steps Node */}
            <View style={[
              styles.nodeWrapper,
              { maxWidth: Dimensions.get('window').width - 28 },
            ]}>
              <View style={styles.tagRow}>
                <WorkflowNodeTag icon={faMicrochip as IconProp} text={"Prozessschritte"} color={shadeColor(("#626D7B"), 0)} />
                <View style={[styles.node]} pointerEvents="box-none" ref={refStartNode}>
                  <View style={[GlobalContainerStyle.rowCenterBetween, styles.nodeHeaderRow]}>
                    <View style={[GlobalContainerStyle.rowCenterStart, { flexGrow: 1, gap: 10 }]}>
                      <FontAwesomeIcon icon={faMicrochip as IconProp} size={16} color={"#626D7B"} />
                      <TextInput
                        editable={false}
                        value={"Prozessschritte"}
                        onChangeText={() => {}}
                        style={{
                          color: "#626D7B",
                          fontSize: Number(SIZES.label),
                          fontFamily: String(FAMILIY.subtitle),
                          flexGrow: 0,
                        }}/>
                    </View>

                    <View style={[GlobalContainerStyle.rowCenterEnd, styles.nodeHeaderActions]}>
                      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 18 }]}>
                        <TouchableHaptic
                          onPress={() => {}}
                        >
                          <View style={[GlobalContainerStyle.rowCenterStart, { gap: 6 }]}>
                          <FontAwesomeIcon
                            icon={faObjectExclude as IconProp}
                            size={STYLES.sizeFaIcon + 2}
                          />
                          <TextBase text="Aktion" type="label" style={{ color: infoColor }} />
                          </View>
                        </TouchableHaptic>
                        <TouchableHaptic
                          onPress={() => {}}
                        >
                          <View style={[GlobalContainerStyle.rowCenterStart, { gap: 6 }]}>
                          <FontAwesomeIcon
                            icon={faSignsPost as IconProp}
                            size={STYLES.sizeFaIcon + 2}
                          />
                          <TextBase text="Entscheid" type="label" style={{ color: infoColor }} />
                          </View>
                        </TouchableHaptic>
                      </View>
                    </View>
                  </View>
                  <View style={{ alignSelf: 'stretch' }}>  
                    <View style={{ gap: 6 }}>
                    <TouchableHapticCancellationTerms onPress={noop}/>
                    {workflow?.process.items.map((item, index) => (
                      item.nodeType === "action" ? (
                        /*<WorkflowNodeAction key={item._id} item={item as ConvexWorkflowActionAPIProps} color={infoColor} />*/
                        <WorkflowAction key={item._id} action={item as ConvexWorkflowActionAPIProps} />
                      ) : (
                        /*<WorkflowNodeDecision key={item._id} item={item as ConvexWorkflowDecisionAPIProps} color={infoColor} />*/
                        <WorkflowDecision key={item._id} decision={item as ConvexWorkflowDecisionAPIProps} />
                      )
                    ))}
                    </View>
                    {((workflow?.process.items && workflow?.process.items.length === 0) || !workflow?.process.items) && (
                      <View       
                        style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
                          backgroundColor: shadeColor(secondaryBgColor, 0.3),
                        }]}>
                          <TextBase
                            text="Noch keine Schritte hinzugefügt."
                            type="label"
                            style={{ color: '#626D7B', alignSelf: 'center', fontSize: 11 }} />
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>


            {/*nodes && nodes.length > 0
              ? nodes.map((node, index) => (
                <></>
                  <WorkflowNode
                    key={node._id}
                    node={node}
                    isFirst={index === 0}
                    isLast={index === nodes.length - 1}
                    onRemoveNode={onRemoveNode}
                    onAddNodeItem={onAddNodeItem}
                    onRemoveNodeItem={onRemoveNodeItem}
                    onChangeNodeItem={onChangeNodeItem}
                    //onLayout={layout => handleNodeLayout(node.id, layout)}
                  />
                ))
              : renderNode
              ? (nodes ?? []).map(renderNode)
              : children*/}


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
                      style={{
                        color: "#626D7B",
                        fontSize: Number(SIZES.label),
                        fontFamily: String(FAMILIY.subtitle),
                        flexGrow: 0,
                      }}/>
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
  nodeHeaderActions: {
    gap: 14,
    marginLeft: 12,
  },
  connectionLayer: {
    zIndex: -1,
  },
});


