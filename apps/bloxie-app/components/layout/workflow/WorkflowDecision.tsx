import React from "react";
import { ConvexWorkflowActionAPIProps } from "@codemize/backend/Types";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ScrollView, TextInput, View } from "react-native";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import { faSquare } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import TextBase from "@/components/typography/Text";
import Divider from "@/components/container/Divider";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";
import { faPause, faPlay, faXmark } from "@fortawesome/duotone-thin-svg-icons";
import { shadeColor } from "@codemize/helpers/Colors";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import { ConvexWorkflowDecisionAPIProps } from "@codemize/backend/Types";
import TouchableTag from "@/components/button/TouchableTag";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.49
 * @version 0.0.1
 * @type */
export type WorkflowDecisionProps = {
  decision: ConvexWorkflowDecisionAPIProps;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.49
 * @version 0.0.1
 * @param {WorkflowDecisionProps} param0
 * @param {ConvexWorkflowDecisionAPIProps} param0.decision
 * @component */
const WorkflowDecision = ({ 
  decision 
}: WorkflowDecisionProps) => {
  const { secondaryBgColor, errorColor, successColor, infoColor } = useThemeColors();
  return (
    <Animated.View
      entering={FadeInDown.duration(160)}
      style={[{
        backgroundColor: shadeColor(secondaryBgColor, 0.1),
        gap: 8,
        paddingVertical: 6,
        borderRadius: 8,
        justifyContent: 'center',
      }]}>
      <View style={[GlobalContainerStyle.rowCenterBetween, { paddingHorizontal: 10 }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 8 }]}>
          <FontAwesomeIcon 
            icon={faSquare as IconProp} 
            size={12} 
            color={"#e09100"} />
          {/*<FontAwesomeIcon icon={resolvedIcon} size={16} color={accentColor} />*/}
          <TextInput
            editable={false}
            value={decision.type === "eventType" ? "Ereignistypen" : "Kalender-Verbindungen"}
            placeholder="Name der Aktion"
            style={{
              color: infoColor,
              fontSize: Number(SIZES.label),
              fontFamily: String(FAMILIY.subtitle),
              maxWidth: 180,
            }}
            onChangeText={() => {}}
          />
        </View>
        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 14 }]}>
        <TouchableHaptic onPress={() => {}}>
            <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 4 }]}>
              <TextBase text="Auswählen" type="label" />
            </View>
          </TouchableHaptic>
          <Divider vertical />
          <View style={GlobalWorkflowStyle.right}>
            <TouchableHapticIcon
              icon={(decision.activityStatus ? faPlay : faPause) as IconProp}
              iconSize={12}
              iconColor={decision.activityStatus ? successColor : errorColor}
              hasViewCustomStyle={true}
              onPress={() => {}} />
            <TouchableHapticIcon icon={faXmark as IconProp} iconSize={12} hasViewCustomStyle={true} onPress={() => {}} />
          </View>
        </View>
      </View>
      
      <View style={{ marginHorizontal: 6, gap: 4 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 26 }} contentContainerStyle={{ gap: 4 }}>
            <WorkflowDecisionItem />
          </ScrollView>
        <TextInput
          //value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          placeholder="Benutzerspezifische Beschreibung der Entscheidung ..."
          style={{ fontSize: 10, color: shadeColor(infoColor, 0.1), marginLeft: 4 }}
          multiline={true}
          numberOfLines={4}
          cursorColor={infoColor}
          selectionColor={infoColor}
          onChangeText={() => {}}/>

      </View>
    </Animated.View>
  );
};

const WorkflowDecisionItem = ({

}) => {
  const { infoColor } = useThemeColors();
  return (
    <TouchableTag
    text="30-Min Besprechung"
    type="label"
    colorActive={shadeColor(infoColor, 0.2)}
    colorInactive={shadeColor(infoColor, 0.2)}
    viewStyle={{ paddingVertical: 6, borderRadius: 6, paddingHorizontal: 8 }}
    textStyle={{ fontSize: 10, color: infoColor }}
    showActivityIcon={true}
    activityIconActive={faXmark as IconProp}
    activityIconInactive={faXmark as IconProp}
    onPress={() => { console.log('30-Min Besprechung'); }}/>
  );
};

export default WorkflowDecision;

/**
 *   const { secondaryBgColor, errorColor, successColor, infoColor } = useThemeColors();
  const [isActive, setIsActive] = React.useState<boolean>(item.activityStatus ?? true);

  const { push, dismiss } = useTrays('main');
  const { t } = useTranslation();
  /*const resolvedIcon = React.useMemo(
    () => resolveRuntimeIcon(String(item.icon || 'faCodeCommit')) as IconProp,
    [item.icon],
  );*
  const accentColor = color ?? infoColor;

  React.useEffect(() => {
    setIsActive(item.activityStatus ?? true);
  }, [item.activityStatus]);

  const handleToggleActive = React.useCallback(() => {
    const next = !isActive;
    setIsActive(next);
    onChangeNodeItem?.({
      ...item,
      activityStatus: next,
    });
  }, [isActive, item, onChangeNodeItem]);

  const handleRemove = React.useCallback(() => {
    onRemoveNodeItem?.();
  }, [onRemoveNodeItem]);

  const onPress = React.useCallback(() => {
    console.log('onPress', item);
    push('TrayWorkflowEventType', {
      onPress: () => {
        dismiss('TrayWorkflowEventType');
      },
    });
  }, [push, dismiss]);
 */