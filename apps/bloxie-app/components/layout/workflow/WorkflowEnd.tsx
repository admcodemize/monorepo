import React from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faBrightnessLow,
  faStopwatch,
} from '@fortawesome/duotone-thin-svg-icons';
import GlobalContainerStyle from '@/styles/GlobalContainer';
import { shadeColor } from '@codemize/helpers/Colors';
import { FAMILIY, SIZES } from '@codemize/constants/Fonts';
import TouchableTag from '../../button/TouchableTag';
import { ConvexWorkflowQueryAPIProps } from '@codemize/backend/Types';
import TouchableHapticConfirmation from '../../button/workflow/TouchableHapticConfirmation';

export type WorkflowEndProps = {
  workflow?: ConvexWorkflowQueryAPIProps;
};

/**
 * High-level canvas that renders nodes, their connections and contextual UI for
 * building automated workflows.
 */
export function WorkflowEnd({
  workflow,
}: WorkflowEndProps) {
  const refEnd = React.useRef<View>(null);
  return (
    <View style={[
      styles.nodeWrapper,
      { maxWidth: Dimensions.get('window').width - 28 },
    ]}>
      <View style={styles.tagRow}>
        <TouchableTag
          icon={faStopwatch as IconProp}
          text={"Ende"}
          type="label"
          isActive={true}
          disabled={true}
          colorActive={shadeColor(("#3F37A0"), 0)}
          viewStyle={{ paddingVertical: 3 }} />
        <View style={[styles.node]} pointerEvents="box-none" ref={refEnd}>
          <View style={[GlobalContainerStyle.rowCenterStart, styles.nodeHeaderRow]}>

            <FontAwesomeIcon icon={faBrightnessLow as IconProp} size={16} color={"#626D7B"} />
            <TextInput
              editable={false}
              value={"Abschluss"}
              onChangeText={() => {}}
              placeholder="Name des Workflows"
              style={styles.workflowNameInput}/>
          </View>
          <View style={{ gap: 4}}>  
          <TouchableHapticConfirmation
            refContainer={refEnd}
            onPress={() => {}}/>
          </View>
        </View>
      </View>
    </View>
  );
}

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


