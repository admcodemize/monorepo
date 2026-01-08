import { GestureResponderEvent, LayoutChangeEvent, ScrollView, View } from "react-native";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";
import { KEYS } from "@/constants/Keys";

import ListItemGroup from "@/components/container/ListItemGroup";
import ListItemDropdown, { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";

import ListDropdownStyle from "@/styles/components/lists/ListDropdown";
import TouchableHaptic from "../button/TouchableHaptic";

export const DEFAULT_WIDTH = 260;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.43
 * @version 0.0.2
 * @type */
export type ListDropdownProps = {
  title: string;
  items: ListItemDropdownProps[];
  selectedItem: ListItemDropdownProps;
  width?: number;
  isScrollEnabled?: boolean;
  onPressItem: (item: ListItemDropdownProps) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.43
 * @version 0.0.2
 * @param {ListDropdownProps} param0
 * @param {string} param0.title - The title of the dropdown list
 * @param {ListItemDropdownProps[]} param0.items - The items of the dropdown list
 * @param {ListItemDropdownProps} param0.selectedItem - The selected item of the dropdown list
 * @param {number} param0.width - The width of the dropdown list
 * @param {boolean} param0.isScrollEnabled - Whether the scroll view is enabled
 * @param {Function} param0.onLayout - Callback function when the layout changes (re-rendered)
 * @component */
const ListDropdown = ({
  title,
  items,
  selectedItem,
  width = DEFAULT_WIDTH,
  isScrollEnabled = false,
  onPressItem,
  onLayout,
}: ListDropdownProps) => {
  const { primaryBgColor } = useThemeColors();

  /**
   * @description Internal function to call the onPressItem function
   * @param {ListItemDropdownProps} item - The dropdown item to press
   * @param {GestureResponderEvent} e - Gesture responder event
   * @function */
  const onPressItemInternal = 
  (item: ListItemDropdownProps) => 
  (e: GestureResponderEvent) => onPressItem(item);

  return (
    <View 
      onLayout={onLayout}
      style={[ListDropdownStyle.view, { 
        width, 
        backgroundColor: primaryBgColor
      }]}>
      <ListItemGroup
        title={title}
        gap={STYLES.sizeGap * 1.75}
        style={{ padding: 6 }} />
      <ScrollView
        scrollEnabled={isScrollEnabled}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 4 }}>
          {items.map((item, index) => 
            <TouchableHaptic 
              key={`${KEYS.listDropdownItem}-${index}`}
              onPress={onPressItemInternal(item)}>
              <ListItemDropdown 
                {...item}
                isSelected={selectedItem.itemKey === item.itemKey} />
            </TouchableHaptic>
          )}
      </ScrollView>
    </View>
  );
}

export default ListDropdown;