import React from 'react';
import { LayoutChangeEvent, LayoutRectangle, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, Path } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAsterisk } from '@fortawesome/pro-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import GlobalContainerStyle from '@/styles/GlobalContainer';
import TextBase from '../typography/Text';
import { faAlarmClock, faBolt, faBoltSlash, faBrightnessLow, faEllipsis, faEllipsisStroke, faFileDashedLine, faFlagCheckered, faMessageSlash, faObjectIntersect, faPenNibSlash, faPlus, faRectangleHistoryCirclePlus, faStopwatch } from '@fortawesome/duotone-thin-svg-icons';
import { shadeColor } from '@codemize/helpers/Colors';
import { useThemeColors } from '@/hooks/theme/useThemeColor';
import TouchableHapticDropdown from '../button/TouchableHapticDropdown';
import { FAMILIY, SIZES } from '@codemize/constants/Fonts';
import TouchableHaptic from '../button/TouchableHaptic';
import TouchableTag from '../button/TouchableTag';

export type WorkflowNodeType = 'start' | 'action' | 'decision' | 'end';

export type WorkflowNode = {
  id: string;
  type: WorkflowNodeType;
  title?: string;
  subtitle?: string;
  icon?: IconProp;
  meta?: string;
};

const cubicAt = (t: number, p0: number, p1: number, p2: number, p3: number) =>
  Math.pow(1 - t, 3) * p0 +
  3 * Math.pow(1 - t, 2) * t * p1 +
  3 * (1 - t) * Math.pow(t, 2) * p2 +
  Math.pow(t, 3) * p3;

type WorkflowCanvasProps = {
  nodes?: WorkflowNode[];
  onNodePress?: (node: WorkflowNode) => void;
  onAddNode?: (afterId: string | null) => void;
  renderNode?: (node: WorkflowNode) => React.ReactNode;
  gesturesEnabled?: boolean;
  children?: React.ReactNode;
};

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

export function WorkflowCanvas({
  nodes,
  onNodePress,
  onAddNode,
  renderNode,
  gesturesEnabled = false,
  children,
}: WorkflowCanvasProps) {
  const { secondaryBgColor } = useThemeColors();

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .enabled(gesturesEnabled)
    .onUpdate(e => {
      translateX.value += e.translationX;
      translateY.value += e.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(gesturesEnabled)
    .onUpdate(e => {
      scale.value = Math.min(Math.max(e.scale, 0.5), 3);
    });

  const gesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const [nodeLayouts, setNodeLayouts] = React.useState<Record<string, LayoutRectangle>>({});



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
        </Svg>

        <Animated.View style={[styles.content, animatedStyle, { gap: 24}]}>
          {nodes
            ? nodes.map((node, index) => (
                <React.Fragment key={node.id}>
                  <WorkflowNode node={node} isLastInChain={index === nodes.length - 1} />
                  {index < nodes.length - 1 ? (
                    /*<WorkflowConnection fromType={node.type} />*/
                    null
                  ) : null}
                </React.Fragment>
              ))
            : children}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const WorkflowNode = ({ node, isLastInChain }: { node: WorkflowNode, isLastInChain: boolean }) => {
  const [workflowTitle, setWorkflowTitle] = React.useState<string>(node.title || "");

  return (
    <>
    <View style={{ position: 'relative', width: '90%', minWidth: 240, gap: 4 }}>
      
      <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
      <TouchableTag
        icon={node.type === "start" ? faBolt as IconProp : node.type === "action" ? faObjectIntersect as IconProp : node.type === "decision" ? faFlagCheckered as IconProp : faStopwatch as IconProp}
        text={node.type === "start" ? "Start" : node.type === "action" ? "Aktionen" : node.type === "decision" ? "Entscheidungen" : "Ende"}
        type="label"
        backgroundColor={shadeColor(node.type === "start" ? '#3F37A0' : node.type === "action" ? '#587E1F' : node.type === "decision" ? '#0783A1' : '#3F37A0', 0)}
        colorInactive={shadeColor(node.type === "start" ? '#3F37A0' : node.type === "action" ? '#587E1F' : node.type === "decision" ? '#0783A1' : '#3F37A0', 0.3)}
        isActive={false}/>
      </View>


      <View style={styles.node}>
        {node.type !== "start" && <WorkflowNodeConnector node={node} position="top" />}
        <View style={[GlobalContainerStyle.rowCenterBetween, { paddingHorizontal: 4 }]}>
          <View style={[GlobalContainerStyle.rowCenterStart, styles.nodeHeader]}>
            <FontAwesomeIcon icon={node.icon as IconProp} size={16} color={typeAccent[node.type]} />
            <TextInput 
            editable={node.type === "start"}
            value={workflowTitle} onChangeText={setWorkflowTitle} style={{ color: typeAccent[node.type], fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
            placeholder="Name des Workflows" />
          </View>
          <View style={[GlobalContainerStyle.rowCenterStart, { gap: 14 }]}>
            {(node.type === "action" || node.type === "decision") && <FontAwesomeIcon icon={faRectangleHistoryCirclePlus as IconProp} size={16} color={"#047dd4"} />}
            <FontAwesomeIcon icon={faEllipsisStroke as IconProp} size={16} color={typeAccent[node.type]} />
          </View>
        </View>
        {node.type === "start" && <WorkflowNodeEventType node={node} />}
        {node.type === "start" && <WorkflowNodeTrigger node={node} />}
        {node.type === "action" && <WorkflowNodeAction node={node} />}
        {node.type === "decision" && <WorkflowNodeDecision node={node} />}
        {node.type !== "end" && !isLastInChain && <WorkflowNodeConnector node={node} position="bottom" />}
      </View>
    </View>
    </>
  );
};

const WorkflowNodeConnector = ({ node, position }: { node: WorkflowNode, position: 'top' | 'bottom' }) => {
  return (
    <View style={[styles.nodeConnector, { borderColor: "#000", borderWidth: 2, backgroundColor: '#fff', [position]: 0 }]}>

    </View>
  );
};

const WorkflowNodeEventType = ({ node }: { node: WorkflowNode }) => {
  const { secondaryBgColor, tertiaryBgColor } = useThemeColors();
  return (
    <View style={[GlobalContainerStyle.rowCenterBetween, { gap: 4, backgroundColor: shadeColor(secondaryBgColor, 0.3), height: 28, paddingHorizontal: 10, borderRadius: 8 }]}>
      <TextBase text={`Termintypen`} type="label" style={{ color: typeAccent[node.type]}} />
      <TouchableHapticDropdown
          icon={faBoltSlash as IconProp}
          text={``}
          backgroundColor={tertiaryBgColor}
          hasViewCustomStyle={true}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4}} />
      </View>
  );
};

const WorkflowNodeTrigger = ({ node }: { node: WorkflowNode }) => {
  const { secondaryBgColor, tertiaryBgColor } = useThemeColors();
  return (
    <View style={[GlobalContainerStyle.rowCenterBetween, { gap: 4, backgroundColor: shadeColor(secondaryBgColor, 0.3), height: 28, paddingHorizontal: 10, borderRadius: 8 }]}>
      <TextBase text={`Auslöser`} type="label" style={{ color: typeAccent[node.type]}} />
      <TouchableHapticDropdown
          icon={faAlarmClock as IconProp}
          text={`24h vor Ereignisbeginn`}
          backgroundColor={tertiaryBgColor}
          hasViewCustomStyle={true}
          textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4}} />
      </View>
  );
};

const WorkflowNodeAction = ({ node }: { node: WorkflowNode }) => {
  const { secondaryBgColor, tertiaryBgColor } = useThemeColors();
  return (
    <View style={[GlobalContainerStyle.rowCenterBetween, { gap: 4, backgroundColor: shadeColor(secondaryBgColor, 0.3), height: 28, paddingHorizontal: 10, borderRadius: 8 }]}>
      <TextBase text={`E-Mail an Eingeladene senden`} type="label" style={{ color: typeAccent[node.type]}} />
      <TouchableHaptic>
        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
          <FontAwesomeIcon icon={faPenNibSlash as IconProp} size={16} color={typeAccent[node.type]} />
          <TextBase text={`Bearbeiten`} type="label" style={{ color: typeAccent[node.type]}} />
        </View>
      </TouchableHaptic>
      </View>
  );
};

const WorkflowNodeDecision = ({ node }: { node: WorkflowNode }) => {
  const { secondaryBgColor, tertiaryBgColor } = useThemeColors();
  return (
    <View style={[GlobalContainerStyle.rowCenterBetween, { gap: 4, backgroundColor: shadeColor(secondaryBgColor, 0.3), height: 28, paddingHorizontal: 10, borderRadius: 8 }]}>
      <TouchableHapticDropdown
          icon={faMessageSlash as IconProp}
          text={`Nachricht enthält ...`}
          backgroundColor={tertiaryBgColor}
          hasViewCustomStyle={true}
          textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4}} />
    </View>
  );
};


const CONNECTOR_SIZE = 8;
const CONNECTOR_BORDER_WIDTH = 1;
const CONNECTION_HEIGHT = 48;
const BASE_CP1 = 45;
const BASE_CP2 = 55;

const startOffsetPercent =
  ((CONNECTOR_SIZE / 2 + CONNECTOR_BORDER_WIDTH / 2) / CONNECTION_HEIGHT) * 100 - 1;

const WorkflowConnection = ({ fromType }: { fromType: WorkflowNodeType }) => {
  const color = "#000000";
  const scaleY = (100 - startOffsetPercent) / 100;
  const startY = startOffsetPercent;
  const cp1Y = startY + BASE_CP1 * scaleY;
  const cp2Y = startY + BASE_CP2 * scaleY;
  const path = `M50 ${startY.toFixed(3)} C 50 ${cp1Y.toFixed(3)}, 47 ${cp2Y.toFixed(
    3
  )}, 50 100`;

  return (
    <View style={styles.connectionWrapper} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 100 105" preserveAspectRatio="none">
        <Path d={path} stroke={color} strokeWidth={0.4} strokeLinecap="square" strokeLinejoin="bevel" fill="none" />
      </Svg>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
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
    left: "50%",
    marginVertical: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionWrapper: {
    width: '90%',
    height: CONNECTION_HEIGHT,
    justifyContent: 'center',
  },
});
