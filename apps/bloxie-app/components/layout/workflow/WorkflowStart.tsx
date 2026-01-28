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

export type WorkflowStartProps = {
  workflow: ConvexWorkflowQueryAPIProps|undefined;
};

const WorkflowStart = ({
  workflow,
}: WorkflowStartProps) => {
  const refStartNode = React.useRef<View>(null);
  const [workflowName, setWorkflowName] = React.useState(workflow?.name ?? "");

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
    <View style={[
      styles.nodeWrapper,
      { maxWidth: Dimensions.get('window').width - 28 },
    ]}>
      <View style={styles.tagRow}>
        <TouchableTag
          icon={faBolt as IconProp}
          text={"Start"}
          type="label"
          isActive={true}
          disabled={true}
          colorActive={shadeColor(("#3F37A0"), 0)}
          viewStyle={{ paddingVertical: 3 }} />
        <View style={[styles.node, { }]} pointerEvents="box-none" ref={refStartNode}>
            <View style={[GlobalContainerStyle.rowCenterStart, styles.nodeHeaderRow]}>
              <FontAwesomeIcon icon={faBrightnessLow as IconProp} size={16} color={"#626D7B"} />
              <TextInput
                value={workflowName}
                onChangeText={setWorkflowName}
                placeholder="Name des Workflows"
                style={styles.workflowNameInput}/>
            </View>
          <View style={{ gap: 4, alignSelf: 'stretch' }}>  
          <TouchableHapticTrigger
            refContainer={refStartNode}
            workflow={workflow}
            onPress={() => {}} />
          <TouchableHapticTimePeriod
            refContainer={refStartNode}
            workflow={workflow}
            onPress={() => {}}/>
          <TouchableHapticActivityStatus
            refContainer={refStartNode}
            workflow={workflow}
            onPress={() => {}}/>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WorkflowStart;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
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


