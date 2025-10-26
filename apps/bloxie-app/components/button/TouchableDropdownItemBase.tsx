import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { View } from "react-native";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableDropdownItem from "@/components/button/TouchableDropdownItem";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type TouchableDropdownItemBaseProps = {
  itemKey: string|number;
  icon: IconProp;
  text: string;
  isSelected?: boolean;
  onPress: (key: string|number) => void;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @description The dropdown item component for displaying the teams and the private calendar for users selection
 * @param {TouchableDropdownItemBaseProps} param0 
* @param {string|number} param0.itemKey - The key of the dropdown item
 * @param {IconProp} param0.icon - The icon to display
 * @param {string} param0.text - The text to display
 * @param {boolean} param0.isSelected - The selected state of the dropdown item
 * @param {Function} param0.onPress - The function to call when the dropdown item is pressed
 * @component */
const TouchableDropdownItemBase = ({
  itemKey,
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
          <FontAwesomeIcon
            icon={icon as IconProp}
            size={STYLES.sizeFaIcon}
            color={!isSelected ? colors.primaryIconColor : colors.focusedContentColor} />
          <TextBase
            text={text}
            style={[GlobalTypographyStyle.textSubtitle, { 
              fontSize: 10, 
              color: !isSelected ? colors.primaryIconColor : colors.focusedContentColor 
            }]} />
        </View>
    </TouchableDropdownItem>
  )
}

export default TouchableDropdownItemBase