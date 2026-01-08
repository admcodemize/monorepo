import React from "react";
import { View } from "react-native";
import { t } from "i18next";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { shadeColor } from "@codemize/helpers/Colors";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { WORKFLOW_CONFIRMATION_ITEMS, WORKFLOW_NODE_ACTION_ITEMS } from "@/constants/Models";

import ListItemDropdown, { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import TextBase from "@/components/typography/Text";
import ListDropdown, { DEFAULT_WIDTH } from "@/components/lists/ListDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import ListItemGroup from "@/components/container/ListItemGroup";
import { STYLES } from "@codemize/constants/Styles";
import ListDropdownStyle from "@/styles/components/lists/ListDropdown";
import TouchableHaptic from "../TouchableHaptic";
import { KEYS } from "@/constants/Keys";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsisStroke } from "@fortawesome/pro-solid-svg-icons";
import TouchableHapticSwitch from "../TouchableHapticSwitch";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.44
 * @version 0.0.1
 * @type */
export type TouchableHapticActionProps = {
  refContainer: React.RefObject<View|null>;
  onPress: (item: ListItemDropdownProps) => void;
  onPressExecutionStatus: (state: boolean) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.44
 * @version 0.0.1
 * @param {TouchableHapticConfirmationProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @component */
const TouchableHapticAction = ({
  refContainer,
  onPress,
  onPressExecutionStatus,
}: TouchableHapticActionProps) => {
  const refAction = React.useRef<View>(null);
  const { infoColor, primaryBgColor } = useThemeColors();

  const [isActive, setIsActive] = React.useState<boolean>(true);

  /**
   * @description Get the dropdown functions for displaying the available triggers.
   * @see {@link hooks/button/useDropdown} */
  const { state: { open, close }, open: _open } = useDropdown();

  /**
   * @description Handles the press event of the dropdown item
   * @param {ListItemDropdownProps} item - The item to press
   * @function */
  const onPressInternal = 
  (item: ListItemDropdownProps) => () => {
    onPress(item);
    close();
  }

  /**
   * @description Handles the press event of the execution status item
   * -> Update the execution status of the action node in the workflow canvas
   * @function */
  React.useEffect(() => onPressExecutionStatus?.(isActive), [isActive]);

  /**
   * @description Returns the children (dropdown items)for the dropdown component
   * @function */
  const children = () => {
    return (
      <View style={[ListDropdownStyle.view, { 
        width: DEFAULT_WIDTH + 10, 
        backgroundColor: primaryBgColor,
        gap: 4
      }]}>
        <ListItemGroup
          title={"i18n."}
          gap={STYLES.sizeGap * 1.75}
          style={{ padding: 6 }} />
        {WORKFLOW_NODE_ACTION_ITEMS.map((item, index) => 
          <TouchableHaptic
            key={`${KEYS.listDropdownItem}-${item.itemKey}`}
            onPress={onPressInternal(item)}>
            <ListItemDropdown
              {...item}
              isSelected={item.isSelected}
              right={
                item.itemKey === "executionStatus" && <TouchableHapticSwitch
                  state={isActive}
                  onStateChange={setIsActive}/>} />
          </TouchableHaptic>
        )}
      </View>
    );
  }

  /**
   * @description Used to open the dropdown component
   * @function */
  const onPressDropdown = () => {
    /** 
     * @description Open the dropdown component based on a calculated measurement template
     * @see {@link components/button/TouchableDropdown} */
    _open({
      refTouchable: refAction,
      relativeToRef: refContainer,
      paddingHorizontal: 12 - 2, 
      open,
      additionalRight: 28,
      children: children(),
    });
  }

  return (
    <TouchableHaptic
      ref={refAction}
      onPress={onPressDropdown}>
        <FontAwesomeIcon icon={faEllipsisStroke as IconProp} size={16} color={infoColor} />
    </TouchableHaptic>
  );
};

export default TouchableHapticAction;