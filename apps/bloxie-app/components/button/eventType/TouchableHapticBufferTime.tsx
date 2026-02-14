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
import TouchableHaptic from "../TouchableHaptic";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { faTableColumnsAddAfter, faTableColumnsAddBefore } from "@fortawesome/pro-thin-svg-icons";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.59
 * @version 0.0.1
 * @enum */
export enum BufferTimeType {
  BEFORE_EVENT = "beforeEvent",
  AFTER_EVENT = "afterEvent",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.59
 * @version 0.0.1
 * @type */
export type TouchableHapticBufferTimeProps = {
  refContainer: React.RefObject<View|null>;
  selectedItem: ListItemDropdownProps;
  type: BufferTimeType;
  showBackgroundColor?: boolean;
  onPress: (item: ListItemDropdownProps) => void;
  onChangeValue: (value: string) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.59
 * @version 0.0.1
 * @param {TouchableHapticBufferTimeProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {ListItemDropdownProps} param0.selectedItem - The selected item object
 * @param {BufferTimeType} param0.type - The type of buffer time
 * @param {boolean} param0.showBackgroundColor - Whether to show the background color
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @param {Function} param0.onChangeValue - Callback function when user changes the buffer time value
 * @component */
const TouchableHapticBufferTime = ({
  refContainer,
  selectedItem,
  type = BufferTimeType.BEFORE_EVENT,
  showBackgroundColor = true,
  onPress,
  onChangeValue,
}: TouchableHapticBufferTimeProps) => {
  const refBufferTime = React.useRef<View>(null);
  const { secondaryBgColor, infoColor, tertiaryBgColor } = useThemeColors();

  const [selected, setSelected] = React.useState<ListItemDropdownProps>(selectedItem);
  const [bufferTimeValue, setBufferTimeValue] = React.useState<string>("5");
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
        title={t("Dauer")} 
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
    setBufferTimeValue(text);
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
      refTouchable: refBufferTime,
      relativeToRef: refContainer,
      paddingHorizontal: 12 - 2, 
      open,
      children: children(),
    });
  }

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: showBackgroundColor ? secondaryBgColor : "transparent",
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={type === BufferTimeType.BEFORE_EVENT ? faTableColumnsAddBefore as IconProp : faTableColumnsAddAfter as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={type === BufferTimeType.BEFORE_EVENT ? t("Vor Ereignisbeginn") : t("Nach Ereignisende")} 
          style={{ color: infoColor }} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
        <TextInput
          value={bufferTimeValue}
          onChangeText={onChangeTimePeriodValue}
          keyboardType="number-pad"
          style={[GlobalTypographyStyle.inputText, {
            color: infoColor
          }]} />
        <TouchableHapticDropdown
          ref={refBufferTime}
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

export default TouchableHapticBufferTime;