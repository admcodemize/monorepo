import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Image, ImageSourcePropType, View } from "react-native";

import { STYLES } from "@codemize/constants/Styles";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableDropdownItem from "@/components/button/dropdown/TouchableDropdownItem";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.2
 * @type */
export type TouchableDropdownItemBaseProps = {
  itemKey: string|number;
  image?: ImageSourcePropType;
  icon?: IconProp;
  text: string;
  isSelected?: boolean;
  onPress: (key: string|number) => void;
}

/**
 * @private
 * @todo REMOVE THIS COMPONENT
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.2
 * @description The dropdown item component for displaying the teams and the private calendar for users selection
 * @param {TouchableDropdownItemBaseProps} param0 
* @param {string|number} param0.itemKey - The key of the dropdown item
 * @param {IconProp} param0.icon - The icon to display
 * @param {ImageSourcePropType} param0.image - The image to display
 * @param {string} param0.text - The text to display
 * @param {boolean} param0.isSelected - The selected state of the dropdown item
 * @param {Function} param0.onPress - The function to call when the dropdown item is pressed
 * @component */
const TouchableDropdownItemBase = ({
  itemKey,
  image,
  icon,
  text,
  isSelected,
  onPress
}: TouchableDropdownItemBaseProps) => {
  const colors = useThemeColors();
  return (
    <TouchableDropdownItem
      itemKey={itemKey}
      isSelected={isSelected}
      onPress={onPress}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
          {icon && <FontAwesomeIcon
            icon={icon as IconProp}
            size={STYLES.sizeFaIcon + 4}
            color={!isSelected ? colors.infoColor : colors.infoColor} />}
          {image && <Image 
            source={image} 
            resizeMode="cover" 
            style={{ width: STYLES.sizeFaIcon + 4, height: STYLES.sizeFaIcon + 4 }} />}
          <TextBase
            text={text}
            style={[GlobalTypographyStyle.labelText, { 
              color: !isSelected ? colors.infoColor : colors.infoColor,
              fontSize: Number(SIZES.label),
              fontFamily: String(FAMILIY.subtitle) 
          }]} />
        </View>
    </TouchableDropdownItem>
  )
}

export default TouchableDropdownItemBase