import React from "react";
import { ConvexWorkflowActionAPIProps } from "@codemize/backend/Types";
import Animated, { FadeInDown } from "react-native-reanimated";
import { TextInput, View } from "react-native";
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

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.49
 * @version 0.0.1
 * @type */
export type WorkflowActionProps = {
  action: ConvexWorkflowActionAPIProps;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.49
 * @version 0.0.1
 * @param {WorkflowActionProps} param0
 * @param {ConvexWorkflowActionAPIProps} param0.action
 * @component */
const WorkflowAction = ({ 
  action 
}: WorkflowActionProps) => {
  const { infoColor, secondaryBgColor, successColor, errorColor } = useThemeColors();
  return (
    <Animated.View
      entering={FadeInDown.duration(160)}
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: shadeColor(secondaryBgColor, 0.3)
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 8 }]}>
        <FontAwesomeIcon 
          icon={faSquare as IconProp} 
          size={12} 
          color={infoColor} />
        {/*<FontAwesomeIcon icon={resolvedIcon} size={16} color={infoColor} />*/}
        <TextInput
          value={action.name}
          placeholder="Name der Aktion"
          style={{
            color: infoColor,
            maxWidth: 180,
            fontSize: Number(SIZES.label),
            fontFamily: String(FAMILIY.subtitle),
          }}
          onChangeText={() => {}}/>
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 14 }]}>
        <TouchableHaptic onPress={() => {}}>
          <View style={[GlobalContainerStyle.rowCenterCenter]}>
            <TextBase 
              text={'Bearbeiten'} 
              type="label" />
          </View>
        </TouchableHaptic>
        <Divider vertical />
        <View style={GlobalWorkflowStyle.right}>
        <TouchableHapticIcon
          icon={(action.activityStatus ? faPlay : faPause) as IconProp}
          iconSize={12}
          iconColor={action.activityStatus ? successColor : errorColor}
          hasViewCustomStyle={true}
          onPress={() => {}}/>
        <TouchableHapticIcon
          icon={faXmark as IconProp}
          iconSize={12}
          hasViewCustomStyle={true}
          onPress={(() => {})}/>
        </View>
      </View>
    </Animated.View>
  );
};

export default WorkflowAction;

/**
 *   const [name, setName] = React.useState<string>(item.name);

  const { push, dismiss } = useTrays('keyboard');

  /*const resolvedIcon = React.useMemo(
    () => resolveRuntimeIcon(String(item?.icon || 'faCodeCommit')) as IconProp,
    [item?.icon],
  );*

  React.useEffect(() => {
    setIsActive(item.activityStatus ?? true);
  }, [item.activityStatus]);

  React.useEffect(() => {
    setName(item.name);
  }, [item.name]);

  const handleEdit = React.useCallback(() => {
    push('TrayWorkflowAction', {
      item,
      onAfterSave: (updated: ConvexWorkflowActionAPIProps) => {
        onChangeNodeItem?.(updated);
        setName(updated.name);
        setIsActive(updated.activityStatus ?? true);
        dismiss('TrayWorkflowAction');
      },
      onPressClose: () => {
        dismiss('TrayWorkflowAction');
      },
    });
  }, [push, dismiss, item, onChangeNodeItem]);

  const handleNameChange = React.useCallback(
    (text: string) => {
      setName(text);
      onChangeNodeItem?.({
        ...item,
        name: text,
      });
    },
    [item, onChangeNodeItem],
  );

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
 */