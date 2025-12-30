import React from 'react';
import { LayoutChangeEvent, LayoutRectangle, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAlarmClock,
  faAnglesDown,
  faAnglesUp,
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
  faPenNibSlash,
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

export type WorkflowNodeType = 'start' | 'action' | 'decision' | 'end';

export type WorkflowNodeFunction = {
  id: string;
  name: string;
  description: string;
  icon: IconProp;
};

export type WorkflowNode = {
  id: string;
  type: WorkflowNodeType;
  title?: string;
  subtitle?: string;
  icon?: IconProp;
  meta?: string;
  functions?: WorkflowNodeFunction[];
  parentId?: string | string[] | null;
  position?: { x: number; y: number };
};

export type WorkflowConnection = {
  id: string;
  from: string;
  to: string;
};

export type WorkflowNodeLayoutMap = Record<string, LayoutRectangle>;

type WorkflowCanvasProps = {
  nodes?: WorkflowNode[];
  onNodePress?: (node: WorkflowNode) => void;
  onAddNode?: (afterId: string | null) => void;
  renderNode?: (node: WorkflowNode) => React.ReactNode;
  gesturesEnabled?: boolean;
  children?: React.ReactNode;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const MIN_SCALE = 0.35;
const MAX_SCALE = 1;

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
const getParentIds = (node: WorkflowNode): string[] => {
  if (!node.parentId) {
    return [];
  }

  if (Array.isArray(node.parentId)) {
    return node.parentId.filter((parent): parent is string => typeof parent === 'string' && parent.length > 0);
  }

  return typeof node.parentId === 'string' && node.parentId.length > 0 ? [node.parentId] : [];
};

/** @description Multiple nodes can be connected to a single parent node */
const deriveConnectionsFromNodes = (nodes: WorkflowNode[]): WorkflowConnection[] =>
  nodes.reduce<WorkflowConnection[]>((acc, node, index) => {
    const parentIds = getParentIds(node);

    if (parentIds.length > 0) {
      parentIds.forEach(parentId => {
        if (!parentId) {
          return;
        }

        const parentExists = nodes.some(candidate => candidate.id === parentId);
        if (!parentExists) {
          return;
        }

        acc.push({
          id: `${parentId}-${node.id}`,
          from: parentId,
          to: node.id,
        });
      });

      return acc;
    }

    if (index > 0) {
      const previousNode = nodes[index - 1];
      acc.push({
        id: `${previousNode.id}-${node.id}`,
        from: previousNode.id,
        to: node.id,
      });
    }

    return acc;
  }, []);

export function WorkflowCanvas({
  nodes,
  onNodePress,
  onAddNode,
  renderNode,
  gesturesEnabled = false,
  children,
}: WorkflowCanvasProps) {
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
  const nodeList = React.useMemo(() => nodes ?? [], [nodes]);
  const connections = React.useMemo(() => deriveConnectionsFromNodes(nodeList), [nodeList]);

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
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <Pattern id="dots" patternUnits="userSpaceOnUse" width={22} height={22}>
              <Circle cx={1} cy={1} r={1} fill="#d0d0d0" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#dots)" />

          {connections.map(connection => {
            const fromLayout = nodeLayouts[connection.from];
            const toLayout = nodeLayouts[connection.to];

            if (!fromLayout || !toLayout) {
              return null;
            }

            const startX = fromLayout.x + fromLayout.width / 2;
            const startY = fromLayout.y + fromLayout.height;
            const endX = toLayout.x + toLayout.width / 2;
            const endY = toLayout.y;
            const controlY = startY + (endY - startY) / 2;

            const path = `M${startX} ${startY} C ${startX} ${controlY}, ${endX} ${controlY}, ${endX} ${endY}`;

            return (
              <Path
                key={connection.id}
                d={path}
                stroke="#000"
                strokeWidth={1}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </Svg>

        <ScrollView>
        <Animated.View style={[styles.content, animatedStyle]}>
          {nodeList.length > 0
            ? nodeList.map((node, index) => (
                <WorkflowNode
                  key={node.id}
                  node={node}
                  isFirst={index === 0}
                  isLast={index === nodeList.length - 1}
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
  );
}

type WorkflowNodeProps = {
  node: WorkflowNode;
  isFirst: boolean;
  isLast: boolean;
  onLayout: (layout: LayoutRectangle) => void;
};

const WorkflowNode = ({ node, isFirst, isLast, onLayout }: WorkflowNodeProps) => {
  const { secondaryBgColor, errorColor } = useThemeColors();
  const [title, setTitle] = React.useState<string>(node.title ?? '');
  const [isVisible, setIsVisible] = React.useState<boolean>(true);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      onLayout(event.nativeEvent.layout);
    },
    [onLayout],
  );

  const accent = typeAccent[node.type];

  return (
    <View style={styles.nodeWrapper} onLayout={handleLayout}>
      <View style={styles.tagRow}>
        <TouchableTag
          icon={typeIcon[node.type]}
          text={typeLabel[node.type]}
          type="label"
          colorInactive={shadeColor((node.type === "start" || node.type === "end") ? '#3F37A0' : node.type === "action" ? '#587E1F' : node.type === "decision" ? '#e09100' : typeAccent[node.type], 0.4)}
          colorActive={shadeColor((node.type === "start" || node.type === "end") ? '#3F37A0' : node.type === "action" ? '#587E1F' : node.type === "decision" ? '#e09100' : typeAccent[node.type], 0)}
          isActive={isVisible}
          onPress={setIsVisible}
          showActivityIcon={true}
          activityIconActive={faAnglesUp as IconProp}
          activityIconInactive={faAnglesDown as IconProp}
          viewStyle={{ paddingVertical: 3 }}
        />
      </View>

      <View style={[styles.node]} pointerEvents="box-none">
        {!isFirst && <WorkflowNodeConnector node={node} position="top" />}

        <View style={[GlobalContainerStyle.rowCenterBetween, { paddingHorizontal: 4, gap: 18 }]}>
          <View style={[GlobalContainerStyle.rowCenterStart, styles.nodeHeader, { opacity: 1 }]}>
            {!isActive && (node.type === 'action' || node.type === 'decision') && <TouchableTag
              text={"Inaktiv"}
              type="label"
              colorInactive={errorColor}
              viewStyle={{ paddingVertical: 3 }}/>}
            <FontAwesomeIcon icon={(node.icon as IconProp) ?? typeIcon[node.type]} size={16} color={accent} />
            <TextInput
              editable={node.type === 'start'}
              value={title}
              onChangeText={setTitle}
              placeholder="Name des Workflows"
              style={{
                color: accent,
                fontSize: Number(SIZES.label),
                fontFamily: String(FAMILIY.subtitle),
              }}
            />
          </View>

          
          {(node.type === 'action' || node.type === 'decision') && (
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 14 }]}>
              <FontAwesomeIcon icon={faRectangleHistoryCirclePlus as IconProp} size={16} color="#047dd4" />
              <FontAwesomeIcon icon={faEllipsisStroke as IconProp} size={16} color={accent} />
            </View>
          )}
        </View>

        {node.type === 'start' && isVisible && (
          <>
            <WorkflowNodeEventType node={node} />
            <WorkflowNodeCalendarGroup node={node} />
            <WorkflowNodeTrigger node={node} />
            <WorkflowNodeTriggerTime node={node} />
          </>
        )}

        {node.type === 'end' && isVisible && (
          <>
            <WorkflowNodeConfirmation node={node} />
            <WorkflowNodeRepeat node={node} />
          </>
        )}

        {node.type === 'action' && isVisible &&
        <View style={{ opacity: isActive ? 1 : 0.5, gap: 4 }}>
          {node.functions?.map((functionItem) => <WorkflowNodeAction key={functionItem.id} functionItem={functionItem} color={typeAccent[node.type]} />)}
        </View>}

        {node.type === 'decision' && isVisible &&
        <View style={{ opacity: isActive ? 1 : 0.5, gap: 4 }}>
          {node.functions?.map((functionItem) => <WorkflowNodeDecision key={functionItem.id} {...functionItem} />)}
        </View>}

        {!isLast && node.type !== 'end' && <WorkflowNodeConnector node={node} position='bottom' />}
      </View>
    </View>
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

const WorkflowNodeEventType = ({ node }: { node: WorkflowNode }) => {
  const { secondaryBgColor, tertiaryBgColor } = useThemeColors();
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
      <TextBase text="Termintypen" type="label" style={{ color: typeAccent[node.type] }} />
      <TouchableHapticDropdown
        icon={faBoltSlash as IconProp}
        text="Alle Typen"
        backgroundColor={tertiaryBgColor}
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        hasViewCustomStyle
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
      />
    </View>
  );
};

const WorkflowNodeCalendarGroup = ({ node }: { node: WorkflowNode }) => {
  const { secondaryBgColor, tertiaryBgColor } = useThemeColors();
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
      <TextBase text="Kalendergruppen" type="label" style={{ color: typeAccent[node.type] }} />
      <TouchableHapticDropdown
        icon={faLink as IconProp}
        text="2 Gruppen"
        backgroundColor={tertiaryBgColor}
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        hasViewCustomStyle
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
      />
    </View>
  );
};

const WorkflowNodeConfirmation = ({ node }: { node: WorkflowNode }) => {
  const { secondaryBgColor, tertiaryBgColor } = useThemeColors();
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
      <TextBase text="Bestätigung" type="label" style={{ color: typeAccent[node.type] }} />
      <TouchableHapticDropdown
        icon={faBellSlash as IconProp}
        text="Push-Benachrichtigung"
        backgroundColor={tertiaryBgColor}
        hasViewCustomStyle
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}/>
    </View>
  );
};

const WorkflowNodeTrigger = ({ node }: { node: WorkflowNode }) => {
  const { secondaryBgColor, tertiaryBgColor } = useThemeColors();
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
        icon={faFunction as IconProp}
        text="Vor Ereignisbeginn"
        backgroundColor={tertiaryBgColor}
        hasViewCustomStyle
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}/>
    </View>
  );
};

const WorkflowNodeTriggerTime = ({ node }: { node: WorkflowNode }) => {
  const { secondaryBgColor, tertiaryBgColor } = useThemeColors();
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
        icon={faAlarmClock as IconProp}
        text="24h"
        backgroundColor={tertiaryBgColor}
        hasViewCustomStyle
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
      />
    </View>
  );
};

const WorkflowNodeRepeat = ({ node }: { node: WorkflowNode }) => {
  const { secondaryBgColor, tertiaryBgColor } = useThemeColors();
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
      <TextBase text="Wiederholung" type="label" style={{ color: typeAccent[node.type] }} />
      <TouchableHapticDropdown
        icon={faRepeat1 as IconProp}
        text="Keine"
        backgroundColor={tertiaryBgColor}
        hasViewCustomStyle
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
      />
    </View>
  );
};

const WorkflowNodeAction = ({ functionItem, color }: { functionItem: WorkflowNodeFunction, color: string }) => {
  const { secondaryBgColor, errorColor } = useThemeColors();


  const { push, dismiss } = useTrays('modal');

  const onPressEditAction = React.useCallback(() => {
    push('WorkflowEditActionTray', { functionItem, onAfterSave: () => {
      dismiss('WorkflowEditActionTray');
    } });
  }, [push, dismiss, functionItem]);


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
      <FontAwesomeIcon icon={functionItem.icon as IconProp} size={18} color={color} />
      <TextBase text={functionItem.name} type="label" style={{ color: color }} />
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
          icon={faXmark as IconProp}
          iconSize={12}
          hasViewCustomStyle={true}
          onPress={() => {}}/>
      </View>
    </View>
  );
};

const WorkflowNodeDecision = ({ name, icon }: WorkflowNodeFunction) => {
  const { secondaryBgColor, tertiaryBgColor, errorColor } = useThemeColors();
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
      <TouchableHapticDropdown
        icon={icon as IconProp}
        text={name}
        backgroundColor={tertiaryBgColor}
        hasViewCustomStyle
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}/>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 8 }]}>
        <TouchableHaptic>
          <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
            {/* <FontAwesomeIcon icon={faPenNibSlash as IconProp} size={16} color={color} /> */}
            <TextBase text="Bearbeiten" type="label" style={{  }} />
          </View>
        </TouchableHaptic>
        <Divider vertical />
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
    gap: 24,
  },
  tagRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  nodeWrapper: {
    gap: 4,
  },
  node: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    paddingTop: 6,
    gap: 4,
  },
  nodeHeader: {
    gap: 4,
  },
  nodeConnector: {
    position: 'absolute',
    left: '50%',
    marginVertical: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

