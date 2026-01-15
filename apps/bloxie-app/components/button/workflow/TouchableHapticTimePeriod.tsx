import React from "react";
import { TextInput, View } from "react-native";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { shadeColor } from "@codemize/helpers/Colors";
import { ConvexWorkflowQueryAPIProps } from "@codemize/backend/Types";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { WORKFLOW_TIME_PERIOD_ITEMS } from "@/constants/Models";

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
export enum WorkflowTimePeriodEnum {
  WEEK = "week",
  DAY = "day",
  HOUR = "hour",
  MINUTE = "minute",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.43
 * @version 0.0.2
 * @type */
export type TouchableHapticTimePeriodProps = {
  refContainer: React.RefObject<View|null>;
  workflow: ConvexWorkflowQueryAPIProps|undefined;
  onPress: (item: ListItemDropdownProps) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.43
 * @version 0.0.1
 * @param {TouchableHapticTimePeriodProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {ConvexWorkflowQueryAPIProps|undefined} param0.workflow - The selected workflow object
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @component */
const TouchableHapticTimePeriod = ({
  refContainer,
  workflow,
  onPress,
}: TouchableHapticTimePeriodProps) => {
  const refTimePeriod = React.useRef<View>(null);
  const { secondaryBgColor, tertiaryBgColor, infoColor } = useThemeColors();

  const [selected, setSelected] = React.useState<ListItemDropdownProps>(WORKFLOW_TIME_PERIOD_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps);
  const [timePeriod, setTimePeriod] = React.useState<string>("24");

  React.useEffect(() => {
    /** @description Set the selected time period/value based on the workflow start time period if it is defined */
    if (workflow?.start.timePeriodValue) setTimePeriod(workflow?.start.timePeriodValue.toString());
    if (workflow?.start.timePeriod) setSelected(WORKFLOW_TIME_PERIOD_ITEMS.find((item) => item.itemKey === workflow?.start.timePeriod) as ListItemDropdownProps);
  }, [workflow?.start.timePeriod, workflow?.start.timePeriodValue]);

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
        title={t("i18n.screens.workflow.builder.timePeriod")} 
        items={WORKFLOW_TIME_PERIOD_ITEMS}
        width={140}
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
      refTouchable: refTimePeriod,
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
        text={t("i18n.screens.workflow.builder.timePeriod")} 
        type="label" 
        style={{ color: infoColor }} />
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
        <FontAwesomeIcon 
          icon={selected.icon as IconProp} 
          size={14} />
        <TextInput
          value={timePeriod}
          onChangeText={setTimePeriod}
          keyboardType="numeric"
          style={{
            color: infoColor,
            fontSize: Number(SIZES.label),
            fontFamily: String(FAMILIY.subtitle),
            marginTop: 1
          }} />
        <TouchableHapticDropdown
          ref={refTimePeriod}
          text={selected.title}
          backgroundColor={tertiaryBgColor}
          hasViewCustomStyle
          textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
          onPress={onPressDropdown}/>
      </View>
    </View>
  );
};

export default TouchableHapticTimePeriod;