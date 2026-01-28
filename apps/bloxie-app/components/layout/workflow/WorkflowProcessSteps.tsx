import React from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faMicrochip,
  faObjectExclude,
  faSignsPost,
} from '@fortawesome/duotone-thin-svg-icons';
import GlobalContainerStyle from '@/styles/GlobalContainer';
import { shadeColor } from '@codemize/helpers/Colors';
import { useThemeColors } from '@/hooks/theme/useThemeColor';
import { FAMILIY, SIZES } from '@codemize/constants/Fonts';
import TouchableHaptic from '@/components/button/TouchableHaptic';
import TextBase from '@/components/typography/Text';
import Divider from '@/components/container/Divider';
import { STYLES } from '@codemize/constants/Styles';
import GlobalWorkflowStyle from '@/styles/GlobalWorkflow';
import TouchableTag from '@/components/button/TouchableTag';
import { ConvexTemplateAPIProps, ConvexWorkflowActionAPIProps, ConvexWorkflowDecisionAPIProps, ConvexWorkflowQueryAPIProps } from '@codemize/backend/Types';
import TouchableHapticCancellationTerms from '@/components/button/workflow/TouchableHapticCancellationTerms';
import { useTrays } from 'react-native-trays';
import { WorkflowCanvasProps } from '@/components/layout/workflow/WorkflowCanvas';
import WorkflowProcessStepsItem from './WorkflowProcessStepsItem';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

export type WorkflowProcessStepsProps = WorkflowCanvasProps;

const WorkflowProcessSteps = ({ 
  workflow,
  onAddNodeItem,
  onRemoveItem,
  onReorderItems
}: WorkflowProcessStepsProps) => {

  const { infoColor, secondaryBgColor, primaryBorderColor } = useThemeColors();

  const refStartNode = React.useRef<View>(null);
  const processItems = React.useMemo(() => workflow?.process?.items ?? [], [workflow]);
  const [items, setItems] = React.useState(processItems);

  React.useEffect(() => {
    console.log("processItems", processItems);
    setItems(processItems);
  }, [processItems]);

  const { push, dismiss } = useTrays('main');

  const onPressAction = React.useCallback(() => {
      push('TrayWorkflowTemplate', {
        onPress: (template: ConvexTemplateAPIProps) => {
          onAddNodeItem?.(workflow as ConvexWorkflowQueryAPIProps, "action", template);
          dismiss('TrayWorkflowTemplate');
        },
      });
    }, [push]);

  const onPressDecision = React.useCallback(() => {
    push('TrayWorkflowDecision', {
      onPress: (template: ConvexTemplateAPIProps) => {
        onAddNodeItem?.(workflow as ConvexWorkflowQueryAPIProps, "decision", template);
        dismiss('TrayWorkflowDecision');
      },
    });
  }, [push]);

  const renderItem = React.useCallback(({ item, drag }: RenderItemParams<(
    ConvexWorkflowActionAPIProps & { nodeType: "action" }) | 
    (ConvexWorkflowDecisionAPIProps & { nodeType: "decision" })>) => 
      <WorkflowProcessStepsItem
        key={item._id}
        item={item}
        onPressDrag={drag}
        onPressAction={(isActive: boolean) => { console.log("isActive", isActive); }}
        onRemoveItem={onRemoveItem} />, [, onRemoveItem]);
  
  return (
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
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 18 }]}>
                <TouchableHaptic onPress={onPressAction}>
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 6 }]}>
                    <FontAwesomeIcon
                      icon={faObjectExclude as IconProp}
                      size={STYLES.sizeFaIcon + 2} />
                    <TextBase text="Aktion" type="label" style={{ color: infoColor }} />
                  </View>
                </TouchableHaptic>
                <TouchableHaptic onPress={onPressDecision}>
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 6 }]}>
                    <FontAwesomeIcon
                      icon={faSignsPost as IconProp}
                      size={STYLES.sizeFaIcon + 2} />
                    <TextBase text="Entscheid" type="label" style={{ color: infoColor }} />
                  </View>
                </TouchableHaptic>
              </View>
            </View>
          </View>
          <View style={{ alignSelf: 'stretch' }}>  
            <View style={{ gap: 6 }}>
              <TouchableHapticCancellationTerms onPress={() => {}} />
              <Divider style={{ borderColor:shadeColor(primaryBorderColor, 0.7), borderWidth: 0.5 }} />
              {processItems.length > 0 && <DraggableFlatList
                data={items}
                keyExtractor={(item) => item._id as string}
                style={{ flexGrow: 0 }}
                scrollEnabled={false}
                nestedScrollEnabled={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                onDragEnd={({ data }) => {
                  setItems(data);
                  onReorderItems?.(data);
                }}
              />}
              {(processItems.length === 0) && (
                <View       
                  style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
                    backgroundColor: shadeColor(secondaryBgColor, 0.3),
                  }]}>
                    <TextBase
                      text="Noch keine Schritte hinzugefügt."
                      type="label"
                      style={{ color: '#626D7B', alignSelf: 'center', fontSize: 11 }} />
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
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

export default WorkflowProcessSteps;

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
  nodeHeaderActions: {
    gap: 14,
    marginLeft: 12,
  },
  connectionLayer: {
    zIndex: -1,
  },
});

