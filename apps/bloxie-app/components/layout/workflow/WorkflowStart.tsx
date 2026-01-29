import React from 'react';
import { TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBolt, faBrightnessLow } from '@fortawesome/duotone-thin-svg-icons';

import { useThemeColors } from '@/hooks/theme/useThemeColor';
import { shadeColor } from '@codemize/helpers/Colors';
import { ConvexWorkflowAPITimePeriodEnum, ConvexWorkflowAPITriggerEnum, ConvexWorkflowQueryAPIProps } from '@codemize/backend/Types';

import TouchableTag from '@/components/button/TouchableTag';
import TouchableHapticTrigger from '@/components/button/workflow/TouchableHapticTrigger';
import TouchableHapticTimePeriod from '@/components/button/workflow/TouchableHapticTimePeriod';
import TouchableHapticActivityStatus, { WorkflowActivityStatusEnum } from '@/components/button/workflow/TouchableHapticActivityStatus';
import { ListItemDropdownProps } from '@/components/lists/item/ListItemDropdown';

import GlobalWorkflowStyle, { MAX_WIDTH } from '@/styles/GlobalWorkflow';
import GlobalContainerStyle from '@/styles/GlobalContainer';
import { useDebounce } from '@codemize/hooks/useDebounce';

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.53
 * @version 0.0.1
 * @type */
export type WorkflowStartProps = {
  workflow: ConvexWorkflowQueryAPIProps;
  getWorkflow?: () => ConvexWorkflowQueryAPIProps;
  onChange?: (workflow: ConvexWorkflowQueryAPIProps) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.53
 * @version 0.0.1
 * @param {WorkflowStartProps} param0 
 * @param {ConvexWorkflowQueryAPIProps} param0.workflow - The selected workflow object
 * @param {Function} param0.getWorkflow - Callback function to get the current workflow from the central ref in component @see {@link WorkflowCanvas}
 * @param {Function} param0.onChange - Callback function when user pressed the trigger, time period or activity status button
 * @component */
const WorkflowStart = ({
  workflow,
  getWorkflow,
  onChange,
}: WorkflowStartProps) => {
  const { secondaryIconColor } = useThemeColors();
  const { t } = useTranslation();

  const refStart = React.useRef<View>(null);
  const [workflowName, setWorkflowName] = React.useState(workflow?.name ?? "");

  /**
   * @description Callback when user changes trigger, time period or activity status.
   * Uses getWorkflow() so the update is always applied on top of the latest workflow (central ref). */
  const onPress =
  (property: "trigger" | "timePeriod" | "activityStatus") =>
  (item: ListItemDropdownProps) => {
    const _workflow = getWorkflow?.() ?? workflow;
    onChange?.({
      ..._workflow,
      start: {
        ..._workflow.start,
        [property]: item.itemKey as ConvexWorkflowAPITriggerEnum|ConvexWorkflowAPITimePeriodEnum|WorkflowActivityStatusEnum,
      },
    });
  };

  /**
   * @description Callback when user changes the workflow name.
   * -> Uses getWorkflow() so the update is always applied on top of the latest workflow (central ref).
   * @param {string} text - The new workflow name
   * @function */
  const onChangeWorkflowName = 
  (text: string) => {
    setWorkflowName(text);
    onChange?.({
      ...(getWorkflow?.() ?? workflow),
      name: text,
    });
  };

  return (
    <View style={[{ maxWidth: MAX_WIDTH }]}>
      <View style={[GlobalWorkflowStyle.node]}>
        <TouchableTag
          icon={faBolt as IconProp}
          text={t("i18n.screens.workflow.builder.start")}
          type="label"
          isActive={true}
          disabled={true}
          colorActive={shadeColor(("#3F37A0"), 0)}
          viewStyle={{ paddingVertical: 3 }} />
        <View 
          ref={refStart}
          style={[GlobalWorkflowStyle.nodeContent]}>
            <View style={[GlobalContainerStyle.rowCenterStart, GlobalWorkflowStyle.nodeHeader]}>
              <FontAwesomeIcon 
                icon={faBrightnessLow as IconProp} 
                size={16} 
                color={secondaryIconColor} />
              <TextInput
                value={workflowName}
                onChangeText={onChangeWorkflowName}
                placeholder={t("i18n.screens.workflow.builder.workflowNamePlaceholder")}
                style={GlobalWorkflowStyle.input}/>
            </View>
          <View style={{ gap: 4, alignSelf: 'stretch' }}>  
          <TouchableHapticTrigger
            refContainer={refStart}
            workflow={workflow}
            onPress={onPress("trigger")} />
          <TouchableHapticTimePeriod
            refContainer={refStart}
            workflow={workflow}
            onPress={onPress("timePeriod")}/>
          <TouchableHapticActivityStatus
            refContainer={refStart}
            workflow={workflow}
            onPress={onPress("activityStatus")}/>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WorkflowStart;