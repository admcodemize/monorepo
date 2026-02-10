import React from "react";
import { TextInput, View } from "react-native";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { DROPDOWN_DURATION_ITEMS } from "@/constants/Models";

import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import TextBase from "@/components/typography/Text";
import ListDropdown from "@/components/lists/ListDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.58
 * @version 0.0.1
 * @enum */
export enum DurationEnum {
  HOUR = "hour",
  MINUTE = "minute",
  DAY = "day",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.1
 * @type */
export type TouchableHapticFrequencyProps = {
  refContainer: React.RefObject<View|null>;
  selectedItem: ListItemDropdownProps;
  onPress: (item: ListItemDropdownProps) => void;
  onChangeValue: (value: string) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.58
 * @version 0.0.1
 * @param {TouchableHapticFrequencyProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {ListItemDropdownProps} param0.selectedItem - The selected item object
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @param {Function} param0.onChangeValue - Callback function when user changes the time period value
 * @component */
const TouchableHapticFrequency = ({
  refContainer,
  selectedItem,
  onPress,
  onChangeValue,
}: TouchableHapticFrequencyProps) => {
  const refTimePeriod = React.useRef<View>(null);
  const { secondaryBgColor, tertiaryBgColor, infoColor, labelColor } = useThemeColors();

  const [selected, setSelected] = React.useState<ListItemDropdownProps>(selectedItem);
  const [timePeriodValue, setTimePeriodValue] = React.useState<string>("30");

  React.useEffect(() => {
    /** @description Set the selected time period/value based on the workflow start time period if it is defined */
    if (selectedItem) setSelected(selectedItem);
  }, [selectedItem]);

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
        title={t("Frequenz")} 
        items={DROPDOWN_DURATION_ITEMS}
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
   * @description Used to change the time period value
   * -> Change the value on the parent component
   * @param {string} text - The new time period value
   * @function */
  const onChangeTimePeriodValue = (text: string) => {
    setTimePeriodValue(text);
    onChangeValue(text);
  };

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
    <View style={[GlobalWorkflowStyle.touchableParent, { gap: 0, height: "auto", paddingBottom: 4,
      backgroundColor: secondaryBgColor,
     }]}>
      <View
        style={[GlobalContainerStyle.rowCenterBetween, {
          
        }]}>
          <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
            <FontAwesomeIcon 
              icon={selected.iconThin as IconProp} 
              size={STYLES.sizeFaIcon} />
            <TextBase
              text={t("Frequenz")} 
              style={{ color: infoColor }} />
          </View>
          <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
            <TextInput
              value={timePeriodValue}
              onChangeText={onChangeTimePeriodValue}
              keyboardType="number-pad"
              style={[GlobalTypographyStyle.inputText, {
                color: infoColor
              }]} />
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
      <TextBase
        text={t("Die Frequenz legt die Schrittauswahl der freien Slots fest.")} 
        type="label"
        style={{ color: labelColor }} />    
    </View>
  );
};

export default TouchableHapticFrequency;