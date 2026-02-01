import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {faBrightnessLow, faStopwatch } from '@fortawesome/duotone-thin-svg-icons';

import { ConvexWorkflowAPIConfirmationEnum, ConvexWorkflowQueryAPIProps } from '@codemize/backend/Types';
import { useThemeColors } from '@/hooks/theme/useThemeColor';

import TouchableTag from '@/components/button/TouchableTag';
import TouchableHapticConfirmation from '@/components/button/workflow/TouchableHapticConfirmation';
import { ListItemDropdownProps } from '@/components/lists/item/ListItemDropdown';

import GlobalWorkflowStyle, { MAX_WIDTH } from '@/styles/GlobalWorkflow';
import GlobalContainerStyle from '@/styles/GlobalContainer';

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.2
 * @type */
export type WorkflowEndProps = {
  workflow: ConvexWorkflowQueryAPIProps;
  getWorkflow?: () => ConvexWorkflowQueryAPIProps;
  onChange?: (workflow: ConvexWorkflowQueryAPIProps) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.52
 * @version 0.0.2
 * @param {WorkflowEndProps} param0 
 * @param {ConvexWorkflowQueryAPIProps} param0.workflow - The selected workflow object
 * @param {Function} param0.getWorkflow - Callback function to get the current workflow from the central ref in component @see {@link WorkflowCanvas}
 * @param {Function} param0.onChange - Callback function when user changes the confirmation button
 * @component */
export function WorkflowEnd({
  workflow,
  getWorkflow,
  onChange,
}: WorkflowEndProps) {
  const { workflowEndBgColor, secondaryIconColor } = useThemeColors();
  const { t } = useTranslation();
  const refEnd = React.useRef<View>(null);

  /**
   * @description Callback when user changes the confirmation button.
   * Uses getWorkflow() so the update is always applied on top of the latest workflow (central ref). */
  const onPress =
  (item: ListItemDropdownProps) => {
    const _workflow = getWorkflow?.() ?? workflow;
    onChange?.({
      ..._workflow,
      end: {
        ..._workflow.end,
        confirmation: item.itemKey as ConvexWorkflowAPIConfirmationEnum,
      },
    });
  };
  
  return (
    <View style={[{ maxWidth: MAX_WIDTH }]}>
      <View style={[GlobalWorkflowStyle.node]}>
        <TouchableTag
          icon={faStopwatch as IconProp}
          text={t("i18n.screens.workflow.builder.end")}
          type="label"
          isActive={true}
          disabled={true}
          colorActive={workflowEndBgColor}
          viewStyle={GlobalWorkflowStyle.viewTag} />
        <View 
          ref={refEnd}
          style={[GlobalWorkflowStyle.nodeContent]}>
          <View style={[GlobalContainerStyle.rowCenterStart, GlobalWorkflowStyle.nodeHeader]}>
            <FontAwesomeIcon 
              icon={faBrightnessLow as IconProp} 
              size={16} 
              color={secondaryIconColor} />
            <TextInput
              editable={false}
              value={t("i18n.screens.workflow.builder.completion")}
              onChangeText={() => {}}
              placeholder="Name des Workflows"
              style={GlobalWorkflowStyle.input}/>
          </View>
          <View style={{ gap: 4 }}>  
            <TouchableHapticConfirmation
              refContainer={refEnd}
              onPress={onPress}/>
          </View>
        </View>
      </View>
    </View>
  );
}

