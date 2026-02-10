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
import { faListTimeline } from "@fortawesome/pro-thin-svg-icons";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.1
 * @type */
export type TouchableHapticAvailabilityProps = {
  refContainer: React.RefObject<View|null>;
  selectedItem: ListItemDropdownProps;
  onPress: (item: ListItemDropdownProps) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.58
 * @version 0.0.1
 * @param {TouchableHapticAvailabilityProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {ListItemDropdownProps} param0.selectedItem - The selected item object
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @component */
const TouchableHapticAvailability = ({
  refContainer,
  selectedItem,
  onPress,
}: TouchableHapticAvailabilityProps) => {
  const refTimePeriod = React.useRef<View>(null);
  const { secondaryBgColor, tertiaryBgColor, infoColor, linkColor } = useThemeColors();

  const [selected, setSelected] = React.useState<ListItemDropdownProps>(selectedItem);

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
        title={t("Verfügbarkeitszeitplan")} 
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
        backgroundColor: secondaryBgColor,
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faListTimeline as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={t("Verfügbarkeitszeitplan")} 
          style={{ color: infoColor }} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
        <TouchableHapticDropdown
          ref={refTimePeriod}
          text={"Arbeitszeitplan"}
          backgroundColor={tertiaryBgColor}
          hasViewCustomStyle
          textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
          onPress={onPressDropdown}/>
        <TouchableHaptic>
          <FontAwesomeIcon
            icon={faPlus as IconProp}
            size={STYLES.sizeFaIcon}
            color={linkColor} />
        </TouchableHaptic>
      </View>
    </View>
  );
};

export default TouchableHapticAvailability;