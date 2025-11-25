import React from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { View } from "react-native";
import { faTag, faXmark, faCheck } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { useThemeColor, useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";

import TextBase from "@/components/typography/Text";

import TouchableCheckboxStyle from "@/styles/components/button/TouchableCheckbox";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.13
 * @version 0.0.1
 * @type */
export type CheckboxProps = {
  item: CheckboxItemProps;
  disabled?: boolean;
  isInitialChecked?: boolean;
  textComponent?: React.ReactNode;
  size?: number;
  onPress?: (isChecked: boolean) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.13
 * @version 0.0.1
 * @type */
export type CheckboxItemProps = {
  title: string;
  color: string;
}

/**
 * @private
 * @since 0.0.20
 * @version 0.0.22
 * @type */
type ListRenderItemProps = CheckboxItemProps & { isChecked: boolean };

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.20
 * @version 0.0.20
 * @component
 * @param {CheckboxProps} param0
 * @param {CheckboxItemProps} param0.item - Event data object
 * @param {boolean} param0.disabled - Disabled state of the checkbox
 * @param {boolean} param0.isInitialChecked - Handles the initial checked state
 * @param {React.ReactNode} param.textComponent - Custom text component for the checkbox
 * @param {number} param.size - Size of the checkbox
 * @param {() => void} param.onPress - Callback function for the press event of the checkbox */
const TouchableCheckbox = ({
  item,
  disabled = false,
  isInitialChecked = false,
  textComponent,
  size = 16,
  onPress
}: CheckboxProps) => {
  const { primaryIconColor, successColor, tertiaryBgColor } = useThemeColors();
   
  const [isChecked, setIsChecked] = React.useState<boolean>(isInitialChecked);

  /**
   * @private
   * @description - Component for rendering the icon of the checkbox
   * @component */
  const IconComponent = React.memo(({ 
    isChecked 
  }: ListRenderItemProps) => (
    <FontAwesomeIcon 
      icon={isChecked ? faCheck as IconProp : faXmark as IconProp} 
      size={size - 10} 
      color="#fff" />));
  
  /**
   * @private
   * @description - Component for rendering the title of the checkbox
   * @component */
  const TextComponentTitle = React.memo(({ 
    title, 
    color 
  }: CheckboxItemProps) => (
    <View style={[GlobalContainerStyle.rowCenterBetween, TouchableCheckboxStyle.container]}>
      <TextBase 
        text={title}
        style={[GlobalTypographyStyle.standardText]} />
    </View>)); 

  /**
   * @private
   * @description - Callback function for the press event of the checkbox
   * @function */
  const onPressInternal = React.useCallback(() => {
    setIsChecked(!isChecked);
    onPress?.(!isChecked);
  }, [isChecked, onPress]);
      
  return (
    <BouncyCheckbox 
      useNativeDriver
      disableBuiltInState={true}
      disabled={disabled}
      fillColor={`${successColor}80`}
      unfillColor={primaryIconColor}
      textComponent={textComponent ? textComponent : <TextComponentTitle {...item} />}
      style={{ opacity: disabled ? 0.4 : 1 }}
      iconStyle={[TouchableCheckboxStyle.innerIcon, { borderColor: isChecked ? successColor : tertiaryBgColor }]}
      iconComponent={<IconComponent {...item} isChecked={isChecked} />}
      isChecked={isChecked}
      size={size}
      onPress={onPressInternal} />
  )
}

export default TouchableCheckbox;  