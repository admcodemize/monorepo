import { PropsWithChildren } from "react";
import { ImageSourcePropType, StyleProp, View, ViewStyle } from "react-native";

import { faAngleRight, faExclamationTriangle } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import ListItemWithChildrenStyle from "@/styles/components/lists/item/ListItemWithChildren";
import { Image } from "react-native";
import TouchableTag from "@/components/button/TouchableTag";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @enum */
export enum ListItemWithChildrenTypeEnum {
  navigation = "navigation",
  select = "select",
  custom = "custom",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.3
 * @type */
export type ListItemWithChildrenProps = PropsWithChildren & {
  icon?: IconProp;
  iconSize?: number;
  image?: ImageSourcePropType;
  title: string;
  description?: string;
  titleI18nTranslation?: boolean;
  descriptionI18nTranslation?: boolean;
  type?: ListItemWithChildrenTypeEnum;
  showDescription?: boolean;
  top?: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
  isComingSoon?: boolean;
  styleTextComponent?: StyleProp<ViewStyle>;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description A list item with a title, description and children
 * @since 0.0.2
 * @version 0.0.6
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
 * @param {React.ReactNode} param0.top - The top component to display on the top side of the list item
 * @param {React.ReactNode} param0.right - The right component to display on the right side of the list item
 * @param {React.ReactNode} param0.bottom - The bottom component to display on the bottom side of the list item
 * @param {boolean} param0.isComingSoon - Should the list item be disabled because the feature is not available yet
 * @param {StyleProp<ViewStyle>} param0.styleTextComponent - The style to display on the text component
 * @param {React.ReactNode} param0.children - The generic children to display on the right side of the list item
 * @component */
const ListItemWithChildren = ({
  icon,
  iconSize = STYLES.sizeFaIcon + 6,
  image,
  title,
  description,
  titleI18nTranslation = true,
  descriptionI18nTranslation = true,
  type = ListItemWithChildrenTypeEnum.select,
  showDescription = true,
  top,
  right,
  bottom,
  styleTextComponent,
  isComingSoon = false,
  children,
}: ListItemWithChildrenProps) => {
  const { primaryIconColor, infoColor, errorColor } = useThemeColors();

  return (
    <View style={{ gap: STYLES.sizeGap }}>
      {top}
      <View style={[GlobalContainerStyle.rowStartStart, ListItemWithChildrenStyle.border]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap + 4 }]}>
          {icon && !image && <FontAwesomeIcon
            icon={icon}
            size={iconSize}
            color={primaryIconColor} />}
          {image &&!icon && <Image source={image} style={{ height: STYLES.sizeFaIcon + 24, width: STYLES.sizeFaIcon + 18 }} resizeMode="cover"/>}
          <View style={[GlobalContainerStyle.rowCenterBetween, { flex: 1 }]}>
            <View style={[{ flexShrink: 1, gap: showDescription ? 1 : 0 }, styleTextComponent]}>
              <TextBase 
                text={title}
                i18nTranslation={titleI18nTranslation}
                style={[GlobalTypographyStyle.textSubtitle, { color: infoColor }]} />
              {showDescription && description && <TextBase 
                text={description}
                type="label"
                i18nTranslation={descriptionI18nTranslation}
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[GlobalTypographyStyle.labelText, { fontSize: 9 }]} />}
            </View>
            {isComingSoon && <TouchableTag
              icon={faExclamationTriangle as IconProp}
              text={"i18n.global.comingSoon"}
              type="label"
              colorInactive={errorColor}
              disabled={true} />}
            {type === ListItemWithChildrenTypeEnum.navigation && <FontAwesomeIcon
              icon={faAngleRight as IconProp}
              size={STYLES.sizeFaIcon}
              color={primaryIconColor} />}
            {type === ListItemWithChildrenTypeEnum.custom && right}
          </View>
        </View>
        {children}
      </View>
      {bottom}
    </View>
  )
}

export default ListItemWithChildren;