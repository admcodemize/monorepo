
import React from "react";
import { View } from "react-native";
import { faHeadset, faInputText } from "@fortawesome/pro-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { t } from "i18next";
import { useTrays } from "react-native-trays";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { EVENT_TYPE_LOCATIONS } from "@/constants/Models";

import TrayContainer from "@/components/container/TrayContainer";
import { LocationEnum } from "@/components/button/eventType/TouchableHapticLocation";
import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import TouchableHapticAddItem, { TouchableHapticAddItemTypeEnum } from "@/components/button/eventType/TouchableHapticAddItem";
import ListDropdown from "@/components/lists/ListDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";
import TextBase from "@/components/typography/Text";
import DropdownOverlay from "@/components/container/DropdownOverlay";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import InputWithLabel from "@/components/input/InputWithLabel";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.60
 * @version 0.0.1
 * @type */
export type ScreenTrayLocationInputs = {
  [LocationEnum.OFFICE]: string[];
  [LocationEnum.ADDRESS]: string[];
  [LocationEnum.PHONE]: string[];
  [LocationEnum.CUSTOM]: string[];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.62
 * @version 0.0.1
 * @type */
export type ScreenTrayLocationInputsProps = {
  locationKey: LocationEnum;
  text: string;
  icon: IconProp;
  placeholder: string;
  inputs: ScreenTrayLocationInputs;
  insert: (location: LocationEnum) => void;
  update: (location: LocationEnum, index: number, text: string) => void;
  remove: (location: LocationEnum, index: number) => void;
  onPressInsert: (location: LocationEnum) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.60
 * @version 0.0.2
 * @component */
export type ScreenTrayLocationProps = {
  primary?: LocationEnum;
  locations?: ScreenTrayLocationInputs;
  onAfterSave: (primary: LocationEnum, locations: ScreenTrayLocationInputs) => void;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.63
 * @version 0.0.1
 * @constant */
const LOCATION_EMPTY_PLACEHOLDER_ITEM: ListItemDropdownProps = {
  itemKey: "",
  title: "i18n.screens.trayLocation.dropdownPlaceholder",
};

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.63
 * @version 0.0.1
 * @constant */
const LOCATION_ITEM_PLACEHOLDERS: Record<LocationEnum, string> = {
  [LocationEnum.OFFICE]: "Sitzungszimmer BA.3, 2. Stock",
  [LocationEnum.ADDRESS]: "Victoria Square, Perth WA 6000, Australia",
  [LocationEnum.PHONE]: "+41 79 123 45 67",
  [LocationEnum.GOOGLE_MEET]: "Google Meet-Besprechung",
  [LocationEnum.CUSTOM]: "z.B. Zoom-Link, Treffpunkt...",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.60
 * @version 0.0.1
 * @param {ScreenTrayLocationProps} param0
 * @param {LocationEnum} param0.primary - The primary location to display
 * @param {ScreenTrayLocationInputs} param0.locations - The locations to display
 * @param {Function} param0.onAfterSave - Callback function to save the locations
 * @component */
const ScreenTrayLocation = ({
  primary,
  locations,
  onAfterSave,
}: ScreenTrayLocationProps) => {
  const refContainer = React.useRef<View>(null);
  const refTimePeriod = React.useRef<View>(null);
  const { tertiaryBgColor, labelColor, linkColor, infoColor } = useThemeColors();
  
  const { dismiss } = useTrays('keyboard');

  /** @description Used to initialize the inputs for the tray based on the locations passed to the tray */
  const initialInputs: ScreenTrayLocationInputs = locations || {
    [LocationEnum.OFFICE]: [],
    [LocationEnum.ADDRESS]: [],
    [LocationEnum.PHONE]: [],
    [LocationEnum.CUSTOM]: [],
  };

  /** @description Used to initialize the items for the dropdown */
  const initialItems: ListItemDropdownProps[] = ([LocationEnum.OFFICE, LocationEnum.ADDRESS, LocationEnum.PHONE, LocationEnum.CUSTOM] as (keyof ScreenTrayLocationInputs)[])
    .filter((key) => initialInputs[key]?.length > 0)
    .map((key) => EVENT_TYPE_LOCATIONS.find((item) => item.itemKey === key)!)
    .filter(Boolean);

  const [items, setItems] = React.useState<ListItemDropdownProps[]>(initialItems);
  const [selectedItem, setSelectedItem] = React.useState<ListItemDropdownProps>(EVENT_TYPE_LOCATIONS.find((item) => item.itemKey === primary) ?? initialItems[0] ?? LOCATION_EMPTY_PLACEHOLDER_ITEM);
  const [inputs, setInputs] = React.useState<ScreenTrayLocationInputs>(initialInputs);

  /**
   * @description Adds an input for a specific location
   * @param {LocationEnum} location - The location to add an input for
   * @function */
  const insert = 
  (location: LocationEnum) => setInputs((prev) => ({
    ...prev,
    [location]: [...(prev[location as keyof ScreenTrayLocationInputs] ?? []), ""],
  }));

  /**
   * @description Updates an input for a specific location
   * @param {LocationEnum} location - The location to update an input for
   * @param {number} index - The index of the input to update
   * @param {string} text - The text to update the input with
   * @function */
  const update = (
    location: LocationEnum, 
    index: number, 
    text: string
  ) => setInputs((prev) => ({ ...prev, [location]: (prev[location as keyof ScreenTrayLocationInputs] ?? []).map((v, i) => i === index ? text : v) }));

  /**
   * @description Removes an item from the dropdown and updates the selected item to the first remaining item or the placeholder
   * @param {LocationEnum} location - The location to remove from the dropdown
   * @function */
  const removeItem = (location: LocationEnum) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.itemKey !== location);
      setSelectedItem(filtered[0] ?? LOCATION_EMPTY_PLACEHOLDER_ITEM);
      return filtered;
    });
  };

  /**
   * @description Removes an input for a specific location. If no inputs remain, the location is also removed from the dropdown.
   * @param {LocationEnum} location - The location to remove an input for
   * @param {number} index - The index of the input to remove
   * @function */
  const remove = (
    location: LocationEnum, 
    index: number
  ) => setInputs((prev) => {
    const updated = (prev[location as keyof ScreenTrayLocationInputs] ?? []).filter((_, i) => i !== index);
    if (updated.length === 0) removeItem(location);
    return { ...prev, [location]: updated };
  });
  
  /**
   * @description Get the dropdown functions for displaying the available triggers.
   * @see {@link hooks/button/useDropdown} */
  const { state: { open, close }, open: _open } = useDropdown();

  /**
   * @description Returns the children (dropdown items as a scrollable list)for the dropdown component
   * @function */
  const children = () => {
    return (
      <ListDropdown
        title={t("i18n.screens.trayLocation.dropdownPlaceholder")} 
        items={items}
        width={320}
        selectedItem={selectedItem}
        onPressItem={(item) => {
          setSelectedItem(item);
          close();
        }} />
    );
  }

  /**
   * @description Used to open the dropdown component
   * @function */
  const onPressDropdown = () => {
    /** 
     * @description Open the dropdown component based on a calculated measurement template
     * @see {@link components/button/TouchableDropdown} */
    _open({
      refTouchable: refTimePeriod,
      relativeToRef: refContainer,
      paddingHorizontal: 12 - 2, 
      hostId: "tray",
      open,
      children: children(),
    });
  }

  /**
   * @description Used to dismiss the tray
   * @function */
  const onPressCancel = () => dismiss('TrayLocation');

  /**
   * @description Used to insert a new item into the dropdown
   * @param {LocationEnum} itemKey - The key of the item to insert
   * @function */
  const onPressInsert = 
  (itemKey: LocationEnum) => {
    setItems((prev) => {
      /** @description If the item already exists, do not insert it again -> duplicate prevention */
      if (prev.find((item) => item.itemKey === itemKey)) return prev;

      /** @description Insert the item into the dropdown and if the dropdown is empty, set the selected item to the first item */
      const newItem = EVENT_TYPE_LOCATIONS.find((item) => item.itemKey === itemKey)!;
      if (prev.length === 0) setSelectedItem(newItem);
      return [...prev, newItem];
    });
  }

  /**
   * @description Used to save the locations and return the locations back to the parent component 
   * @see {@link components/button/eventType/TouchableHapticLocation.tsx}
   * @function */
  const onSave = () => {
    onAfterSave(selectedItem.itemKey as LocationEnum, {
      [LocationEnum.OFFICE]: inputs[LocationEnum.OFFICE].filter((v) => v.trim() !== ""),
      [LocationEnum.ADDRESS]: inputs[LocationEnum.ADDRESS].filter((v) => v.trim() !== ""),
      [LocationEnum.PHONE]: inputs[LocationEnum.PHONE].filter((v) => v.trim() !== ""),
      [LocationEnum.CUSTOM]: inputs[LocationEnum.CUSTOM].filter((v) => v.trim() !== ""),
    });
  };

  /**
   * @description Used to handle the state change of the google meet switch
   * @param {boolean} state - The state of the google meet switch
   * @function */
  const onStateChange = 
  (state: boolean) => {
    if (state) onPressInsert(LocationEnum.GOOGLE_MEET);
    else removeItem(LocationEnum.GOOGLE_MEET);
  }

  return (
    <View ref={refContainer}>
    <TrayContainer 
      title="i18n.screens.trayLocation.title"
      description="i18n.screens.trayLocation.description"
      paddingHorizontal={0}>
        <View style={{ paddingHorizontal: 10, gap: 4 }}>
          <View style={[GlobalContainerStyle.rowCenterBetween, { paddingBottom: 4, paddingHorizontal: 4 }]}>  
            <TextBase 
              text="i18n.screens.trayLocation.primary"
              type="label" 
              style={{ color: labelColor }} />
            <TouchableHapticDropdown
              ref={refTimePeriod}
              text={selectedItem.title}
              backgroundColor={tertiaryBgColor}
              disabled={items.length === 0}
              hasViewCustomStyle
              textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
              viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
              onPress={onPressDropdown}/>
          </View>
          <TouchableHapticAddItem 
            text={LOCATION_ITEM_PLACEHOLDERS[LocationEnum.GOOGLE_MEET]}
            icon={faHeadset as IconProp} 
            type={TouchableHapticAddItemTypeEnum.SWITCH}
            onStateChange={onStateChange} />
          {EVENT_TYPE_LOCATIONS
          .filter((item) => item.itemKey !== LocationEnum.GOOGLE_MEET)
          .map((item) => 
            <ScreenTrayLocationInputs
              key={item.itemKey}
              locationKey={item.itemKey as LocationEnum}
              text={item.title}
              icon={item.icon as IconProp}
              placeholder={LOCATION_ITEM_PLACEHOLDERS[item.itemKey as LocationEnum]}
              inputs={inputs}
              insert={insert}
              update={update}
              remove={remove}
              onPressInsert={onPressInsert} />
            /*item.itemKey === LocationEnum.PHONE && items.find((item) => item.itemKey === LocationEnum.PHONE) && <TouchableHaptic>
              <View style={[GlobalContainerStyle.rowCenterBetween, { paddingLeft: 10, paddingRight: 4 }]}>
                <TextBase 
                  text="Erforderliche Eingabe durch Teilnehmer"
                  type="label"
                  style={{ color: infoColor }} />
                <TouchableHapticSwitch
                  state={false}
                  onStateChange={() => {}} />
              </View>
            </TouchableHaptic>*/
            )}
        </View>
        <View style={[GlobalContainerStyle.rowCenterEnd, { paddingVertical: 4, paddingHorizontal: 12, paddingTop: 14, gap: 20 }]}>
          <TouchableHaptic onPress={onPressCancel}>
            <TextBase 
              text="i18n.buttons.cancel" 
              style={{ color: infoColor }} />
          </TouchableHaptic>
          <TouchableHaptic onPress={onSave}>
            <TextBase 
              text="i18n.buttons.save" 
              style={{ color: linkColor }} />
          </TouchableHaptic>
        </View>
    </TrayContainer>
    <DropdownOverlay hostId="tray" />
    </View>
  );
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.63
 * @version 0.0.1
 * @param {ScreenTrayLocationInputsProps} param0
 * @param {LocationEnum} param0.locationKey - The key of the location to display
 * @param {string} param0.text - The text of the insert button to display
 * @param {IconProp} param0.icon - The icon of the insert button to display
 * @param {string} param0.placeholder - The placeholder of the input to display
 * @param {ScreenTrayLocationInputs} param0.inputs - The inputs to display (office, address, phone, custom)
 * @param {Function} param0.insert - Callback function to insert a new item
 * @param {Function} param0.update - Callback function to update an input
 * @param {Function} param0.remove - Callback function to remove an input
 * @param {Function} param0.onPressInsert - Callback function to insert a new item into the dropdown
 * @component */
const ScreenTrayLocationInputs = ({
  locationKey,
  text,
  icon,
  placeholder,
  inputs,
  insert,
  update,
  remove,
  onPressInsert,
}: ScreenTrayLocationInputsProps) => {
  /**
   * @description Used to insert a new item into the dropdown and add an input for the specific location
   * @function */
  const onPressInternal = () => {
    onPressInsert(locationKey);
    insert(locationKey);
  }

  return (
    <>
    <TouchableHapticAddItem 
      text={text} 
      icon={icon} 
      onPress={onPressInternal} />
    {inputs[locationKey as keyof ScreenTrayLocationInputs].map((input, index) => (
      <InputWithLabel 
        key={`${locationKey}-${index}`}
        icon={faInputText as IconProp} 
        textAlign="left"
        placeholder={placeholder} 
        value={input} 
        onChangeText={(text) => update(locationKey, index, text)}
        onPressRemove={() => remove(locationKey, index)} />
    ))}
    </>
  )
}

export default ScreenTrayLocation;