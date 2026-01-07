import { View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { shadeColor } from "@codemize/helpers/Colors";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { SIZES } from "@codemize/constants/Fonts";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import ListItemDropdownStyle from "@/styles/components/lists/item/ListItemDropdown";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.43
 * @version 0.0.1
 * @type */
export type ListItemDropdownProps = {
  itemKey: string;
  title: string;
  description?: string;
  icon: IconProp;
  isSelected?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.43
 * @version 0.0.1
 * @param {ListItemDropdownProps} param0
 * @param {string} param0.title - The title of the dropdown item
 * @param {string} param0.description - The description of the dropdown item
 * @param {IconProp} param0.icon - The icon of the dropdown item
 * @component */
const ListItemDropdown = ({
  title,
  description,
  icon,
  isSelected = false
}: ListItemDropdownProps) => {
  const { secondaryBgColor, infoColor, primaryIconColor } = useThemeColors();
  return (
    <View style={[ListItemDropdownStyle.view, { 
      backgroundColor: isSelected ? shadeColor(secondaryBgColor, 0.1) : undefined, 
    }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: 12 }]}>
        <FontAwesomeIcon 
          icon={icon} 
          size={14} 
          color={primaryIconColor} />
        <TextBase 
          text={title} 
          type="label" 
          style={[GlobalTypographyStyle.titleSubtitle, { 
            color: infoColor, 
            fontSize: Number(SIZES.label) 
          }]} />
      </View>
      {description && <TextBase 
        text={description} 
        type="label" 
        style={[GlobalTypographyStyle.labelText, { 
          color: shadeColor(infoColor, 0.3), 
          fontSize: Number(SIZES.label) 
        }]} />}
    </View>
  );
}

export default ListItemDropdown;