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
import GlobalWorkflowStyle, { MAX_WIDTH } from '@/styles/GlobalWorkflow';
import TouchableTag from '@/components/button/TouchableTag';
import { ConvexRuntimeAPIWorkflowDecisionProps, ConvexTemplateAPIProps, ConvexWorkflowActionAPIProps, ConvexWorkflowDecisionAPIProps, ConvexWorkflowQueryAPIProps } from '@codemize/backend/Types';
import { Id } from '../../../../../packages/backend/convex/_generated/dataModel';
import TouchableHapticCancellationTerms from '@/components/button/workflow/TouchableHapticCancellationTerms';
import { useTrays } from 'react-native-trays';
import { WorkflowCanvasProps } from '@/components/layout/workflow/WorkflowCanvas';
import WorkflowProcessStepsItem from './WorkflowProcessStepsItem';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

export type WorkflowProcessStepsProps = WorkflowCanvasProps;

const WorkflowProcessSteps = ({ 
  workflow,
  onAddAction,
  onAddDecision,

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
          const action: ConvexWorkflowActionAPIProps = {
            workflowId: (workflow?._id ?? undefined) as Id<"workflow">,
            name: template.name ?? "Neue Aktion",
            subject: template.subject ?? "",
            content: template.content ?? "",
            activityStatus: true,
          };
          onAddAction(action);
          dismiss('TrayWorkflowTemplate');
        },
      });
    }, [push, workflow, onAddAction, dismiss]);

  const onPressDecision = React.useCallback(() => {
    push('TrayWorkflowDecision', {
      onPress: (decision: ConvexRuntimeAPIWorkflowDecisionProps) => {
        onAddDecision(decision);
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
        onPressActive={(isActive: boolean) => { console.log("isActive", isActive); }}
        onRemoveItem={onRemoveItem} />, [onRemoveItem]);
  
  return (
    <View style={[{ maxWidth: MAX_WIDTH }]}>
      <View style={[GlobalWorkflowStyle.node]}>
        <TouchableTag
          icon={faMicrochip as IconProp}
          text={"Prozess"}
          type="label"
          isActive={true}
          disabled={true}
          colorActive={infoColor}
          viewStyle={GlobalWorkflowStyle.viewTag} />
        <View 
          ref={refStartNode}
          style={[GlobalWorkflowStyle.nodeContent]}>
          <View style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.nodeHeader, { gap: 32 }]}>
            <View style={[GlobalContainerStyle.rowCenterStart, { gap: 10 }]}>
              <FontAwesomeIcon icon={faMicrochip as IconProp} size={16} color={infoColor} />
              <TextInput
                editable={false}
                value={"Prozessschritte"}
                onChangeText={() => {}}
                style={{
                  color: infoColor,
                  fontSize: Number(SIZES.label),
                  fontFamily: String(FAMILIY.subtitle),
                  flexGrow: 0,
                }}/>
            </View>

            <View style={[GlobalContainerStyle.rowCenterEnd, styles.nodeHeaderActions]}>
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 12 }]}>
                <TouchableHaptic onPress={onPressAction}>
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 6 }]}>
                    <FontAwesomeIcon
                      icon={faObjectExclude as IconProp}
                      size={STYLES.sizeFaIcon + 2} />
                    <TextBase text="Aktion" type="label" style={{ color: infoColor }} />
                  </View>
                </TouchableHaptic>
                <Divider vertical />
                <TouchableHaptic onPress={onPressDecision}>
                  <View style={[GlobalContainerStyle.rowCenterStart, { gap: 6 }]}>
                    <FontAwesomeIcon
                      icon={faSignsPost as IconProp}
                      size={STYLES.sizeFaIcon + 2} />
                    <TextBase text="Entscheidung" type="label" style={{ color: infoColor }} />
                  </View>
                </TouchableHaptic>
              </View>
            </View>
          </View>
          <View style={{ alignSelf: 'stretch' }}>
            <View style={{ gap: 6, paddingBottom: 4 }}>
              <TouchableHapticCancellationTerms onPress={() => {}} />
              <Divider style={{ borderColor:shadeColor(primaryBorderColor, 0.7), borderWidth: 0.5 }} />
            </View>
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
            {(processItems.length === 0) && <View style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
              backgroundColor: shadeColor(secondaryBgColor, 0.3),
            }]}>
              <TextBase
                text="Noch keine Schritte hinzugefügt."
                type="label" />
            </View>}
          </View>
        </View>
      </View>
    </View>

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

