import React from "react";
import { View } from "react-native";
import { t } from "i18next";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { shadeColor } from "@codemize/helpers/Colors";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { WORKFLOW_TRIGGER_ITEMS } from "@/constants/Models";

import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import TextBase from "@/components/typography/Text";
import ListDropdown from "@/components/lists/ListDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.43
 * @version 0.0.1
 * @type */
export type TouchableHapticTriggerProps = {
  refContainer: React.RefObject<View|null>;
  onPress: (item: ListItemDropdownProps) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.43
 * @version 0.0.1
 * @param {TouchableHapticTriggerProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @component */
const TouchableHapticTrigger = ({
  refContainer,
  onPress,
}: TouchableHapticTriggerProps) => {
  const refTrigger = React.useRef<View>(null);
  const { secondaryBgColor, tertiaryBgColor, infoColor } = useThemeColors();

  const [selected, setSelected] = React.useState<ListItemDropdownProps>(WORKFLOW_TRIGGER_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps);

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
        title={t("i18n.screens.workflow.builder.trigger")} 
        items={WORKFLOW_TRIGGER_ITEMS}
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
        text={t("i18n.screens.workflow.builder.trigger")} 
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

export default TouchableHapticTrigger;