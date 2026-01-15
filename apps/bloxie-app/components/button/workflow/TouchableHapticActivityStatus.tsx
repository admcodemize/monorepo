import React from "react";
import { View } from "react-native";
import { t } from "i18next";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { shadeColor } from "@codemize/helpers/Colors";
import { ConvexWorkflowQueryAPIProps } from "@codemize/backend/Types";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { WORKFLOW_ACTIVITY_STATUS_ITEMS } from "@/constants/Models";

import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import TextBase from "@/components/typography/Text";
import ListDropdown from "@/components/lists/ListDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.48
 * @version 0.0.1
 * @enum */
export enum WorkflowActivityStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.47
 * @version 0.0.1
 * @type */
export type TouchableHapticActivityStatusProps = {
  refContainer: React.RefObject<View|null>;
  workflow: ConvexWorkflowQueryAPIProps|undefined;
  onPress: (item: ListItemDropdownProps) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.47
 * @version 0.0.1
 * @param {TouchableHapticActivityStatusProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {ConvexWorkflowQueryAPIProps|undefined} param0.workflow - The selected workflow object
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @component */
const TouchableHapticActivityStatus = ({
  refContainer,
  workflow,
  onPress,
}: TouchableHapticActivityStatusProps) => {
  const refTrigger = React.useRef<View>(null);
  const { secondaryBgColor, tertiaryBgColor, infoColor } = useThemeColors();

  const [selected, setSelected] = React.useState<ListItemDropdownProps>(WORKFLOW_ACTIVITY_STATUS_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps);
  React.useEffect(() => {
    /** @description Set the selected activity status based on the workflow start activity status if it is defined */
    setSelected(WORKFLOW_ACTIVITY_STATUS_ITEMS.find((item) => item.itemKey === (workflow?.start.activityStatus ? WorkflowActivityStatusEnum.ACTIVE : WorkflowActivityStatusEnum.INACTIVE)) as ListItemDropdownProps);
  }, [workflow?.start.activityStatus]);

  /**
   * @description Get the dropdown functions for displaying the available triggers.
   * @see {@link hooks/button/useDropdown} */
   const { state: { open, close }, open: _open } = useDropdown();

  /**
   * @description Returns the children (dropdown items as a scrollable list)for the dropdown component
   * @function */
  const children = () => {
    return (
      <ListDropdown
        title={t("i18n.screens.workflow.builder.activityStatus")} 
        items={WORKFLOW_ACTIVITY_STATUS_ITEMS}
        selectedItem={selected}
        onPressItem={(item) => {
          setSelected(item);
          onPress(item);
          close();
        }} />
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
      refTouchable: refTrigger,
      relativeToRef: refContainer,
      paddingHorizontal: 12 - 2, 
      open,
      children: children(),
    });
  }

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: shadeColor(secondaryBgColor, 0.3),
      }]}>
      <TextBase
        text={t("i18n.screens.workflow.builder.activityStatus")} 
        type="label" 
        style={{ color: infoColor }} />
      <TouchableHapticDropdown
        ref={refTrigger}
        icon={selected.icon as IconProp}
        text={selected.title}
        backgroundColor={tertiaryBgColor}
        hasViewCustomStyle
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
        onPress={onPressDropdown}/>
    </View>
  );
};

export default TouchableHapticActivityStatus;