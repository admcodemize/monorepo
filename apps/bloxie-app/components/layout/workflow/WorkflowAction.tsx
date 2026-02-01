import React from "react";
import { ConvexWorkflowActionAPIProps } from "@codemize/backend/Types";
import Animated, { FadeInDown } from "react-native-reanimated";
import { GestureResponderEvent, TextInput, View } from "react-native";
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
import { faObjectExclude, faPause, faPlay, faTrashSlash, faXmark } from "@fortawesome/duotone-thin-svg-icons";
import { shadeColor } from "@codemize/helpers/Colors";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import { useTrays } from "react-native-trays";
import { faBars, faFilePen } from "@fortawesome/duotone-thin-svg-icons";
import ViewBase from "@/components/container/View";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.49
 * @version 0.0.2
 * @type */
export type WorkflowActionProps = {
  action: ConvexWorkflowActionAPIProps;
  onPressRemove: (action: ConvexWorkflowActionAPIProps) => void;
  onPressActive: (isActive: boolean) => void;
  onPressDrag: (e: GestureResponderEvent) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.49
 * @version 0.0.2
 * @param {WorkflowActionProps} param0
 * @param {ConvexWorkflowActionAPIProps} param0.action - The workflow action
 * @param {(action: ConvexWorkflowActionAPIProps) => void} param0.onPressRemove - Callback function when the remove button is pressed
 * @param {(action: ConvexWorkflowActionAPIProps) => void} param0.onPressActive - Callback function when the active button is pressed
 * @param {(e: GestureResponderEvent) => void} param0.onPressDrag - Callback function when the drag button is pressed
 * @component */
const WorkflowAction = ({ 
  action,
  onPressRemove,
  onPressActive,
  onPressDrag
}: WorkflowActionProps) => {
  const { infoColor, secondaryBgColor, successColor, errorColor } = useThemeColors();
  const { push } = useTrays('keyboard');

  const [name, setName] = React.useState<string>(action.name);
  const [isActive, setIsActive] = React.useState<boolean>(action.activityStatus ?? true);
  React.useEffect(() => {
    onPressActive(isActive);
  }, [isActive, onPressActive]);

  /** 
   * @description Handles the press event of the edit button
   * -> Opens the tray for editing the action template */
  const onPressEdit = React.useCallback(() => {
    push('TrayWorkflowAction', {
      item: action,
      onAfterSave: (updated: ConvexWorkflowActionAPIProps) => {
        console.log("onAfterSave", updated);
      },
    });
  }, [push, action]);

  /** 
   * @description Handles the press event of the remove button
   * -> Calls the onPressRemove callback function and removes the action from the workflow canvas state array */
  const onPressRemoveInternal = React.useCallback(() => {
    onPressRemove(action);
  }, [onPressRemove, action]);
  
  return (
    <Animated.View
      entering={FadeInDown.duration(160)}
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: shadeColor(secondaryBgColor, 0.3),
      }]}>
        <ViewBase
          schemeProperty="secondaryBg"
          style={[GlobalContainerStyle.rowCenterStart, { gap: 12 }]}>
          <TouchableHaptic onLongPress={onPressDrag}>
            <FontAwesomeIcon 
              icon={faBars as IconProp} 
              size={14} 
              color={infoColor} />
          </TouchableHaptic>
          <FontAwesomeIcon 
            icon={faObjectExclude as IconProp} 
            size={14} 
            color={infoColor} />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name der Aktion"
            style={[GlobalWorkflowStyle.input, { color: infoColor }]} />
      </ViewBase>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 14 }]}>
        <TouchableHaptic onPress={onPressEdit}>
          <FontAwesomeIcon 
            icon={faFilePen as IconProp} 
            size={14} 
            color={infoColor} />
        </TouchableHaptic>
        <Divider vertical />
        <View style={GlobalWorkflowStyle.right}>
          <TouchableHapticIcon
            icon={(isActive ? faPlay : faPause) as IconProp}
            iconSize={14}
            iconColor={isActive ? successColor : errorColor}
            hasViewCustomStyle={true}
            onPress={() => setIsActive(!isActive)}/>
          <TouchableHapticIcon 
            icon={faTrashSlash as IconProp} 
            iconSize={14} 
            iconColor={errorColor}
            hasViewCustomStyle={true} 
            onPress={onPressRemoveInternal} />
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