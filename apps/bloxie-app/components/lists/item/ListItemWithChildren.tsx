import { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { faAngleRight } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import ListItemWithChildrenStyle from "@/styles/components/lists/item/ListItemWithChildren";

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
 * @version 0.0.1
 * @type */
export type ListItemWithChildrenProps = PropsWithChildren & {
  icon?: IconProp;
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
 * @since 0.0.2
 * @version 0.0.1
 * @param {ListItemWithChildrenProps} param0
 * @param {IconProp} param0.icon - The icon to display
 * @param {string} param0.title - The title of the list item
 * @param {string} param0.description - The description of the list item
 * @param {boolean} param0.titleI18nTranslation - Should the title be translated
 * @param {boolean} param0.descriptionI18nTranslation - Should the description be translated
 * @param {ListItemWithChildrenTypeEnum} param0.type - The type of the list item which handles the visibility of different components
 * @param {boolean} param0.showDescription - Should the description be displayed
 * @param {React.ReactNode} param0.right - The right component to display on the right side of the list item
 * @param {React.ReactNode} param0.children - The generic children to display on the right side of the list item
 * @component */
const ListItemWithChildren = ({
  icon,
  title,
  description,
  titleI18nTranslation = true,
  descriptionI18nTranslation = true,
  type = ListItemWithChildrenTypeEnum.select,
  showDescription = true,
  right,
  styleTextComponent,
  children
}: ListItemWithChildrenProps) => {
  const { primaryIconColor } = useThemeColors();

  return (
    <View style={[GlobalContainerStyle.rowStartStart, ListItemWithChildrenStyle.border]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap + 4 }]}>
        {icon && <FontAwesomeIcon
          icon={icon}
          size={STYLES.sizeFaIcon + 6}
          color={primaryIconColor} />}
        <View style={[GlobalContainerStyle.rowCenterBetween, { flex: 1 }]}>
          <View style={[{ flexShrink: 1, gap: showDescription ? 1 : 0 }, styleTextComponent]}>
            <TextBase 
              text={title}
              i18nTranslation={titleI18nTranslation}
              style={[GlobalTypographyStyle.textSubtitle]} />
            {showDescription && <TextBase 
              text={description}
              type="label"
              i18nTranslation={descriptionI18nTranslation}
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[GlobalTypographyStyle.labelText, { fontSize: 9 }]} />}
          </View>
          {type === ListItemWithChildrenTypeEnum.navigation && <FontAwesomeIcon
            icon={faAngleRight as IconProp}
            size={STYLES.sizeFaIcon}
            color={primaryIconColor} />}
          {type === ListItemWithChildrenTypeEnum.custom && right}
        </View>
      </View>
      {children}
    </View>
  )
}

export default ListItemWithChildren;