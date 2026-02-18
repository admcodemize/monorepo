import React from "react";
import { Dimensions, NativeSyntheticEvent, TextInput, TextInputChangeEvent, TextInputChangeEventData, View } from "react-native";
import { t } from "i18next";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faGlobePointer, faHand, faMapLocation, faTrash, faTrashSlash } from "@fortawesome/duotone-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import TouchableHaptic from "../button/TouchableHaptic";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.61
 * @version 0.0.2
 * @type */
export type InputWithLabelProps = {
  icon: IconProp;
  label?: string;
  placeholder: string;
  textAlign?: "left" | "right";
  value: string;
  onPressRemove?: () => void;
  onChangeText: (text: string) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a input text component for the address of the event type
 * @since 0.0.61
 * @version 0.0.2
 * @param {InputWithLabelProps} param0 
 * @param {string} param0.label - The label on the left side of the input
 * @param {string} param0.placeholder - The placeholder of the input field
 * @param {string} param0.value - The value of the input field
 * @param {Function} param0.onChangeText - The function to call when the text changes on the input field
 * @component */
const InputWithLabel = ({
  icon,
  label,
  placeholder,
  textAlign = "right",
  value,
  onChangeText = () => {},
  onPressRemove = () => {},
}: InputWithLabelProps) => {
  const { infoColor, errorColor } = useThemeColors();

  /**
   * @description Used to change the text value on the input field
   * @param {TextInputChangeEvent} e - The event object for transferring the new text value from the input field
   * @function */ 
  const onChangeTextInternal = (
    e: TextInputChangeEvent,
  ) => onChangeText?.(e.nativeEvent?.text ?? "");

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        //backgroundColor: secondaryBgColor,
      }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
          <FontAwesomeIcon 
            icon={icon} 
            size={STYLES.sizeFaIcon} 
            color={infoColor} />
          {label && <TextBase
            text={label} 
            style={{ color: infoColor }} />}
        </View>
        <TextInput
          value={value}
          placeholder={t(placeholder)}
          onChange={onChangeTextInternal}
          multiline={false}
          autoCapitalize="none"
          cursorColor={infoColor}
          selectionColor={infoColor}
          style={[GlobalTypographyStyle.inputText, {
            textAlign: textAlign,
            color: infoColor,
            flex: 1,
            maxHeight: 24,
          }]} />
        <TouchableHaptic onPress={onPressRemove}>
          <FontAwesomeIcon
            icon={faTrashSlash as IconProp}
            size={STYLES.sizeFaIcon}
            color={errorColor} />
        </TouchableHaptic>
      </View>
  );
};

export default InputWithLabel;