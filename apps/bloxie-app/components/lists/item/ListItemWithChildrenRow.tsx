import { PropsWithChildren } from "react";
import { Image, ImageSourcePropType, StyleProp, View, ViewStyle } from "react-native";

import { faAngleRight } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import ListItemWithChildrenStyle from "@/styles/components/lists/item/ListItemWithChildren";
import { shadeColor } from "@codemize/helpers/Colors";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.35
 * @version 0.0.1
 * @type */
export type ListItemWithChildrenRowProps = PropsWithChildren & {
  icon?: IconProp;
  iconSize?: number;
  image?: ImageSourcePropType;
  title: string;
  description: string;
  titleI18nTranslation?: boolean;
  descriptionI18nTranslation?: boolean;
  type?: ListItemWithChildrenTypeEnum;
  showDescription?: boolean;
  right?: React.ReactNode;
  styleTextComponent?: StyleProp<ViewStyle>;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description A list item with a title, description and children
 * @since 0.0.35
 * @version 0.0.3
 * @param {ListItemWithChildrenProps} param0
 * @param {IconProp} param0.icon - The icon to display
 * @param {number} param0.iconSize - The custom size of the icon
 * @param {ImageSourcePropType} param0.image - The image to display (SVG)
 * @param {string} param0.title - The title of the list item
 * @param {string} param0.description - The description of the list item
 * @param {boolean} param0.titleI18nTranslation - Should the title be translated
 * @param {boolean} param0.descriptionI18nTranslation - Should the description be translated
 * @param {ListItemWithChildrenTypeEnum} param0.type - The type of the list item which handles the visibility of different components
 * @param {boolean} param0.showDescription - Should the description be displayed
 * @param {React.ReactNode} param0.right - The right component to display on the right side of the list item
 * @param {StyleProp<ViewStyle>} param0.styleTextComponent - The style to display on the text component
 * @param {React.ReactNode} param0.children - The generic children to display on the right side of the list item
 * @component */
const ListItemWithChildrenRow = ({
  icon,
  iconSize = STYLES.sizeFaIcon + 6,
  image,
  title,
  description,
  titleI18nTranslation = true,
  descriptionI18nTranslation = true,
  type = ListItemWithChildrenTypeEnum.select,
  showDescription = true,
  right,
  styleTextComponent,
  children,
}: ListItemWithChildrenRowProps) => {
  const { primaryIconColor, infoColor } = useThemeColors();

  return (
    <View style={{ gap: STYLES.sizeGap }}>
      <View style={[GlobalContainerStyle.rowStartStart, ListItemWithChildrenStyle.border]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
          {icon && <FontAwesomeIcon
            icon={icon}
            size={iconSize}
            color={primaryIconColor} />}
          <View style={[GlobalContainerStyle.rowCenterBetween, { flex: 1 }, styleTextComponent]}>
            <TextBase 
              text={title}
              type="text"
              i18nTranslation={titleI18nTranslation}
              style={[{ color: infoColor }]} />
            {showDescription && <TextBase 
              text={description}
              type="label"
              i18nTranslation={descriptionI18nTranslation}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[{ color: shadeColor(infoColor, 0.3) }]} />}
          </View>
          {type === ListItemWithChildrenTypeEnum.navigation && <FontAwesomeIcon
            icon={faAngleRight as IconProp}
            size={STYLES.sizeFaIcon}
            color={primaryIconColor} />}
          {type === ListItemWithChildrenTypeEnum.custom && right}
        </View>
        {children}
      </View>
    </View>
  )
}

export default ListItemWithChildrenRow;