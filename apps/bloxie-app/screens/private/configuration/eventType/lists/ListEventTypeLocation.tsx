import React from "react";
import { DimensionValue, GestureResponderEvent, ScrollView, View } from "react-native";

import { getLocalization, LanguageEnumProps, resolveRuntimeIcon } from "@/helpers/System";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useConfigurationContextStore } from "@/context/ConfigurationContext";
import { STYLES } from "@codemize/constants/Styles";
import { ConvexTemplateAPIProps } from "@codemize/backend/Types";

import ListItemGroup from "@/components/container/ListItemGroup";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import ListItemWithChildren, { ListItemWithChildrenTypeEnum } from "@/components/lists/item/ListItemWithChildren";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import { EVENT_TYPE_LOCATIONS } from "@/constants/Models";
import { LocationEnum } from "@/components/button/eventType/TouchableHapticLocation";
import { shadeColor } from "@codemize/helpers/Colors";
import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.61
 * @version 0.0.1
 * @component */
export type ListEventTypeLocationProps = {
  maxHeight?: DimensionValue;
  showListGroup?: boolean;
  onPress: (item: ListItemDropdownProps) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.61
 * @version 0.0.1
 * @param {ListEventTypeLocationProps} param0
 * @param {DimensionValue} param0.maxHeight - The maximum height of the scroll view
 * @param {boolean} param0.showListGroup - Whether to show the list group
 * @param {(item: ListItemDropdownProps) => void} param0.onPress - The function to call when a location is pressed
 * @component */
const ListEventTypeLocation = ({
  maxHeight = "100%",
  showListGroup = true,
  onPress,
}: ListEventTypeLocationProps) => {
  const { secondaryBgColor } = useThemeColors();
  const [selectedLocation, setSelectedLocation] = React.useState<LocationEnum>(LocationEnum.OFFICE);

  /** @description Internal function to call the onPress function */
  const onPressInternal = React.useCallback(
    (item: ListItemDropdownProps) => 
    (e: GestureResponderEvent) => {
      setSelectedLocation(item.itemKey as LocationEnum);
      onPress(item);
    }, [onPress]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ maxHeight, paddingHorizontal: 4 }}>
      {EVENT_TYPE_LOCATIONS.map((location) => (
        <TouchableHaptic 
          key={location.itemKey}
          onPress={onPressInternal(location)}
          style={{ backgroundColor: selectedLocation === location.itemKey ? shadeColor(secondaryBgColor, 0.2) : "transparent", paddingVertical: STYLES.paddingVertical - 4, paddingHorizontal: 8,
            borderRadius: 10,
           }}>
          <ListItemWithChildren
            title={location.title || ""}
            description={location.description || ""}
            type={ListItemWithChildrenTypeEnum.custom}
            icon={location.icon} />
        </TouchableHaptic>
      ))}
    </ScrollView>
  );
};

export default ListEventTypeLocation;