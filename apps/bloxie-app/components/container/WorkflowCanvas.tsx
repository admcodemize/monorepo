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

const CONNECTION_INSERTION_HEIGHT = 0;
const CONNECTION_INSERTION_WIDTH = 160;
const CONNECTION_INSERTION_MARGIN = 4;
const CONTENT_VERTICAL_GAP = 14;

/** Shared no-op callback reused to avoid creating redundant handlers. */
const noop = () => {};



const typeIcon: Record<WorkflowNodeType, IconProp> = {
  start: faBolt as IconProp,
  generic: faMicrochip as IconProp,
  end: faStopwatch as IconProp,
};



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
                <View style={[styles.node]} pointerEvents="box-none" ref={refStartNode}>
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
                  <View style={{ gap: 4}}>  
                    <WorkflowNodeTrigger containerRef={refStartNode} workflow={workflow} />
                    <WorkflowNodeTriggerTime containerRef={refStartNode} workflow={workflow} />
                    <WorkflowNodeActivityStatus containerRef={refStartNode} workflow={workflow} />
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
                      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 16 }]}>
                        <TouchableHaptic
                          onPress={() => {}}
                        >
                          <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                          <FontAwesomeIcon
                            icon={faObjectExclude as IconProp}
                            size={STYLES.sizeFaIcon}
                          />
                          <TextBase text="Aktion" type="label" style={{ color: infoColor }} />
                          </View>
                        </TouchableHaptic>
                        <TouchableHaptic
                          onPress={() => {}}
                        >
                          <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                          <FontAwesomeIcon
                            icon={faSignsPost as IconProp}
                            size={STYLES.sizeFaIcon}
                          />
                          <TextBase text="Entscheid" type="label" style={{ color: infoColor }} />
                          </View>
                        </TouchableHaptic>
                      </View>
                    </View>
                  </View>
                  <View style={{ alignSelf: 'stretch' }}>  
                    <WorkflowNodeCancellationTerms onPress={noop} />
                    <View style={{ gap: 6 }}>
                    {workflow?.process.items.map((item, index) => (
                      item.nodeType === "action" ? (
                        <WorkflowNodeAction key={item._id} item={item as ConvexWorkflowActionAPIProps} color={infoColor} />
                      ) : (
                        <WorkflowNodeDecision key={item._id} item={item as ConvexWorkflowDecisionAPIProps} color={infoColor} />
                      )
                    ))}
                    </View>
                    {((workflow?.process.items && workflow?.process.items.length === 0) || !workflow?.process.items) && (
                      <View       style={[
                        GlobalContainerStyle.rowCenterBetween,
                        {
                          gap: 18,
                          backgroundColor: shadeColor(secondaryBgColor, 0.3),
                          height: 28,
                          paddingHorizontal: 10,
                          borderRadius: 8
                        },
                      ]}>
                        <TextBase
                          text="Noch keine Schritte hinzugefügt."
                          type="label"
                          style={{ color: '#626D7B', alignSelf: 'center', fontSize: 11 }}
                        />
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
                    <WorkflowNodeConfirmation containerRef={refStartNode} />
                  </View>
                </View>
              </View>
            </View>


          </Animated.View>
        </ScrollView>
      </View>
  );
}

type WorkflowNodeProps = {
  node: ConvexWorkflowQueryAPIProps;
  isFirst: boolean;
  isLast: boolean;
  onRemoveNode?: (node: ConvexWorkflowQueryAPIProps) => void;
  onAddNodeItem?: (node: ConvexWorkflowQueryAPIProps, variant: WorkflowNodeItemType, template: ConvexTemplateAPIProps) => void;
  onRemoveNodeItem?: (node: ConvexWorkflowQueryAPIProps, key: string) => void;
  onChangeNodeItem?: (node: ConvexWorkflowQueryAPIProps, item: WorkflowNodeItemProps) => void;
};

/**
 * Displays a single node within the workflow, including its animated entry/exit,
 * inline editing and contextual actions.
 */
const WorkflowNodeComponent = ({
  node,
  isFirst,
  isLast,
  onAddNodeItem,
  onRemoveNode,
  onRemoveNodeItem,
  onChangeNodeItem,
}: WorkflowNodeProps) => {
  /*const { errorColor, primaryIconColor, infoColor, secondaryBgColor } = useThemeColors();
  const [title, setTitle] = React.useState<string>(node.name ?? '');
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const refTrigger = React.useRef<View>(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  const { push, dismiss } = useTrays('main');

  React.useEffect(() => {
    setTitle(node.name ?? '');
  }, [node.name]);

  const normalizedItems = React.useMemo(
    () =>
      (node.items ?? []).map(item => ({
        ...item,
        type: item.type ?? 'action',
      })),
    [node.items],
  );
  const actionItems = React.useMemo(
    () => normalizedItems.filter(item => item.type === 'action'),
    [normalizedItems],
  );
  const decisionItems = React.useMemo(
    () => normalizedItems.filter(item => item.type === 'decision'),
    [normalizedItems],
  );

  const handleAddItem = React.useCallback(
    (variant: WorkflowNodeItemType) => {
      if (!onAddNodeItem) {
        return;
      }

      if (variant === 'decision') {
        push('TrayWorkflowDecision', {
          onPress: (template: ConvexTemplateAPIProps) => {
            dismiss('TrayWorkflowDecision');
            onAddNodeItem(node, variant, template);
          },
        });
        return;
      }

      push('TrayWorkflowTemplate', {
        onPress: (template: ConvexTemplateAPIProps) => {
          dismiss('TrayWorkflowTemplate');
          onAddNodeItem(node, variant, template);
        },
      });
    },
    [dismiss, node, onAddNodeItem, push],
  );

  return (
    <Animated.View
      layout={undefined}
      entering={FadeInDown.duration(180)}
      exiting={FadeOutUp.duration(NODE_EXIT_DURATION)}
      style={[
        styles.nodeWrapper,
        !isLast && styles.nodeWrapperSpacing,
        { maxWidth: Dimensions.get('window').width - 28 },
      ]}
    >
      <View style={styles.tagRow}>
        <TouchableTag
          icon={typeIcon[node.type]}
          text={typeLabel[node.type]}
          type="label"
          isActive={true}
          disabled={true}
          colorActive={shadeColor((node.type === "start" || node.type === "end") ? '#3F37A0' : typeAccent[node.type], 0)}
          viewStyle={{ paddingVertical: 3 }}
        />
      </View>

        <View style={[styles.node]} pointerEvents="box-none" ref={refTrigger}>
        {/*!isFirst && <WorkflowNodeConnector node={node} position="top" />*

        <View style={[GlobalContainerStyle.rowCenterStart, styles.nodeHeaderRow]}>

          <View style={[GlobalContainerStyle.rowCenterStart, styles.nodeHeaderContent]}>
            {!isActive && node.type === 'generic' && <TouchableTag
              text={"Inaktiv"}
              type="label"
              colorInactive={errorColor}
              viewStyle={{ paddingVertical: 3 }}/>}
            <FontAwesomeIcon icon={(node.icon as IconProp) ?? typeIcon[node.type]} size={16} color={"#626D7B"} />
            <TextInput
              editable={node.type === 'start'}

              value={title}
              onChangeText={setTitle}
              placeholder="Name des Workflows"
              style={{
                color: "#626D7B",
                fontSize: Number(SIZES.label),
                fontFamily: String(FAMILIY.subtitle),
                flexGrow: 0,
              }}/>

          </View>

          <View style={{ flexGrow: 1 }} />

          {node.type === 'generic' && (
            <View style={[GlobalContainerStyle.rowCenterEnd, styles.nodeHeaderActions]}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 16 }]}>
                <TouchableHaptic
                  onPress={() => handleAddItem('action')}
                >
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                  <FontAwesomeIcon
                    icon={faObjectExclude as IconProp}
                    size={STYLES.sizeFaIcon}
                  />
                  <TextBase text="Aktion" type="label" style={{ color: infoColor }} />
                  </View>
                </TouchableHaptic>
                <TouchableHaptic
                  onPress={() => handleAddItem('decision')}
                >
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                  <FontAwesomeIcon
                    icon={faSignsPost as IconProp}
                    size={STYLES.sizeFaIcon}
                  />
                  <TextBase text="Entscheid" type="label" style={{ color: infoColor }} />
                  </View>
                </TouchableHaptic>
              </View>
            </View>
          )}


        </View>

        {node.type === 'start' && (
          <>
            <View style={{ gap: 4}}>
              {/*<WorkflowNodeEventType node={node} />
              <WorkflowNodeCalendarGroup node={node} />*
              <WorkflowNodeTrigger node={node} containerRef={refTrigger} />
              <WorkflowNodeTriggerTime node={node} containerRef={refTrigger} />
              <WorkflowNodeActivityStatus node={node} containerRef={refTrigger} />

            </View>
          </>
        )}

        {node.type === 'end' && (
          <>
            <WorkflowNodeConfirmation node={node} containerRef={refTrigger} />
          </>
        )}

        {node.type === 'generic' && isOpen && (
          <View style={{ alignSelf: 'stretch' }}>
            <WorkflowNodeCancellationTerms onPress={() => {}} />
            {node.items && node.items.length > 0 && (
              <View>
                <View style={{ opacity: isActive ? 1 : 0.5, gap: 6, alignSelf: 'stretch' }}>
                  {node.items.map(item => (
                    item.type === 'action' ? <WorkflowNodeAction
                      key={item.id}
                      item={item}
                        color={infoColor}
                        onRemoveNodeItem={() => onRemoveNodeItem?.(node, item.id)}
                        onChangeNodeItem={(updated: WorkflowNodeItemProps) => onChangeNodeItem?.(node, updated)}
                      />
                    :
                      <WorkflowNodeDecision
                        key={item.id}
                        item={item}
                        color={infoColor}
                        onRemoveNodeItem={() => onRemoveNodeItem?.(node, item.id)}
                        onChangeNodeItem={(updated: WorkflowNodeItemProps) => onChangeNodeItem?.(node, updated)}
                      />
                  ))}
                </View>
              </View>
            )}


            {actionItems.length === 0 && decisionItems.length === 0 && (
              <View       style={[
                GlobalContainerStyle.rowCenterBetween,
                {
                  gap: 18,
                  backgroundColor: shadeColor(secondaryBgColor, 0.3),
                  height: 28,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                },
              ]}>
                <TextBase
                  text="Noch keine Schritte hinzugefügt."
                  type="label"
                  style={{ color: '#626D7B', alignSelf: 'center', fontSize: 11 }}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );*/
};

//const WorkflowNode = React.memo(WorkflowNodeComponent);
//WorkflowNode.displayName = 'WorkflowNode';


const WorkflowNodeConfirmation = ({ containerRef }: { containerRef: React.RefObject<View|null> }) => {
  return (
    <TouchableHapticConfirmation
      refContainer={containerRef}
      onPress={noop}/>
  );
};

const WorkflowNodeTrigger = ({ containerRef, workflow }: { containerRef: React.RefObject<View|null>, workflow: ConvexWorkflowQueryAPIProps|undefined }) => {
  return (
    <TouchableHapticTrigger
      refContainer={containerRef}
      workflow={workflow}
      onPress={noop}
    />
  );
};

const WorkflowNodeTriggerTime = ({ containerRef, workflow }: { containerRef: React.RefObject<View|null>, workflow: ConvexWorkflowQueryAPIProps|undefined }) => {
  return (
    <TouchableHapticTimePeriod
      refContainer={containerRef}
      workflow={workflow}
      onPress={noop}/>
  );
};

const WorkflowNodeActivityStatus = ({ containerRef, workflow }: { containerRef: React.RefObject<View|null>, workflow: ConvexWorkflowQueryAPIProps|undefined }) => {
  return (
    <TouchableHapticActivityStatus
      refContainer={containerRef}
      workflow={workflow}
      onPress={noop}
    />
  );
};

const WorkflowNodeCancellationTerms = ({ onPress }: { onPress: (selected: boolean) => void }) => {
  return (
    <View style={{ marginVertical: 6, gap: 4 }}>
      <TouchableHapticCancellationTerms
        onPress={noop}/>
    </View>
  );
};

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

/**
 * Renders an action row that belongs to an action node, including edit, toggle and delete affordances.
 */
const WorkflowNodeActionComponent = ({
  item,
  color,
  onRemoveNodeItem,
  onChangeNodeItem,
}: {
  item: ConvexWorkflowActionAPIProps;
  color: string;
  onRemoveNodeItem?: () => void;
  onChangeNodeItem?: (item: ConvexWorkflowActionAPIProps) => void;
}) => {
  const { secondaryBgColor, errorColor, successColor, infoColor } = useThemeColors();
  const [isActive, setIsActive] = React.useState<boolean>(item.activityStatus ?? true);
  const [name, setName] = React.useState<string>(item.name);

  const { push, dismiss } = useTrays('keyboard');

  /*const resolvedIcon = React.useMemo(
    () => resolveRuntimeIcon(String(item?.icon || 'faCodeCommit')) as IconProp,
    [item?.icon],
  );*/

  React.useEffect(() => {
    setIsActive(item.activityStatus ?? true);
  }, [item.activityStatus]);

  React.useEffect(() => {
    setName(item.name);
  }, [item.name]);

  const handleEdit = React.useCallback(() => {
    push('TrayWorkflowAction', {
      item,
      onAfterSave: (updated: ConvexWorkflowActionAPIProps) => {
        onChangeNodeItem?.(updated);
        setName(updated.name);
        setIsActive(updated.activityStatus ?? true);
        dismiss('TrayWorkflowAction');
      },
      onPressClose: () => {
        dismiss('TrayWorkflowAction');
      },
    });
  }, [push, dismiss, item, onChangeNodeItem]);

  const handleNameChange = React.useCallback(
    (text: string) => {
      setName(text);
      onChangeNodeItem?.({
        ...item,
        name: text,
      });
    },
    [item, onChangeNodeItem],
  );

  const handleToggleActive = React.useCallback(() => {
    const next = !isActive;
    setIsActive(next);
    onChangeNodeItem?.({
      ...item,
      activityStatus: next,
    });
  }, [isActive, item, onChangeNodeItem]);

  const handleRemove = React.useCallback(() => {
    onRemoveNodeItem?.();
  }, [onRemoveNodeItem]);

  return (
    <Animated.View
      entering={FadeInDown.duration(160)}
      layout={undefined}
      //exiting={FadeOutUp.duration(160)}
      style={[
        GlobalContainerStyle.rowCenterBetween,
        {
          gap: 18,
          backgroundColor: shadeColor(secondaryBgColor, 0.1),
          height: 28,
          paddingHorizontal: 10,
          borderRadius: 8,
        },
      ]}
    >
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 8 }]}>
        <FontAwesomeIcon icon={faSquare as IconProp} size={14} color={"#587E1F"} />
        {/*<FontAwesomeIcon icon={resolvedIcon} size={16} color={infoColor} />*/}
        <TextInput
          value={name}
          placeholder="Name der Aktion"
          style={{
            color,
            fontSize: Number(SIZES.label),
            fontFamily: String(FAMILIY.subtitle),
            maxWidth: 160,
          }}
          onChangeText={handleNameChange}
        />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 14 }]}>
        <TouchableHaptic onPress={handleEdit}>
          <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
            <TextBase text={'Bearbeiten'} type="label" />
          </View>
        </TouchableHaptic>
        <Divider vertical />
        <TouchableHapticIcon
          icon={(isActive ? faPlay : faPause) as IconProp}
          iconSize={12}
          iconColor={isActive ? successColor : errorColor}
          hasViewCustomStyle={true}
          onPress={handleToggleActive}
        />
        <TouchableHapticIcon
          icon={faXmark as IconProp}
          iconSize={12}
          hasViewCustomStyle={true}
          onPress={handleRemove}
        />
      </View>
    </Animated.View>
  );
};

/**
 * Displays the condensed decision outcome row beneath a decision node.
 */
const WorkflowNodeDecisionComponent = ({
  item,
  color,
  onRemoveNodeItem,
  onChangeNodeItem,
}: {
  item: ConvexWorkflowDecisionAPIProps;
  color: string;
  onRemoveNodeItem?: () => void;
  onChangeNodeItem?: (item: ConvexWorkflowDecisionAPIProps) => void;
}) => {
  const { secondaryBgColor, errorColor, successColor, infoColor } = useThemeColors();
  const [isActive, setIsActive] = React.useState<boolean>(item.activityStatus ?? true);

  const { push, dismiss } = useTrays('main');
  const { t } = useTranslation();
  /*const resolvedIcon = React.useMemo(
    () => resolveRuntimeIcon(String(item.icon || 'faCodeCommit')) as IconProp,
    [item.icon],
  );*/
  const accentColor = color ?? infoColor;

  React.useEffect(() => {
    setIsActive(item.activityStatus ?? true);
  }, [item.activityStatus]);

  const handleToggleActive = React.useCallback(() => {
    const next = !isActive;
    setIsActive(next);
    onChangeNodeItem?.({
      ...item,
      activityStatus: next,
    });
  }, [isActive, item, onChangeNodeItem]);

  const handleRemove = React.useCallback(() => {
    onRemoveNodeItem?.();
  }, [onRemoveNodeItem]);

  const onPress = React.useCallback(() => {
    console.log('onPress', item);
    push('TrayWorkflowEventType', {
      onPress: () => {
        dismiss('TrayWorkflowEventType');
      },
    });
  }, [push, dismiss]);

  return (
    <Animated.View
      entering={FadeInDown.duration(160)}
      layout={undefined}
      //exiting={FadeOutUp.duration(160)}
      style={[
        //GlobalContainerStyle.rowCenterBetween,
        {
          //gap: 18,
          gap: 8,
          backgroundColor: shadeColor(secondaryBgColor, 0.1),
          //height: 28,
          
          paddingVertical: 6,
          borderRadius: 8,
          justifyContent: 'center',
        },
      ]}
    >
      <View style={[GlobalContainerStyle.rowCenterBetween, { paddingHorizontal: 10 }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 8 }]}>
          <FontAwesomeIcon icon={faSquare as IconProp} size={14} color={"#e09100"} />
          {/*<FontAwesomeIcon icon={resolvedIcon} size={16} color={accentColor} />*/}
          <TextInput
            editable={false}
            value={item.type === "eventType" ? "Ereignistypen" : "Kalender-Verbindungen"}
            placeholder="Name der Aktion"
            style={{
              color,
              fontSize: Number(SIZES.label),
              fontFamily: String(FAMILIY.subtitle),
              //maxWidth: 180,
            }}
            onChangeText={() => {}}
          />
        </View>
        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 14 }]}>
        <TouchableHaptic onPress={onPress}>
            <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
              <TextBase text="Auswählen" type="label" />
            </View>
          </TouchableHaptic>
          <Divider vertical />
          <TouchableHapticIcon
            icon={(isActive ? faPlay : faPause) as IconProp}
            iconSize={12}
            iconColor={isActive ? successColor : errorColor}
            hasViewCustomStyle={true}
            onPress={handleToggleActive}
          />
          <TouchableHapticIcon icon={faXmark as IconProp} iconSize={12} hasViewCustomStyle={true} onPress={handleRemove} />
        </View>
      </View>
      
      <View style={{ marginHorizontal: 4 }}>
        <TextBase text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." type="label" style={{ fontSize: 10, color: shadeColor(infoColor, 0.3), marginBottom: 4, marginLeft: 4 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 26 }} contentContainerStyle={{ gap: 4 }}>
            <TouchableTag
              text="30-Min Besprechung"
              type="label"
              colorActive={shadeColor(infoColor, 0.2)}
              colorInactive={shadeColor(infoColor, 0.2)}
              viewStyle={{ paddingVertical: 6, borderRadius: 6, paddingHorizontal: 8 }}
              textStyle={{ fontSize: 10, color: infoColor }}
              showActivityIcon={true}
              activityIconActive={faXmark as IconProp}
              activityIconInactive={faXmark as IconProp}
              onPress={() => { console.log('30-Min Besprechung'); }}
            />
            <TouchableTag
              text="45-Min Besprechung"
              type="label"
              colorActive={shadeColor(infoColor, 0.2)}
              colorInactive={shadeColor(infoColor, 0.2)}
              viewStyle={{ paddingVertical: 6, borderRadius: 6, paddingHorizontal: 8 }}
              textStyle={{ fontSize: 10, color: infoColor }}
              showActivityIcon={true}
              activityIconActive={faXmark as IconProp}
              activityIconInactive={faXmark as IconProp}
              onPress={() => { console.log('45-Min Besprechung'); }}
            />
          </ScrollView>
      </View>
    </Animated.View>
  );
};

const WorkflowNodeAction = React.memo(WorkflowNodeActionComponent);
WorkflowNodeAction.displayName = 'WorkflowNodeAction';

const WorkflowNodeDecision = React.memo(WorkflowNodeDecisionComponent);
WorkflowNodeDecision.displayName = 'WorkflowNodeDecision';

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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 6,
    paddingHorizontal: 2,
  },
  nodeWrapper: {
    gap: 4,
    overflow: 'hidden',
  },
  nodeWrapperSpacing: {
    //marginBottom: CONNECTION_INSERTION_HEIGHT + CONNECTION_INSERTION_MARGIN * 2,
    marginBottom: CONNECTION_INSERTION_HEIGHT + CONNECTION_INSERTION_MARGIN * 2,
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
  nodeHeaderContent: {
    gap: 4,
  },
  nodeHeaderActions: {
    gap: 14,
    marginLeft: 12,
  },
  nodeConnector: {
    position: 'absolute',
    left: '50%',
    marginVertical: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionLayer: {
    zIndex: -1,
  },
  connectionInsertionZone: {
    position: 'absolute',
    width: CONNECTION_INSERTION_WIDTH,
    height: CONNECTION_INSERTION_HEIGHT,
    borderRadius: 4,
    backgroundColor: '#626D7B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    paddingHorizontal: 10,
    //paddingHorizontal: 10,
  },
  connectionInsertionLabel: {
    color: '#fff',
  },
});


