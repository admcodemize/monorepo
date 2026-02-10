import { Image, ImageSourcePropType, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { shadeColor } from "@codemize/helpers/Colors";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import ListItemDropdownStyle from "@/styles/components/lists/item/ListItemDropdown";
import ActionTemplateStyle from "@/styles/screens/private/tray/modal/workflow/ActionTemplate";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.43
 * @version 0.0.3
 * @type */
export type ListItemDropdownProps = {
  itemKey: string;
  title: string;
  description?: string;
  icon?: IconProp;
  iconThin?: IconProp;
  image?: ImageSourcePropType;
  isSelected?: boolean;
  right?: React.ReactNode;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.43
 * @version 0.0.2
 * @param {ListItemDropdownProps} param0
 * @param {string} param0.title - The title of the dropdown item
 * @param {string} param0.description - The description of the dropdown item
 * @param {IconProp} param0.icon - The icon of the dropdown item
 * @param {ImageSourcePropType} param0.image - The image of the dropdown item
 * @param {boolean} param0.isSelected - Whether the dropdown item is selected
 * @param {React.ReactNode} param0.right - The right custom component of the dropdown item
 * @component */
const ListItemDropdown = ({
  title,
  description,
  icon,
  image,
  isSelected = false,
  right
}: ListItemDropdownProps) => {
  const { secondaryBgColor, infoColor, primaryIconColor } = useThemeColors();
  return (
    <View style={[ListItemDropdownStyle.view, { 
      backgroundColor: isSelected ? shadeColor(secondaryBgColor, 0.1) : undefined, 
    }]}>
      <View style={[GlobalContainerStyle.rowCenterBetween,{ gap: 40 }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: 12 }]}>
          {icon && !image && <FontAwesomeIcon 
            icon={icon} 
            size={STYLES.sizeFaIcon + 2} 
            color={primaryIconColor} />}
          {image && <Image 
            source={image} 
            style={ActionTemplateStyle.image} 
            resizeMode="cover" />}
          <TextBase 
            text={title} 
            type="label" 
            style={[GlobalTypographyStyle.titleSubtitle, { 
              color: infoColor, 
              fontSize: Number(SIZES.label) 
            }]} />
        </View>
        {right && right}
      </View>
      {description && <TextBase 
        text={description} 
        type="label" 
        style={[GlobalTypographyStyle.labelText, { 
          color: shadeColor(infoColor, 0.3), 
          fontSize: Number(SIZES.label) - 1 
      }]} />}
    </View>
  );
}

export default ListItemDropdown;