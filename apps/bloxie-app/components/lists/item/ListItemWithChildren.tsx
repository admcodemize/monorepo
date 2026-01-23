import { PropsWithChildren } from "react";
import { Image } from "react-native";
import { ImageSourcePropType, StyleProp, View, ViewStyle } from "react-native";

import { faAngleRight, faExclamationTriangle } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { STYLES } from "@codemize/constants/Styles";
import { SIZES } from "@codemize/constants/Fonts";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";
import TouchableTag from "@/components/button/TouchableTag";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import ListItemWithChildrenStyle from "@/styles/components/lists/item/ListItemWithChildren";

const DEFAULT_ICON_SIZE = STYLES.sizeFaIcon + 6;
const DEFAULT_IMAGE_WIDTH = STYLES.sizeFaIcon + 18;
const DEFAULT_IMAGE_HEIGHT = STYLES.sizeFaIcon + 24;
const DEFAULT_CONTENT_GAP = STYLES.sizeGap + 4;

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
  imageWidth?: number;
  imageHeight?: number;
  title: string;
  description?: string;
  titleI18nTranslation?: boolean;
  descriptionI18nTranslation?: boolean;
  gap?: number;
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
 * @version 0.0.7
 * @param {ListItemWithChildrenProps} param0
 * @param {IconProp} param0.icon - The icon to display
 * @param {number} param0.iconSize - The custom size of the icon
 * @param {ImageSourcePropType} param0.image - The image to display (SVG)
 * @param {number} param0.imageWidth - The width of the image
 * @param {number} param0.imageHeight - The height of the image
 * @param {string} param0.title - The title of the list item
 * @param {string} param0.description - The description of the list item
 * @param {boolean} param0.titleI18nTranslation - Should the title be translated
 * @param {boolean} param0.descriptionI18nTranslation - Should the description be translated
 * @param {ListItemWithChildrenTypeEnum} param0.type - The type of the list item which handles the visibility of different components
 * @param {boolean} param0.showDescription - Should the description be displayed
 * @param {number} param0.gap - The gap between the items (icon or image and content)
 * @param {React.ReactNode} param0.top - The top component to display on the top side of the list item
 * @param {React.ReactNode} param0.right - The right component to display on the right side of the list item
 * @param {React.ReactNode} param0.bottom - The bottom component to display on the bottom side of the list item
 * @param {boolean} param0.isComingSoon - Should the list item be disabled because the feature is not available yet
 * @param {StyleProp<ViewStyle>} param0.styleTextComponent - The style to display on the text component
 * @param {React.ReactNode} param0.children - The generic children to display on the right side of the list item
 * @component */
const ListItemWithChildren = ({
  icon,
  iconSize,
  image,
  imageWidth,
  imageHeight,
  title,
  description,
  titleI18nTranslation = true,
  descriptionI18nTranslation = true,
  type = ListItemWithChildrenTypeEnum.select,
  showDescription = true,
  gap,
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
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: gap ?? DEFAULT_CONTENT_GAP }]}>
          {!image && icon ? <FontAwesomeIcon
            icon={icon as IconProp}
            size={iconSize ?? DEFAULT_ICON_SIZE}
            color={primaryIconColor} /> : null}
          {!icon && image ? <Image 
            source={image} 
            style={{ height: imageHeight ?? DEFAULT_IMAGE_HEIGHT, width: imageWidth ?? DEFAULT_IMAGE_WIDTH }} 
            resizeMode="cover"/> : null}
          <View style={[GlobalContainerStyle.rowCenterBetween, { flex: 1 }]}>
            <View style={[{ flexShrink: 1, gap: showDescription ? 1 : 0 }, styleTextComponent]}>
              <TextBase 
                text={title}
                i18nTranslation={titleI18nTranslation}
                numberOfLines={1}
                style={[GlobalTypographyStyle.textSubtitle, { color: infoColor }]} />
              {showDescription && description && <TextBase 
                text={description}
                type="label"
                i18nTranslation={descriptionI18nTranslation}
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[GlobalTypographyStyle.labelText, { fontSize: Number(SIZES.label) }]} />}
            </View>
            {isComingSoon && <TouchableTag
              icon={faExclamationTriangle as IconProp}
              text={"i18n.global.comingSoon"}
              type="label"
              colorInactive={errorColor}
              disabled={true} />}
            {type === ListItemWithChildrenTypeEnum.navigation ? <FontAwesomeIcon
              icon={faAngleRight as IconProp}
              size={STYLES.sizeFaIcon}
              color={primaryIconColor} /> : null}
            {type === ListItemWithChildrenTypeEnum.custom ? right : null}
          </View>
        </View>
        {children}
      </View>
      {bottom}
    </View>
  )
}

export default ListItemWithChildren;