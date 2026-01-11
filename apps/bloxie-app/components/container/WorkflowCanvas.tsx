import React from 'react';
import { LayoutChangeEvent, LayoutRectangle, ScrollView, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
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
  faMicrochip,
  faObjectExclude,
  faPause,
  faPlay,
  faSignPost,
  faSignsPost,
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
import { ConvexTemplateAPIProps } from '@codemize/backend/Types';
import { Id } from '../../../../packages/backend/convex/_generated/dataModel';
import { LanguageEnumProps, resolveRuntimeIcon } from '@/helpers/System';
import TouchableHapticTrigger from '../button/workflow/TouchableHapticTrigger';
import TouchableHapticTimePeriod from '../button/workflow/TouchableHapticTimePeriod';
import TouchableHapticConfirmation from '../button/workflow/TouchableHapticConfirmation';
import { STYLES } from '@codemize/constants/Styles';

export type WorkflowNodeType = 'start' | 'generic' | 'end';

export type WorkflowNodeItemVariant = 'action' | 'decision';

export type WorkflowNodeItemProps = {
  id: string;
  name: string;
  description: string;
  icon: IconProp;
  language: LanguageEnumProps;
  subject: string;
  content: string;
  isActive?: boolean;
  variant: WorkflowNodeItemVariant;
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
  onRemoveNode?: (node: WorkflowNode) => void;
  onAddNodeItem?: (node: WorkflowNode, variant: WorkflowNodeItemVariant, template: ConvexTemplateAPIProps) => void;
  onRemoveNodeItem?: (node: WorkflowNode, key: string) => void;
  onChangeNodeItem?: (node: WorkflowNode, item: WorkflowNodeItemProps) => void;
  renderNode?: (node: WorkflowNode) => React.ReactNode;
  children?: React.ReactNode;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const MIN_SCALE = 0.35;
const MAX_SCALE = 1;
const CONNECTION_INSERTION_HEIGHT = 0;
const CONNECTION_INSERTION_WIDTH = 160;
const CONNECTION_INSERTION_MARGIN = 4;
const CONTENT_VERTICAL_GAP = 0;

/** Shared no-op callback reused to avoid creating redundant handlers. */
const noop = () => {};

const NODE_EXIT_DURATION = 210;

const typeAccent: Record<WorkflowNodeType, string> = {
  start: '#626D7B',
  generic: '#626D7B',
  end: '#626D7B',
};

const typeBackground: Record<WorkflowNodeType, string> = {
  start: '#30303010',
  generic: '#30303010',
  end: '#30303010',
};

const typeLabel: Record<WorkflowNodeType, string> = {
  start: 'Start',
  generic: 'Prozessschritte',
  end: 'Ende',
};

const typeIcon: Record<WorkflowNodeType, IconProp> = {
  start: faBolt as IconProp,
  generic: faMicrochip as IconProp,
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

/** Normalizes legacy schema fields into a simple string array. */
const normalizeIds = (value?: unknown) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);
  }

  return typeof value === 'string' && value.length > 0 ? [value] : [];
};

/** Collects all parent ids across legacy and current node shapes. */
const getParentIds = (node: WorkflowNode): string[] => {
  const legacyParentIds = normalizeIds((node as LegacyWorkflowNodeProps).parentId);
  const currentParentIds = normalizeIds(node.parentNodeId);

  return Array.from(new Set([...legacyParentIds, ...currentParentIds]));
};

/** Collects child ids across legacy and current node shapes. */
const getChildIds = (node: WorkflowNode): string[] => {
  const legacyChildIds = normalizeIds((node as LegacyWorkflowNodeProps).childIds);
  const currentChildIds = Array.isArray(node.childNodeIds) ? node.childNodeIds : [];

  return Array.from(new Set([...legacyChildIds, ...currentChildIds].filter(id => typeof id === 'string' && id.length > 0)));
};

/** Derives directional connections to render between workflow nodes. */
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

/**
 * High-level canvas that renders nodes, their connections and contextual UI for
 * building automated workflows.
 */
export function WorkflowCanvas({
  nodes,
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

    const resolveNode = (
      node: WorkflowNode | null,
      fallback: WorkflowNodeType,
    ): WorkflowNode => {
      if (!node) {
        return {
          id: fallback,
          type: fallback,
          title: typeLabel[fallback],
          icon: typeIcon[fallback],
        } as WorkflowNode;
      }

      if (node.icon) {
        return node;
      }

      return {
        ...node,
        icon: typeIcon[node.type],
      };
    };

    const startNode = resolveNode(extractNodeByType('start'), 'start');
    const endNode = resolveNode(extractNodeByType('end'), 'end');

    return [startNode, ...inputNodes, endNode];
  }, [nodes]);
  const connections = React.useMemo(() => deriveConnectionsFromNodes(nodeList), [nodeList]);
  const renderedConnectionsCache = React.useRef<Map<string, RenderedConnection>>(new Map());
  const renderedConnections = React.useMemo(() => {
    // Cache rendered connection metadata to avoid re-calculating SVG paths on every render.
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

  /**
   * Stores the last known layout of a node so we can calculate connectors and drop zones accurately.
   */
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
            {/*<Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
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
            </Svg>*/}

            {/*<View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
              {renderedConnections.map(({ connection, overlayStyle }) => (
                <Animated.View
                  key={connection.id}
                  layout={LinearTransition.duration(220).easing(Easing.inOut(Easing.ease))}
                  style={[styles.connectionInsertionZone, overlayStyle, { paddingHorizontal: 10 }]}
                >
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
                      <View
                        style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}
                      >
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
                      <View
                        style={[GlobalContainerStyle.rowCenterStart, { gap: 4 }]}
                      >
                        <FontAwesomeIcon icon={faObjectExclude as IconProp} size={14} color="#fff" />
                        <TextBase text="Aktion" type="label" style={styles.connectionInsertionLabel} />
                      </View>
                    </TouchableHaptic>
                  </View>
                </Animated.View>
              ))}
            </View>*/}

            {nodeList.length > 0
              ? nodeList.map((node, index) => (
                  <WorkflowNode
                    key={node.id}
                    node={node}
                    isFirst={index === 0}
                    isLast={index === nodeList.length - 1}
                    onRemoveNode={onRemoveNode}
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
  );
}

type WorkflowNodeProps = {
  node: WorkflowNode;
  isFirst: boolean;
  isLast: boolean;
  onRemoveNode?: (node: WorkflowNode) => void;
  onAddNodeItem?: (node: WorkflowNode, variant: WorkflowNodeItemVariant, template: ConvexTemplateAPIProps) => void;
  onRemoveNodeItem?: (node: WorkflowNode, key: string) => void;
  onChangeNodeItem?: (node: WorkflowNode, item: WorkflowNodeItemProps) => void;
  onLayout: (layout: LayoutRectangle) => void;
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
  onLayout,
}: WorkflowNodeProps) => {
  const { errorColor, primaryIconColor, infoColor } = useThemeColors();
  const [title, setTitle] = React.useState<string>(node.title ?? '');
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const refTrigger = React.useRef<View>(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  const { push, dismiss } = useTrays('main');
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    setTitle(node.title ?? '');
  }, [node.title]);

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      onLayout(event.nativeEvent.layout);
    },
    [onLayout],
  );

  const accent = typeAccent[node.type];
  const normalizedItems = React.useMemo(
    () =>
      (node.items ?? []).map(item => ({
        ...item,
        variant: item.variant ?? 'action',
      })),
    [node.items],
  );
  const actionItems = React.useMemo(
    () => normalizedItems.filter(item => item.variant === 'action'),
    [normalizedItems],
  );
  const decisionItems = React.useMemo(
    () => normalizedItems.filter(item => item.variant === 'decision'),
    [normalizedItems],
  );

  const handleAddItem = React.useCallback(
    (variant: WorkflowNodeItemVariant) => {
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
      onLayout={handleLayout}
      layout={undefined}
      entering={FadeInDown.duration(180)}
      exiting={FadeOutUp.duration(NODE_EXIT_DURATION)}
      pointerEvents={isClosing ? 'none' : 'box-none'}
      style={[
        styles.nodeWrapper,
        !isLast && styles.nodeWrapperSpacing,
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
        {/*!isFirst && <WorkflowNodeConnector node={node} position="top" />*/}

        <View style={[GlobalContainerStyle.rowCenterStart, styles.nodeHeaderRow]}>

          <View style={[GlobalContainerStyle.rowCenterStart, styles.nodeHeaderContent]}>
            {!isActive && node.type === 'generic' && <TouchableTag
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

          <View style={{ flexGrow: 1 }} />

          {node.type === 'generic' && (
            <View style={[GlobalContainerStyle.rowCenterEnd, styles.nodeHeaderActions]}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 16 }]}>
                <TouchableHaptic
                  onPress={() => handleAddItem('action')}
                >
                  <FontAwesomeIcon
                    icon={faObjectExclude as IconProp}
                    size={STYLES.sizeFaIcon}
                    color="#587E1F"
                  />
                </TouchableHaptic>
                <TouchableHaptic
                  onPress={() => handleAddItem('decision')}
                >
                  <FontAwesomeIcon
                    icon={faSignsPost as IconProp}
                    size={STYLES.sizeFaIcon}
                    color="#e09100"
                  />
                </TouchableHaptic>
                <Divider vertical />
                <TouchableHaptic
                  onPress={() => {
                    setIsOpen(prev => !prev);
                  }}
                >
                  <FontAwesomeIcon icon={faAngleDown as IconProp} size={16} color={typeAccent[node.type]} />
                </TouchableHaptic>
              </View>
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

        {node.type === 'generic' && isOpen && (
          <View style={{ gap: 16, alignSelf: 'stretch' }}>
            {actionItems.length > 0 && (
              <View style={{ gap: 8 }}>
                <View style={{ opacity: isActive ? 1 : 0.5, gap: 4, alignSelf: 'stretch' }}>
                  {actionItems.map(item => (
                    <WorkflowNodeAction
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

            {decisionItems.length > 0 && (
              <View style={{ gap: 8 }}>
                <View style={{ opacity: isActive ? 1 : 0.5, gap: 4, alignSelf: 'stretch' }}>
                  {decisionItems.map(item => (
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
              <TextBase
                text="Noch keine Schritte hinzugefügt."
                type="label"
                style={{ color: '#626D7B', alignSelf: 'center', fontSize: 11 }}
              />
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const WorkflowNode = React.memo(WorkflowNodeComponent);
WorkflowNode.displayName = 'WorkflowNode';


const WorkflowNodeConfirmation = ({ node, containerRef }: { node: WorkflowNode, containerRef: React.RefObject<View|null> }) => {
  return (
    <TouchableHapticConfirmation
      refContainer={containerRef}
      onPress={noop}/>
  );
};

const WorkflowNodeTrigger = ({ node, containerRef }: { node: WorkflowNode, containerRef: React.RefObject<View|null> }) => {
  return (
    <TouchableHapticTrigger
      refContainer={containerRef}
      onPress={noop}
    />
  );
};

const WorkflowNodeTriggerTime = ({ node, containerRef }: { node: WorkflowNode, containerRef: React.RefObject<View|null> }) => {
  return (
    <TouchableHapticTimePeriod
      refContainer={containerRef}
      onPress={noop}/>
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
  item: WorkflowNodeItemProps;
  color: string;
  onRemoveNodeItem?: () => void;
  onChangeNodeItem?: (item: WorkflowNodeItemProps) => void;
}) => {
  const { secondaryBgColor, errorColor, successColor, infoColor } = useThemeColors();
  const [isActive, setIsActive] = React.useState<boolean>(item.isActive ?? true);
  const [name, setName] = React.useState<string>(item.name);

  const { push, dismiss } = useTrays('keyboard');

  const resolvedIcon = React.useMemo(
    () => resolveRuntimeIcon(String(item?.icon || 'faCodeCommit')) as IconProp,
    [item?.icon],
  );

  React.useEffect(() => {
    setIsActive(item.isActive ?? true);
  }, [item.isActive]);

  React.useEffect(() => {
    setName(item.name);
  }, [item.name]);

  const handleEdit = React.useCallback(() => {
    push('TrayWorkflowAction', {
      item,
      onAfterSave: (updated: WorkflowNodeItemProps) => {
        onChangeNodeItem?.(updated);
        setName(updated.name);
        setIsActive(updated.isActive ?? true);
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
      isActive: next,
    });
  }, [isActive, item, onChangeNodeItem]);

  const handleRemove = React.useCallback(() => {
    onRemoveNodeItem?.();
  }, [onRemoveNodeItem]);

  return (
    <Animated.View
      entering={FadeInDown.duration(160)}
      layout={undefined}
      exiting={FadeOutUp.duration(160)}
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
        <FontAwesomeIcon icon={resolvedIcon} size={16} color={infoColor} />
        <TextInput
          value={name}
          placeholder="Name der Aktion"
          style={{
            color,
            fontSize: Number(SIZES.label),
            fontFamily: String(FAMILIY.subtitle),
            maxWidth: 180,
          }}
          onChangeText={handleNameChange}
        />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 8 }]}>
        <TouchableHaptic onPress={handleEdit}>
          <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
            <TextBase text="Bearbeiten" type="label" />
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
  item: WorkflowNodeItemProps;
  color: string;
  onRemoveNodeItem?: () => void;
  onChangeNodeItem?: (item: WorkflowNodeItemProps) => void;
}) => {
  const { secondaryBgColor, errorColor, successColor, infoColor } = useThemeColors();
  const [isActive, setIsActive] = React.useState<boolean>(item.isActive ?? true);

  const resolvedIcon = React.useMemo(
    () => resolveRuntimeIcon(String(item.icon || 'faCodeCommit')) as IconProp,
    [item.icon],
  );
  const accentColor = color ?? infoColor;

  React.useEffect(() => {
    setIsActive(item.isActive ?? true);
  }, [item.isActive]);

  const handleToggleActive = React.useCallback(() => {
    const next = !isActive;
    setIsActive(next);
    onChangeNodeItem?.({
      ...item,
      isActive: next,
    });
  }, [isActive, item, onChangeNodeItem]);

  const handleRemove = React.useCallback(() => {
    onRemoveNodeItem?.();
  }, [onRemoveNodeItem]);

  return (
    <Animated.View
      entering={FadeInDown.duration(160)}
      layout={undefined}
      exiting={FadeOutUp.duration(160)}
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
        <FontAwesomeIcon icon={resolvedIcon} size={16} color={accentColor} />
        <TextBase text={item.name} type="label" style={{ color: accentColor, maxWidth: 180 }} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 8 }]}>
        <TouchableHaptic onPress={noop}>
          <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
            <TextBase text="Bearbeiten" type="label" style={{ color: accentColor }} />
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
    //paddingHorizontal: 10,
  },
  connectionInsertionLabel: {
    color: '#fff',
  },
});

