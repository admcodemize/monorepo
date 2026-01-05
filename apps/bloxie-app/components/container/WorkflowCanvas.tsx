import React from 'react';
import { LayoutChangeEvent, LayoutRectangle, ScrollView, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeOutUp, Layout, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAlarmClock,
  faAngleDown,
  faAnglesDown,
  faAnglesUp,
  faArrowDown,
  faBellSlash,
  faBolt,
  faBoltSlash,
  faBrightnessLow,
  faChevronDown,
  faChevronUp,
  faEllipsisStroke,
  faFileDashedLine,
  faFlagCheckered,
  faFunction,
  faLink,
  faMessageSlash,
  faObjectExclude,
  faPause,
  faPenNibSlash,
  faPlay,
  faPlus,
  faRectangleHistoryCirclePlus,
  faRepeat1,
  faStopwatch,
  faTrash,
  faXmark,
} from '@fortawesome/duotone-thin-svg-icons';
import GlobalContainerStyle from '@/styles/GlobalContainer';
import { shadeColor } from '@codemize/helpers/Colors';
import { useThemeColors } from '@/hooks/theme/useThemeColor';
import { FAMILIY, SIZES } from '@codemize/constants/Fonts';
import TouchableHapticDropdown from '../button/TouchableHapticDropdown';
import TouchableHaptic from '../button/TouchableHaptic';
import TouchableTag from '../button/TouchableTag';
import TextBase from '../typography/Text';
import TouchableHapticSwitch from '../button/TouchableHapticSwitch';
import TouchableHapticIcon from '../button/TouchableHaptichIcon';
import Divider from './Divider';
import { useTrays } from 'react-native-trays';
import { ConvexTemplateAPIProps } from '@codemize/backend/Types';
import { Id } from '../../../../packages/backend/convex/_generated/dataModel';
import { LanguageEnumProps, resolveRuntimeIcon } from '@/helpers/System';
import DropdownOverlay from './DropdownOverlay';
import ListProviderMailAccounts from '../lists/ListProviderMailAccounts';
import { open as _open } from '@/components/button/TouchableDropdown';
import { useDropdown } from '@/hooks/button/useDropdown';

export type WorkflowNodeType = 'start' | 'action' | 'decision' | 'end';

export type WorkflowNodeItemProps = {
  id: string;
  name: string;
  description: string;
  icon: IconProp;
  language: LanguageEnumProps;
  subject: string;
  content: string;
  isActive?: boolean;
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
  parentNodeId?: Id<"workflowNodes">;
  childNodeIds?: Id<"workflowNodes">[];
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

type RenderedConnection = {
  connection: WorkflowConnection;
  path: string;
  overlayStyle: ViewStyle;
  start: { x: number; y: number };
  end: { x: number; y: number };
};

export type WorkflowAdditionPayload = {
  fromId: string;
  toId: string | null;
  fromIndex: number;
  toIndex: number;
  parentId?: string;
};

type WorkflowCanvasProps = {
  nodes?: WorkflowNode[];
  onNodePress?: (node: WorkflowNode) => void;
  onAddNode?: (connection: WorkflowAdditionPayload|null, type: WorkflowNodeType) => void;
  onAddNodeItem?: (node: WorkflowNode, item: ConvexTemplateAPIProps) => void;
  onRemoveNodeItem?: (node: WorkflowNode, key: string) => void;
  onChangeNodeItem?: (node: WorkflowNode, item: WorkflowNodeItemProps) => void;
  renderNode?: (node: WorkflowNode) => React.ReactNode;
  gesturesEnabled?: boolean;
  children?: React.ReactNode;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const MIN_SCALE = 0.35;
const MAX_SCALE = 1;
const CONNECTION_INSERTION_HEIGHT = 24;
const CONNECTION_INSERTION_WIDTH = 160;
const CONNECTION_INSERTION_MARGIN = 4;
const CONTENT_VERTICAL_GAP = 8;

const typeAccent: Record<WorkflowNodeType, string> = {
  start: '#626D7B',
  action: '#626D7B',
  decision: '#626D7B',
  end: '#626D7B',
};

const typeBackground: Record<WorkflowNodeType, string> = {
  start: '#30303010',
  action: '#30303010',
  decision: '#30303010',
  end: '#30303010',
};

const typeLabel: Record<WorkflowNodeType, string> = {
  start: 'Start',
  action: 'Aktion',
  decision: 'Entscheidung',
  end: 'Ende',
};

const typeIcon: Record<WorkflowNodeType, IconProp> = {
  start: faBolt as IconProp,
  action: faObjectExclude as IconProp,
  decision: faFlagCheckered as IconProp,
  end: faStopwatch as IconProp,
};

const layoutsAreEqual = (a?: LayoutRectangle, b?: LayoutRectangle, epsilon = 0.5) => {
  if (!a || !b) return false;
  return (
    Math.abs(a.x - b.x) <= epsilon &&
    Math.abs(a.y - b.y) <= epsilon &&
    Math.abs(a.width - b.width) <= epsilon &&
    Math.abs(a.height - b.height) <= epsilon
  );
};

/** @description Multiple nodes can be connected to a single parent node */
type LegacyWorkflowNodeProps = {
  parentId?: string | string[];
  childIds?: string | string[];
};

const normalizeIds = (value?: unknown) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);
  }

  return typeof value === 'string' && value.length > 0 ? [value] : [];
};

const getParentIds = (node: WorkflowNode): string[] => {
  const legacyParentIds = normalizeIds((node as LegacyWorkflowNodeProps).parentId);
  const currentParentIds = normalizeIds(node.parentNodeId);

  return Array.from(new Set([...legacyParentIds, ...currentParentIds]));
};

const getChildIds = (node: WorkflowNode): string[] => {
  const legacyChildIds = normalizeIds((node as LegacyWorkflowNodeProps).childIds);
  const currentChildIds = Array.isArray(node.childNodeIds) ? node.childNodeIds : [];

  return Array.from(new Set([...legacyChildIds, ...currentChildIds].filter(id => typeof id === 'string' && id.length > 0)));
};

/** @description Multiple nodes can be connected to a single parent node */
const deriveConnectionsFromNodes = (nodes: WorkflowNode[]): WorkflowConnection[] => {
  if (!nodes || nodes.length === 0) {
    return [];
  }

  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const connections = new Map<string, WorkflowConnection>();

  const addConnection = (from?: string, to?: string, metadata?: Partial<WorkflowConnection>) => {
    if (!from || !to || from === to) {
      return;
    }

    const fromExists = nodeMap.has(from);
    const toExists = nodeMap.has(to);

    if (!fromExists && from !== 'start' && from !== 'end') {
      return;
    }

    if (!toExists && to !== 'start' && to !== 'end') {
      return;
    }

    const key = `${from}-${to}`;

    const existing = connections.get(key);

    if (!existing) {
      connections.set(key, {
        id: key,
        from,
        to,
        fromIndex: metadata?.fromIndex ?? -1,
        toIndex: metadata?.toIndex ?? -1,
        parentId: metadata?.parentId,
      });
      return;
    }

    if (metadata) {
      connections.set(key, {
        ...existing,
        fromIndex: metadata.fromIndex ?? existing.fromIndex,
        toIndex: metadata.toIndex ?? existing.toIndex,
        parentId: metadata.parentId ?? existing.parentId,
      });
    }
  };

  nodes.forEach((node, index) => {
    const parentIds = getParentIds(node);

    if (parentIds.length > 0) {
      parentIds.forEach(parentId =>
        addConnection(parentId, node.id, {
          parentId,
          toIndex: index,
        }),
      );
    } else if (index > 0) {
      addConnection(nodes[index - 1].id, node.id, {
        fromIndex: index - 1,
        toIndex: index,
      });
    }

    getChildIds(node).forEach(childId => addConnection(node.id, childId));
  });

  const startNode = nodes.find(node => node.type === 'start');
  const firstNonStart = nodes.find(node => node.type !== 'start');
  if (startNode && firstNonStart) {
    addConnection(startNode.id, firstNonStart.id, {
      fromIndex: nodes.findIndex(node => node.id === startNode.id),
      toIndex: nodes.findIndex(node => node.id === firstNonStart.id),
    });
  }

  const reversedNodes = [...nodes].reverse();
  const endNode = reversedNodes.find(node => node.type === 'end');
  const lastNonEnd = reversedNodes.find(node => node.type !== 'end');
  if (endNode && lastNonEnd) {
    addConnection(lastNonEnd.id, endNode.id, {
      fromIndex: nodes.findIndex(node => node.id === lastNonEnd.id),
      toIndex: nodes.findIndex(node => node.id === endNode.id),
    });
  }

  return Array.from(connections.values()).map(connection => {
    const resolvedFromIndex =
      connection.fromIndex >= 0 ? connection.fromIndex : nodes.findIndex(node => node.id === connection.from);
    const resolvedToIndex =
      connection.toIndex >= 0 ? connection.toIndex : nodes.findIndex(node => node.id === connection.to);
    const toNode = resolvedToIndex >= 0 ? nodes[resolvedToIndex] : undefined;
    const parentId =
      connection.parentId ??
      (toNode && getParentIds(toNode).length > 0 ? getParentIds(toNode)[0] : nodes[resolvedFromIndex]?.parentNodeId);

    return {
      ...connection,
      fromIndex: resolvedFromIndex,
      toIndex: resolvedToIndex,
      parentId,
    };
  });
};

export function WorkflowCanvas({
  nodes,
  onNodePress,
  onAddNode,
  onAddNodeItem,
  onRemoveNodeItem,
  onChangeNodeItem,
  renderNode,
  gesturesEnabled = false,
  children,
}: WorkflowCanvasProps) {
  const colors = useThemeColors();
  const refTrigger = React.useRef<View>(null);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .enabled(gesturesEnabled)
    .onUpdate(event => {
      translateX.value += event.translationX;
      translateY.value += event.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(gesturesEnabled)
    .onUpdate(event => {
      const next = clamp(scale.value * event.scale, MIN_SCALE, MAX_SCALE);
      scale.value = next;
    });

  const gesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const [nodeLayouts, setNodeLayouts] = React.useState<WorkflowNodeLayoutMap>({});
  const nodeList = React.useMemo(() => {
    if (!nodes) {
      return [];
    }

    const inputNodes = [...nodes];

    const extractNodeByType = (type: WorkflowNodeType) => {
      const index = inputNodes.findIndex(node => node.type === type);
      if (index === -1) {
        return null;
      }

      return inputNodes.splice(index, 1)[0];
    };

    const startNode =
      extractNodeByType('start') ??
      ({
        id: 'start',
        type: 'start',
        title: typeLabel.start,
        icon: typeIcon.start,
      } as WorkflowNode);

    const endNode =
      extractNodeByType('end') ??
      ({
        id: 'end',
        type: 'end',
        title: typeLabel.end,
        icon: typeIcon.end,
      } as WorkflowNode);

    return [{ ...startNode, icon: startNode.icon ?? typeIcon.start }, ...inputNodes, { ...endNode, icon: endNode.icon ?? typeIcon.end }];
  }, [nodes]);
  const connections = React.useMemo(() => deriveConnectionsFromNodes(nodeList), [nodeList]);
  const renderedConnectionsCache = React.useRef<Map<string, RenderedConnection>>(new Map());
  const renderedConnections = React.useMemo(() => {
    const prev = renderedConnectionsCache.current;
    const next = new Map<string, RenderedConnection>();

    const defaultGap = CONNECTION_INSERTION_HEIGHT + CONNECTION_INSERTION_MARGIN * 2 + CONTENT_VERTICAL_GAP;

    const getLayoutAtIndex = (index: number) => {
      if (index < 0 || index >= nodeList.length) {
        return undefined;
      }
      const node = nodeList[index];
      return nodeLayouts[node.id];
    };

    connections.forEach(connection => {
      const fromLayout = nodeLayouts[connection.from];
      const toLayout = nodeLayouts[connection.to];
      const previous = prev.get(connection.id);

      const resolvedStart = (() => {
        if (fromLayout) {
          return {
            x: fromLayout.x + fromLayout.width / 2,
            y: fromLayout.y + fromLayout.height,
          };
        }

        if (previous?.start) {
          return previous.start;
        }

        if (toLayout) {
          return {
            x: toLayout.x + toLayout.width / 2,
            y: toLayout.y - defaultGap,
          };
        }

        const fallbackLayout = getLayoutAtIndex(connection.toIndex + 1);
        if (fallbackLayout) {
          return {
            x: fallbackLayout.x + fallbackLayout.width / 2,
            y: fallbackLayout.y - defaultGap,
          };
        }

        return undefined;
      })();

      const resolvedEnd = (() => {
        if (toLayout) {
          return {
            x: toLayout.x + toLayout.width / 2,
            y: toLayout.y,
          };
        }

        if (previous?.end) {
          return previous.end;
        }

        if (fromLayout) {
          return {
            x: fromLayout.x + fromLayout.width / 2,
            y: fromLayout.y + fromLayout.height + defaultGap,
          };
        }

        const fallbackLayout = getLayoutAtIndex(connection.toIndex + 1);
        if (fallbackLayout) {
          return {
            x: fallbackLayout.x + fallbackLayout.width / 2,
            y: fallbackLayout.y,
          };
        }

        return undefined;
      })();

      if (!resolvedStart || !resolvedEnd) {
        if (previous) {
          next.set(connection.id, previous);
        }
        return;
      }

      const startX = resolvedStart.x;
      const startY = resolvedStart.y;
      const endX = resolvedEnd.x;
      const endY = resolvedEnd.y;
      const controlY = startY + (endY - startY) / 2;
      const midX = (startX + endX) / 2;
      const naturalCenterY = (startY + endY) / 2;

      const fromBottom = fromLayout ? fromLayout.y + fromLayout.height : startY;
      const toTop = toLayout ? toLayout.y : endY;

      const safeCenterMin = fromBottom + CONNECTION_INSERTION_MARGIN + CONNECTION_INSERTION_HEIGHT / 2;
      const safeCenterMax = toTop - CONNECTION_INSERTION_MARGIN - CONNECTION_INSERTION_HEIGHT / 2;
      const overlayCenterY =
        safeCenterMin <= safeCenterMax ? clamp(naturalCenterY, safeCenterMin, safeCenterMax) : naturalCenterY;

      next.set(connection.id, {
        connection,
        path: `M${startX} ${startY} C ${startX} ${controlY}, ${endX} ${controlY}, ${endX} ${endY}`,
        overlayStyle: {
          left: midX - CONNECTION_INSERTION_WIDTH / 2,
          top: overlayCenterY - CONNECTION_INSERTION_HEIGHT / 2,
        },
        start: resolvedStart,
        end: resolvedEnd,
      });
    });

    renderedConnectionsCache.current = next;
    return Array.from(next.values());
  }, [connections, nodeLayouts, nodeList]);

  const handleNodeLayout = React.useCallback((id: string, layout: LayoutRectangle) => {
    setNodeLayouts(prev => {
      const previous = prev[id];
      if (previous && layoutsAreEqual(previous, layout)) {
        return prev;
      }
      return { ...prev, [id]: layout };
    });
  }, []);

  return (
    <>
    <GestureDetector gesture={gesture}>
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
          <Animated.View style={[styles.content, animatedStyle]}>
            <Svg style={[StyleSheet.absoluteFill, styles.connectionLayer]} pointerEvents="none">
              {renderedConnections.map(({ connection, path }) => (
                <Path
                  key={connection.id}
                  d={path}
                  stroke="#000"
                  strokeWidth={1}
                  fill="none"
                  strokeLinecap="round"
                />
              ))}
            </Svg>

            <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
              {renderedConnections.map(({ connection, overlayStyle }) => (
                <View key={`${connection.id}-zone`} style={[styles.connectionInsertionZone, overlayStyle]}>
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 10 }]}>
                    <TouchableHaptic
                      onPress={() => {
                        onAddNode?.({
                          fromId: connection.from,
                          toId: connection.to === connection.from ? null : connection.to,
                          fromIndex: connection.fromIndex,
                          toIndex: connection.toIndex,
                          parentId: connection.parentId,
                        }, 'decision');
                      }}
                    >
                      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                        <FontAwesomeIcon icon={faFlagCheckered as IconProp} size={14} color="#fff" />
                        <TextBase text="Entscheidung" type="label" style={styles.connectionInsertionLabel} />
                      </View>
                    </TouchableHaptic>
                    <TouchableHaptic
                      onPress={() => {
                        onAddNode?.({
                          fromId: connection.from,
                          toId: connection.to === connection.from ? null : connection.to,
                          fromIndex: connection.fromIndex,
                          toIndex: connection.toIndex,
                          parentId: connection.parentId,
                        }, 'action');
                      }}
                    >
                      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}>
                        <FontAwesomeIcon icon={faObjectExclude as IconProp} size={14} color="#fff" />
                        <TextBase text="Aktion" type="label" style={styles.connectionInsertionLabel} />
                      </View>
                    </TouchableHaptic>
                  </View>
                </View>
              ))}
            </View>

            {nodeList.length > 0
              ? nodeList.map((node, index) => (
                  <WorkflowNode
                    key={node.id}
                    node={node}
                    isFirst={index === 0}
                    isLast={index === nodeList.length - 1}
                    onAddNodeItem={onAddNodeItem}
                    onRemoveNodeItem={onRemoveNodeItem}
                    onChangeNodeItem={onChangeNodeItem}
                    onLayout={layout => handleNodeLayout(node.id, layout)}
                  />
                ))
              : renderNode
              ? (nodes ?? []).map(renderNode)
              : children}
          </Animated.View>
        </ScrollView>
      </View>
    </GestureDetector>
    </>
  );
}

type WorkflowNodeProps = {
  node: WorkflowNode;
  isFirst: boolean;
  isLast: boolean;
  onAddNodeItem?: (node: WorkflowNode,item: ConvexTemplateAPIProps) => void;
  onRemoveNodeItem?: (node: WorkflowNode, key: string) => void;
  onChangeNodeItem?: (node: WorkflowNode, item: WorkflowNodeItemProps) => void;
  onLayout: (layout: LayoutRectangle) => void;
};

const WorkflowNode = ({ node, isFirst, isLast, onAddNodeItem, onRemoveNodeItem, onChangeNodeItem, onLayout }: WorkflowNodeProps) => {
  const { secondaryBgColor, errorColor } = useThemeColors();
  const [title, setTitle] = React.useState<string>(node.title ?? '');
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const refTrigger = React.useRef<View>(null);

  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  const { push, dismiss } = useTrays('main');

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      onLayout(event.nativeEvent.layout);
    },
    [onLayout],
  );

  const accent = typeAccent[node.type];

  return (
    <Animated.View
      onLayout={handleLayout}
      entering={FadeInDown.duration(180)}
      exiting={FadeOutUp.duration(140)}
      pointerEvents="box-none"
      style={[styles.nodeWrapper, !isLast && styles.nodeWrapperSpacing]}
    >
      <View style={styles.tagRow}>
        <TouchableTag
          icon={typeIcon[node.type]}
          text={typeLabel[node.type]}
          type="label"
          isActive={true}
          disabled={true}
          colorActive={shadeColor((node.type === "start" || node.type === "end") ? '#3F37A0' : node.type === "action" ? '#587E1F' : node.type === "decision" ? '#e09100' : typeAccent[node.type], 0)}
          viewStyle={{ paddingVertical: 3 }}
        />
      </View>

        <View style={[styles.node]} pointerEvents="box-none" ref={refTrigger}>
        {!isFirst && <WorkflowNodeConnector node={node} position="top" />}

        <View style={[GlobalContainerStyle.rowCenterStart, styles.nodeHeaderRow]}>

          <View style={[GlobalContainerStyle.rowCenterStart, styles.nodeHeaderContent]}>
            {!isActive && (node.type === 'action' || node.type === 'decision') && <TouchableTag
              text={"Inaktiv"}
              type="label"
              colorInactive={errorColor}
              viewStyle={{ paddingVertical: 3 }}/>}
            <FontAwesomeIcon icon={(node.icon as IconProp) ?? typeIcon[node.type]} size={16} color={accent} />
            <TextInput
              //editable={node.type === 'start'}
              value={title}
              onChangeText={setTitle}
              placeholder="Name des Workflows"
              style={{
                color: accent,
                fontSize: Number(SIZES.label),
                fontFamily: String(FAMILIY.subtitle),
                flexGrow: 0,
              }}/>

          </View>

          <View style={{ flexGrow: 1, backgroundColor: 'red' }} />

          {(node.type === 'action' || node.type === 'decision') && (
            <View style={[GlobalContainerStyle.rowCenterEnd, styles.nodeHeaderActions]}>
              {node.type === 'action' && <TouchableHaptic
                onPress={() => {
                  push('WorkflowActionTemplateListTray', { onPress: (template: ConvexTemplateAPIProps) => {
                    dismiss("WorkflowActionTemplateListTray");
                    onAddNodeItem?.(node, template);
                  } });
                }}>
                <FontAwesomeIcon icon={faRectangleHistoryCirclePlus as IconProp} size={16} color="#047dd4" />
              </TouchableHaptic>}

              {node.type === 'decision' && <TouchableHaptic
                onPress={() => {
                  push('WorkflowDecisionTemplateListTray', { onPress: (template: ConvexTemplateAPIProps) => {
                    dismiss("WorkflowDecisionTemplateListTray");
                    onAddNodeItem?.(node, template);
                  } });
                }}>
                <FontAwesomeIcon icon={faRectangleHistoryCirclePlus as IconProp} size={16} color="#047dd4" />
              </TouchableHaptic>}

              <TouchableHaptic
                onPress={() => {
                  setIsActive((prev) => !prev);
                }}>
                <FontAwesomeIcon icon={faEllipsisStroke as IconProp} size={16} color={typeAccent[node.type]} />
              </TouchableHaptic>

              <TouchableHaptic
                onPress={() => {
                  setIsOpen((prev) => !prev);
                }}>
                <FontAwesomeIcon icon={faAngleDown as IconProp} size={16} color={typeAccent[node.type]} />
              </TouchableHaptic>
            </View>
          )}


        </View>

        {node.type === 'start' && (
          <>
            <View style={{ gap: 4}}>
              {/*<WorkflowNodeEventType node={node} />
              <WorkflowNodeCalendarGroup node={node} />*/}
              <WorkflowNodeTrigger node={node} containerRef={refTrigger} />
              <WorkflowNodeTriggerTime node={node} containerRef={refTrigger} />
            </View>
          </>
        )}

        {node.type === 'end' && (
          <>
            <WorkflowNodeConfirmation node={node} containerRef={refTrigger} />
          </>
        )}

        {node.type === 'action' && isOpen &&
        <View style={{ opacity: isActive ? 1 : 0.5, gap: 4, alignSelf: 'stretch' }}>
          {node.items?.map((item) => <WorkflowNodeAction key={item.id} item={item} color={typeAccent[node.type]} onRemoveNodeItem={() => {
            onRemoveNodeItem?.(node, item.id);
            console.log("onRemoveNodeItem", node, item.id);
          }} onChangeNodeItem={(item: WorkflowNodeItemProps) => {
            onChangeNodeItem?.(node, item);
          }} />)}
        </View>}

        {node.type === 'decision' &&
        <View style={{ opacity: isActive ? 1 : 0.5, gap: 4, alignSelf: 'stretch' }}>
          {node.items?.map((item) => <WorkflowNodeDecision key={item.id} {...item} />)}
        </View>}

        {!isLast && node.type !== 'end' && <WorkflowNodeConnector node={node} position='bottom' />}
      </View>
    </Animated.View>
  );
};

const WorkflowNodeConnector = ({ node, position }: { node: WorkflowNode; position: 'top' | 'bottom' }) => (
  <View
    style={[
      styles.nodeConnector,
      {
        borderColor: '#000',
        borderWidth: 2,
        backgroundColor: '#fff',
        [position]: 0,
      },
    ]}
  />
);

const WorkflowNodeConfirmation = ({ node, containerRef }: { node: WorkflowNode, containerRef: React.RefObject<View|null> }) => {
  const { secondaryBgColor, tertiaryBgColor, secondaryBorderColor } = useThemeColors();

  const refTrigger = React.useRef<View>(null);


  const children = () => {
    return (
    <View style={{ backgroundColor: "#fff", borderRadius: 6, padding: 4, paddingHorizontal: 8, paddingVertical: 8
            , borderWidth: 1, borderColor: shadeColor(secondaryBorderColor, 0.3)
            , gap: 8
          }} 
          
          onLayout={(event) => {
            console.log("[onLayout]", event.nativeEvent.layout);
          }}>

            <TextBase text="Push-Benachrichtigung" type="label" style={{ color: typeAccent[node.type] }} />
            <TextBase text="E-Mail" type="label" style={{ color: typeAccent[node.type] }} />
            <TextBase text="E-Mail" type="label" style={{ color: typeAccent[node.type] }} />
            <TextBase text="E-Mail" type="label" style={{ color: typeAccent[node.type] }} />
            <TextBase text="E-Mail" type="label" style={{ color: typeAccent[node.type] }} />
            <TextBase text="E-Mail" type="label" style={{ color: typeAccent[node.type] }} />
          </View>
    )
  }

  /**
   * @description Get the dropdown functions for displaying the mail accounts.
   * @see {@link hooks/button/useDropdown} */
   const { open } = useDropdown();

  /**
   * @description Used to open the dropdown component
   * @function */
  const onPressDropdown = () => {
    /** 
     * @description Open the dropdown component based on a calculated measurement template
     * @see {@link components/button/TouchableDropdown} */
    _open({
      refTouchable: refTrigger,
      relativeToRef: containerRef,
      //hostId: "tray",
      open,
      openOnTop: true,
      children: children(),
    });
  };

  return (
    <View
      style={[
        GlobalContainerStyle.rowCenterBetween,
        {
          gap: 18,
          backgroundColor: shadeColor(secondaryBgColor, 0.3),
          height: 28,
          paddingHorizontal: 10,
          borderRadius: 8,
          alignSelf: 'stretch',
        },
      ]}
    >
      <TextBase text="Bestätigung" type="label" style={{ color: typeAccent[node.type] }} />
      <TouchableHapticDropdown
        ref={refTrigger}
        icon={faBellSlash as IconProp}
        text="Push-Benachrichtigung"
        backgroundColor={tertiaryBgColor}
        hasViewCustomStyle
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
        onPress={onPressDropdown}
      />
    </View>
  );
};

const WorkflowNodeTrigger = ({ node, containerRef }: { node: WorkflowNode, containerRef: React.RefObject<View|null> }) => {
  const { secondaryBgColor, tertiaryBgColor, secondaryBorderColor } = useThemeColors();


  const refTrigger = React.useRef<View>(null);

  /**
   * @description Get the dropdown functions for displaying the mail accounts.
   * @see {@link hooks/button/useDropdown} */
   const { open } = useDropdown();

  /**
   * @description Used to open the dropdown component
   * @function */
  const onPressDropdown = () => {
    /** 
     * @description Open the dropdown component based on a calculated measurement template
     * @see {@link components/button/TouchableDropdown} */
    _open({
      refTouchable: refTrigger,
      relativeToRef: containerRef,
      //hostId: "tray",
      open,
      children: <View style={{ backgroundColor: "#fff", borderRadius: 6, padding: 4, paddingHorizontal: 8, paddingVertical: 8
        , borderWidth: 1, borderColor: shadeColor(secondaryBorderColor, 0.3)
       }}>

        <TextBase text="Vor Ereignisbeginn" type="label" style={{ color: typeAccent[node.type] }} />
       </View>,
    });
  };

  return (
    <View
      style={[
        GlobalContainerStyle.rowCenterBetween,
        {
          gap: 18,
          backgroundColor: shadeColor(secondaryBgColor, 0.3),
          height: 28,
          paddingHorizontal: 10,
          borderRadius: 8,
        },
      ]}
    >
      <TextBase text="Auslöser" type="label" style={{ color: typeAccent[node.type] }} />
      <TouchableHapticDropdown
        ref={refTrigger}
        icon={faFunction as IconProp}
        text="Vor Ereignisbeginn"
        backgroundColor={tertiaryBgColor}
        hasViewCustomStyle
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
        onPress={onPressDropdown}/>
    </View>
  );
};

const WorkflowNodeTriggerTime = ({ node, containerRef }: { node: WorkflowNode, containerRef: React.RefObject<View|null> }) => {
  const { secondaryBgColor, tertiaryBgColor, secondaryBorderColor } = useThemeColors();


  const refTrigger = React.useRef<View>(null);

  /**
   * @description Get the dropdown functions for displaying the mail accounts.
   * @see {@link hooks/button/useDropdown} */
   const { open } = useDropdown();

  /**
   * @description Used to open the dropdown component
   * @function */
  const onPressDropdown = () => {
    /** 
     * @description Open the dropdown component based on a calculated measurement template
     * @see {@link components/button/TouchableDropdown} */
    _open({
      refTouchable: refTrigger,
      relativeToRef: containerRef,
      //hostId: "tray",
      open,
      children: <View style={{ backgroundColor: "#fff", borderRadius: 6, padding: 4, paddingHorizontal: 8, paddingVertical: 8
        , borderWidth: 1, borderColor: shadeColor(secondaryBorderColor, 0.3)
       }}>

        <TextBase text="24H" type="label" style={{ color: typeAccent[node.type] }} />
       </View>,
    });
  };

  return (
    <View
      style={[
        GlobalContainerStyle.rowCenterBetween,
        {
          gap: 18,
          backgroundColor: shadeColor(secondaryBgColor, 0.3),
          height: 28,
          paddingHorizontal: 10,
          borderRadius: 8,
        },
      ]}
    >
      <TextBase text="Zeitraum" type="label" style={{ color: typeAccent[node.type] }} />
      <TouchableHapticDropdown
        ref={refTrigger}
        icon={faAlarmClock as IconProp}
        text="24h"
        backgroundColor={tertiaryBgColor}
        hasViewCustomStyle
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
        onPress={onPressDropdown}
      />
    </View>
  );
};


const WorkflowNodeAction = ({ item, color, onRemoveNodeItem, onChangeNodeItem }: { item: WorkflowNodeItemProps, color: string, onRemoveNodeItem?: () => void, onChangeNodeItem?: (item: WorkflowNodeItemProps) => void }) => {
  const { secondaryBgColor, errorColor, successColor, infoColor } = useThemeColors();
  const [isActive, setIsActive] = React.useState<boolean>(item.isActive ?? true);
  const [name, setName] = React.useState<string>(item.name);

  const { push, dismiss } = useTrays('modal');

  React.useEffect(() => {
    setIsActive(item.isActive ?? true);
  }, [item.isActive]);

  React.useEffect(() => {
    setName(item.name);
  }, [item.name]);

  const onPressEditAction = React.useCallback(() => {
    push('WorkflowActionTemplateTray', {
      item,
      onAfterSave: (updated: WorkflowNodeItemProps) => {
        onChangeNodeItem?.(updated);
        setName(updated.name);
        setIsActive(updated.isActive ?? true);
        dismiss('WorkflowActionTemplateTray');
      },
    });
  }, [push, dismiss, item, onChangeNodeItem]);


  return (
    <View
      style={[
        GlobalContainerStyle.rowCenterBetween,
        {
          gap: 18,
          backgroundColor: shadeColor(secondaryBgColor, 0.3),
          height: 28,
          paddingHorizontal: 10,
          borderRadius: 8,
        },
      ]}
    >
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 8 }]}>
      <FontAwesomeIcon icon={resolveRuntimeIcon(String(item?.icon || "faCodeCommit")) as IconProp} size={16} color={infoColor} />
      <TextInput
        value={name}
        placeholder="Name der Aktion"
        style={{
          color: color,
          fontSize: Number(SIZES.label),
          fontFamily: String(FAMILIY.subtitle),
          maxWidth: 180
        }}
        onChangeText={(text) => {
          setName(text);
          onChangeNodeItem?.({
            ...item,
            name: text,
          });
        }}/>
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 8 }]}>
        <TouchableHaptic onPress={onPressEditAction}>
          <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
            {/* <FontAwesomeIcon icon={faPenNibSlash as IconProp} size={16} color={color} /> */}
            <TextBase text="Bearbeiten" type="label" style={{  }} />
          </View>
        </TouchableHaptic>
        <Divider vertical />
        <TouchableHapticIcon
          icon={isActive ? faPlay as IconProp : faPause as IconProp}
          iconSize={12}
          iconColor={isActive ? successColor : errorColor}
          hasViewCustomStyle={true}
          onPress={() => {
            const next = !isActive;
            setIsActive(next);
            onChangeNodeItem?.({
              ...item,
              isActive: next,
            });
          }}/>
        <TouchableHapticIcon
          icon={faXmark as IconProp}
          iconSize={12}
          hasViewCustomStyle={true}
          onPress={() => {
            onRemoveNodeItem?.();
          }}/>
      </View>
    </View>
  );
};

const WorkflowNodeDecision = ({ name, icon }: WorkflowNodeItemProps) => {
  const { secondaryBgColor, tertiaryBgColor, errorColor, successColor, infoColor } = useThemeColors();
  const [isActive, setIsActive] = React.useState<boolean>(true);

  return (
    <View
      style={[
        GlobalContainerStyle.rowCenterBetween,
        {
          gap: 18,
          backgroundColor: shadeColor(secondaryBgColor, 0.3),
          height: 28,
          paddingHorizontal: 10,
          borderRadius: 8,
        },
      ]}
    >
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 8 }]}>
      <FontAwesomeIcon icon={resolveRuntimeIcon(String(icon || "faCodeCommit")) as IconProp} size={16} color={infoColor} />
      <TextBase
        text={name}
        type="label"
        style={{ color: infoColor, maxWidth: 180 }} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 8 }]}>
        <TouchableHaptic>
          <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
            <TextBase text="Bearbeiten" type="label" style={{  }} />
          </View>
        </TouchableHaptic>
        <Divider vertical />
        <TouchableHapticIcon
          icon={isActive ? faPlay as IconProp : faPause as IconProp}
          iconSize={12}
          iconColor={isActive ? successColor : errorColor}
          hasViewCustomStyle={true}
          onPress={() => {
            setIsActive((prev) => !prev);
          }}/>
        <TouchableHapticIcon
          icon={faXmark as IconProp}
          iconSize={12}
          hasViewCustomStyle={true}
          onPress={() => {}}/>

      </View>
    </View>
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
  },
  nodeWrapper: {
    gap: 4,
  },
  nodeWrapperSpacing: {
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
    gap: 18,
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
  },
  connectionInsertionLabel: {
    color: '#fff',
  },
});

