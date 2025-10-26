import { faAddressBook, faBookOpenCover, faBusinessTime, faChartNetwork, faFileContract, faGrid2Plus, faHandshake } from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { View } from "react-native";

import { STYLES } from "@/constants/Styles";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import ListItemGroup from "@/components/container/ListItemGroup";
import StackModalHeader from "@/components/container/StackModalHeader";
import ViewBase from "@/components/container/View";
import ListItemWithChildren, { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import CreateStyle from "@/styles/screens/private/modal/Create";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @component */
const ScreenCreate = () => {
  const { info } = useThemeColors();

  return (
    <ViewBase>
      <StackModalHeader 
        icon={faGrid2Plus as IconProp}
        title={"i18n.modal.create.title"} />
      <View style={[GlobalContainerStyle.columnStartStart, { 
        padding: STYLES.paddingHorizontal,
        gap: STYLES.sizeGap + 4,
      }]}>
        <TextBase 
          text={"i18n.modal.create.description"}
          style={[GlobalTypographyStyle.labelText, { color: info }]} />
      </View>
      <View style={CreateStyle.view}>
        <ListItemGroup title={"i18n.sheets.create.groups.manage"}>
          <View style={CreateStyle.groupContent}>
            <ScreenCreateItemChildren 
              icon={faHandshake as IconProp} 
              title={"i18n.sheets.create.items.meeting.title"} 
              description={"i18n.sheets.create.items.meeting.description"} />
            <ScreenCreateItemChildren 
              icon={faFileContract as IconProp} 
              title={"i18n.sheets.create.items.type.title"} 
              description={"i18n.sheets.create.items.type.description"} />
            <ScreenCreateItemChildren 
              icon={faAddressBook as IconProp} 
              title={"i18n.sheets.create.items.contact.title"} 
              description={"i18n.sheets.create.items.contact.description"} />
            <ListItemWithChildren 
              icon={faChartNetwork as IconProp} 
              title={"i18n.sheets.create.items.employee.title"} 
              description={"i18n.sheets.create.items.employee.description"}
              type={ListItemWithChildrenTypeEnum.navigation} />
          </View>
        </ListItemGroup>
        <ListItemGroup title={"i18n.sheets.create.groups.configuration"}>
          <View style={CreateStyle.groupContent}>
            <ScreenCreateItemChildren 
              icon={faBookOpenCover as IconProp} 
              title={"i18n.sheets.create.items.bookingPage.title"} 
              description={"i18n.sheets.create.items.bookingPage.description"} />
            <ListItemWithChildren 
              icon={faBusinessTime as IconProp} 
              title={"i18n.sheets.create.items.availability.title"} 
              description={"i18n.sheets.create.items.availability.description"}
              type={ListItemWithChildrenTypeEnum.navigation} />
          </View>
        </ListItemGroup>
      </View>
    </ViewBase>
  );
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type ScreenCreateItemChildrenProps = {
  icon: IconProp;
  title: string;
  description: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {ScreenCreateItemChildrenProps} param0
 * @param {IconProp} param0.icon - The icon to display
 * @param {string} param0.title - The title of the list item
 * @param {string} param0.description - The description of the list item
 * @component */
const ScreenCreateItemChildren = ({
  icon,
  title,
  description
}: ScreenCreateItemChildrenProps) => {
  return (
    <View style={[GlobalContainerStyle.columnStartStart]}>
      <ListItemWithChildren
        icon={icon} 
        title={title} 
        description={description}
        type={ListItemWithChildrenTypeEnum.navigation} />
    </View>
  );
};

export default ScreenCreate;