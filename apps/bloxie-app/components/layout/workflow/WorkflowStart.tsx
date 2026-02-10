import React from 'react';
import { TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBolt, faBrightnessLow } from '@fortawesome/duotone-thin-svg-icons';

import { useThemeColors } from '@/hooks/theme/useThemeColor';
import { ConvexWorkflowAPITimePeriodEnum, ConvexWorkflowAPITriggerEnum, ConvexWorkflowQueryAPIProps } from '@codemize/backend/Types';
import { STYLES } from '@codemize/constants/Styles';

import TouchableTag from '@/components/button/TouchableTag';
import TouchableHapticTrigger from '@/components/button/workflow/TouchableHapticTrigger';
import TouchableHapticTimePeriod from '@/components/button/TouchableHapticTimePeriod';
import TouchableHapticActivityStatus, { WorkflowActivityStatusEnum } from '@/components/button/workflow/TouchableHapticActivityStatus';
import { ListItemDropdownProps } from '@/components/lists/item/ListItemDropdown';

import GlobalWorkflowStyle, { MAX_WIDTH } from '@/styles/GlobalWorkflow';
import GlobalContainerStyle from '@/styles/GlobalContainer';
import { DROPDOWN_TIME_PERIOD_ITEMS } from '@/constants/Models';

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
 * @version 0.0.3
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
  const { secondaryIconColor, workflowStartBgColor } = useThemeColors();
  const { t } = useTranslation();

  const refStart = React.useRef<View>(null);
  const [workflowName, setWorkflowName] = React.useState(workflow?.name ?? "");
  const [selectedTimePeriod, setSelectedTimePeriod] = React.useState<ListItemDropdownProps>(DROPDOWN_TIME_PERIOD_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps);

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

  /**
   * @description Callback when user changes the time period value.
   * -> Uses getWorkflow() so the update is always applied on top of the latest workflow (central ref).
   * -> Based on input in component @see {@link TouchableHapticTimePeriod}
   * @param {string} text - The new time period value
   * @function */
  const onChangeTimePeriodValue = 
  (text: string) => {
    const _workflow = getWorkflow?.() ?? workflow;
    onChange?.({
      ..._workflow,
      start: {
        ..._workflow.start,
        timePeriodValue: parseInt(text),
      },
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
          colorActive={workflowStartBgColor}
          viewStyle={GlobalWorkflowStyle.viewTag} />
        <View 
          ref={refStart}
          style={[GlobalWorkflowStyle.nodeContent]}>
            <View style={[GlobalContainerStyle.rowCenterStart, GlobalWorkflowStyle.nodeHeader]}>
              <FontAwesomeIcon 
                icon={faBrightnessLow as IconProp} 
                size={STYLES.sizeFaIcon} 
                color={secondaryIconColor} />
              <TextInput
                value={workflowName}
                onChangeText={onChangeWorkflowName}
                placeholder={t("i18n.screens.workflow.builder.placeholderName")}
                style={GlobalWorkflowStyle.input}/>
            </View>
          <View style={{ gap: 4, alignSelf: 'stretch' }}>  
          <TouchableHapticTrigger
            refContainer={refStart}
            workflow={workflow}
            onPress={onPress("trigger")} />
          <TouchableHapticTimePeriod
            refContainer={refStart}
            selectedItem={selectedTimePeriod}
            onPress={onPress("timePeriod")}
            onChangeValue={onChangeTimePeriodValue}/>
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

/**
 * 
  const [selected, setSelected] = React.useState<ListItemDropdownProps>(WORKFLOW_TIME_PERIOD_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps);
  const [timePeriodValue, setTimePeriodValue] = React.useState<string>("24");

  React.useEffect(() => {
    /** @description Set the selected time period/value based on the workflow start time period if it is defined *
    if (workflow?.start.timePeriod) setSelected(WORKFLOW_TIME_PERIOD_ITEMS.find((item) => item.itemKey === workflow?.start.timePeriod) as ListItemDropdownProps);
  }, [workflow?.start.timePeriod]);
 */