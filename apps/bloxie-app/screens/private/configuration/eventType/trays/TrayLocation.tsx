
import TrayContainer from "@/components/container/TrayContainer";
import React from "react";
import ListEventTypeLocation from "../lists/ListEventTypeLocation";
import { GestureResponderEvent, View } from "react-native";
import TouchableHapticAvailability from "@/components/button/eventType/TouchableHapticAvailability";
import { faClock, faCouch, faHeadset, faInputText, faMapPin, faMobileScreenButton } from "@fortawesome/pro-thin-svg-icons";
import Divider from "@/components/container/Divider";
import InputInvitationSlug from "@/components/input/eventType/InputInvitationSlug";
import { LocationEnum } from "@/components/button/eventType/TouchableHapticLocation";
import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import TouchableHapticAddItem, { TouchableHapticAddItemTypeEnum } from "@/components/button/eventType/TouchableHapticAddItem";
import { faBriefcase, faMapLocation } from "@fortawesome/pro-thin-svg-icons";
import ListDropdown from "@/components/lists/ListDropdown";
import { DROPDOWN_DURATION_ITEMS, EVENT_TYPE_LOCATIONS } from "@/constants/Models";
import { useDropdown } from "@/hooks/button/useDropdown";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { t } from "i18next";
import TextBase from "@/components/typography/Text";
import DropdownOverlay from "@/components/container/DropdownOverlay";
import TouchableHapticText from "@/components/button/TouchableHapticText";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import { useTrays } from "react-native-trays";
import InputWithLabel from "@/components/input/InputWithLabel";

export type ScreenTrayLocationInputs = {
  [LocationEnum.OFFICE]: string[];
  [LocationEnum.ADDRESS]: string[];
  [LocationEnum.PHONE]: string[];
  [LocationEnum.CUSTOM]: string[];
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.60
 * @version 0.0.1
 * @component */
export type ScreenTrayLocationProps = {
  onAfterSave: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.60
 * @version 0.0.1
 * @param {ScreenTrayLocationProps} param0
 * @component */
const ScreenTrayLocation = ({
  onAfterSave,
}: ScreenTrayLocationProps) => {
  const refContainer = React.useRef<View>(null);
  const refTimePeriod = React.useRef<View>(null);
  const { tertiaryBgColor, labelColor, linkColor, infoColor } = useThemeColors();

  const [items, setItems] = React.useState<ListItemDropdownProps[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<ListItemDropdownProps>(EVENT_TYPE_LOCATIONS.find((item) => item.itemKey === LocationEnum.ADDRESS)!);

  const [inputs, setInputs] = React.useState<ScreenTrayLocationInputs>({
    [LocationEnum.OFFICE]: [],
    [LocationEnum.ADDRESS]: [],
    [LocationEnum.PHONE]: [],
    [LocationEnum.CUSTOM]: [],
  });

  const { dismiss } = useTrays('keyboard');

  React.useEffect(() => {
    console.log("inputs", inputs);
  }, [inputs]);

  const addInput = (location: LocationEnum) => {
    setInputs((prev) => ({
      ...prev,
      [location]: [...(prev[location as keyof ScreenTrayLocationInputs] ?? []), ""],
    }));
  };

  const updateInput = (location: LocationEnum, index: number, text: string) => {
    setInputs((prev) => {
      const updated = [...(prev[location as keyof ScreenTrayLocationInputs] ?? [])];
      updated[index] = text;
      return { ...prev, [location]: updated };
    });
  };

  const removeInput = (location: LocationEnum, index: number) => {
    setInputs((prev) => {
      const updated = (prev[location as keyof ScreenTrayLocationInputs] ?? []).filter((_, i) => i !== index);
      return { ...prev, [location]: updated };
    });
  };

  const onSave = () => {
    const cleaned: ScreenTrayLocationInputs = {
      [LocationEnum.OFFICE]: inputs[LocationEnum.OFFICE].filter((v) => v.trim() !== ""),
      [LocationEnum.ADDRESS]: inputs[LocationEnum.ADDRESS].filter((v) => v.trim() !== ""),
      [LocationEnum.PHONE]: inputs[LocationEnum.PHONE].filter((v) => v.trim() !== ""),
      [LocationEnum.CUSTOM]: inputs[LocationEnum.CUSTOM].filter((v) => v.trim() !== ""),
    };
    console.log("Saved inputs:", cleaned);
    onAfterSave();
  };
  
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
        title={t("Ausgewählte Orte")} 
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

  const onPressAddItem = 
  (itemKey: LocationEnum) => {
    console.log("onPressAddItem", itemKey);
    if (items.find((item) => item.itemKey === itemKey)) return;

    setItems([...items, EVENT_TYPE_LOCATIONS.find((item) => item.itemKey === itemKey)!]);
    if (items.length === 0) {
      setSelectedItem(EVENT_TYPE_LOCATIONS.find((item) => item.itemKey === itemKey)!);
    }
  }

  const onStateChange = 
  (state: boolean) => {
    if (state) onPressAddItem(LocationEnum.GOOGLE_MEET);
    else {
      setItems(items.filter((item) => item.itemKey !== LocationEnum.GOOGLE_MEET));
      setSelectedItem(items[0] || EVENT_TYPE_LOCATIONS.find((item) => item.itemKey === LocationEnum.ADDRESS)!);
    }
  }

  return (
    <View ref={refContainer}>
    <TrayContainer 
      title={"i18n.screens.trayLocation.title"} 
      description={"i18n.screens.trayLocation.description"}
      paddingHorizontal={0}>
        <View style={{ paddingHorizontal: 10, gap: 4 }}>
            <View style={[GlobalContainerStyle.rowCenterBetween, { paddingBottom: 4, paddingHorizontal: 4 }]}>  
              <TextBase text={"Primärer Ort:"} type="label" style={{ color: labelColor }} />
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
          <View style={{ gap: 0 }}>        
            <TouchableHapticAddItem 
              text="Büroräumlichkeit hinzufügen" 
              icon={faBriefcase as IconProp} 
              onPress={() => { onPressAddItem(LocationEnum.OFFICE); addInput(LocationEnum.OFFICE); }} />
            {inputs[LocationEnum.OFFICE].map((input, index) => (
              <InputWithLabel 
                key={`office-${index}`}
                icon={faCouch as IconProp} 
                textAlign="left"
                placeholder="Sitzungszimmer BA.3, 2. Stock" 
                value={input} 
                onChangeText={(text) => updateInput(LocationEnum.OFFICE, index, text)}
                onPressRemove={() => removeInput(LocationEnum.OFFICE, index)} />
            ))}
          </View>
          <View style={{ gap: 0 }}>        
            <TouchableHapticAddItem 
              text="Geschäfts-/Privatadresse hinzufügen" 
              icon={faMapPin as IconProp} 
              onPress={() => { onPressAddItem(LocationEnum.ADDRESS); addInput(LocationEnum.ADDRESS); }} />
            {inputs[LocationEnum.ADDRESS].map((input, index) => (
              <InputWithLabel 
                key={`address-${index}`}
                icon={faMapLocation as IconProp} 
                textAlign="left"
                placeholder="Victoria Square, Perth WA 6000, Australia" 
                value={input} 
                onChangeText={(text) => updateInput(LocationEnum.ADDRESS, index, text)}
                onPressRemove={() => removeInput(LocationEnum.ADDRESS, index)} />
            ))}
          </View>
          <View style={{ gap: 0 }}>        
            <TouchableHapticAddItem 
              text="Google Meet-Besprechung hinzufügen" 
              icon={faHeadset as IconProp} 
              type={TouchableHapticAddItemTypeEnum.SWITCH}
              onStateChange={onStateChange} />
          </View>
          <View style={{ gap: 0 }}>        
            <TouchableHapticAddItem 
              text="Telefonnummer hinzufügen" 
              icon={faMobileScreenButton as IconProp} 
              disabled={inputs[LocationEnum.PHONE].length >= 1}
              onPress={() => { onPressAddItem(LocationEnum.PHONE); addInput(LocationEnum.PHONE); }} />
            {inputs[LocationEnum.PHONE].map((input, index) => (
              <InputWithLabel 
                key={`phone-${index}`}
                icon={faMobileScreenButton as IconProp} 
                textAlign="left"
                placeholder="+41 79 123 45 67" 
                value={input} 
                onChangeText={(text) => updateInput(LocationEnum.PHONE, index, text)}
                onPressRemove={() => removeInput(LocationEnum.PHONE, index)} />
            ))}
          </View>
          <View style={{ gap: 0 }}>        
            <TouchableHapticAddItem 
              text="Benutzerdefinierter Ort hinzufügen" 
              icon={faInputText as IconProp} 
              onPress={() => { onPressAddItem(LocationEnum.CUSTOM); addInput(LocationEnum.CUSTOM); }} />
            {inputs[LocationEnum.CUSTOM].map((input, index) => (
              <InputWithLabel 
                key={`custom-${index}`}
                icon={faInputText as IconProp} 
                textAlign="left"
                placeholder="z.B. Zoom-Link, Treffpunkt..." 
                value={input} 
                onChangeText={(text) => updateInput(LocationEnum.CUSTOM, index, text)}
                onPressRemove={() => removeInput(LocationEnum.CUSTOM, index)} />
            ))}
          </View>

        </View>
        <View style={[GlobalContainerStyle.rowCenterEnd, { paddingVertical: 4, paddingHorizontal: 12, paddingTop: 14, gap: 20 }]}>
        <TouchableHaptic
          onPress={() => { dismiss('TrayLocation')}}>
            <TextBase text="Abbrechen" style={{ color: infoColor }} />
        </TouchableHaptic>
        <TouchableHaptic
          onPress={onSave}>
            <TextBase text="Speichern" style={{ color: linkColor }} />
        </TouchableHaptic>
        </View>
    </TrayContainer>
    <DropdownOverlay hostId="tray" />
    </View>
  );
};

export default ScreenTrayLocation;