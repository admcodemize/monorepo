import React from "react";
import { View } from "react-native";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBadgeCheck } from "@fortawesome/pro-thin-svg-icons";

import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { DROPDOWN_CONFIRMATION_PAGE } from "@/constants/Models";

import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import InputWithLabel from "@/components/input/InputWithLabel";
import Divider from "@/components/container/Divider";
import TextBase from "@/components/typography/Text";
import ListDropdown from "@/components/lists/ListDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.65
 * @version 0.0.1
 * @enum */
export enum ConfirmationPageEnum {
  IN_APP = "inApp",
  CUSTOM_URL = "customUrl",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.2
 * @type */
export type TouchableHapticConfirmationPageProps = {
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
 * @version 0.0.2
 * @param {TouchableHapticConfirmationPageProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {ListItemDropdownProps} param0.selectedItem - The selected item object
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @param {Function} param0.onChangeValue - Callback function when the value changes of the custom url input field
 * @component */
const TouchableHapticConfirmationPage = ({
  refContainer,
  selectedItem,
  onPress,
  onChangeValue
}: TouchableHapticConfirmationPageProps) => {
  const refTimePeriod = React.useRef<View>(null);
  const { secondaryBgColor, tertiaryBgColor, infoColor, linkColor } = useThemeColors();

  const [value, setValue] = React.useState<string>("");
  const [selected, setSelected] = React.useState<ListItemDropdownProps>(selectedItem);

   /** @description Set the selected time period/value based on the workflow start time period if it is defined */
  React.useEffect(() => selectedItem && setSelected(selectedItem), [selectedItem]);
  React.useEffect(() => onChangeValue(value), [value]);

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
        title={t("i18n.screens.eventType.confirmationPage.title")} 
        items={DROPDOWN_CONFIRMATION_PAGE}
        width={180}
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
    <View style={[GlobalWorkflowStyle.touchableParent, { 
      gap: 0,
      height: "auto", 
      justifyContent: "center",
      backgroundColor: secondaryBgColor,
    }]}>
      <View style={[GlobalContainerStyle.rowCenterBetween, { height: 32 }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
          <FontAwesomeIcon 
            icon={faBadgeCheck as IconProp} 
            size={STYLES.sizeFaIcon} />
          <TextBase
            text={t("i18n.screens.eventType.confirmationPage.title")} 
            style={{ color: infoColor }} />
        </View>
        <View style={[GlobalContainerStyle.rowCenterCenter]}>
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
      {selected.itemKey === ConfirmationPageEnum.CUSTOM_URL && 
      <View>
        <Divider />
        <InputWithLabel
          placeholder={t("i18n.screens.eventType.confirmationPage.customUrlPlaceholder")}
          paddingHorizontal={0}
          showRemoveButton={false}
          value={value}
          onChangeText={setValue} />
      </View>}
    </View>
  );
};

export default TouchableHapticConfirmationPage;