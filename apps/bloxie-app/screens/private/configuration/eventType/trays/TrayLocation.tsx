
import TrayContainer from "@/components/container/TrayContainer";
import React from "react";
import ListEventTypeLocation from "../lists/ListEventTypeLocation";
import { View } from "react-native";
import TouchableHapticAvailability from "@/components/button/eventType/TouchableHapticAvailability";
import { faClock, faHeadset, faInputText, faMapPin, faMobileScreenButton } from "@fortawesome/pro-thin-svg-icons";
import Divider from "@/components/container/Divider";
import InputInvitationSlug from "@/components/input/eventType/InputInvitationSlug";
import InputAddress from "@/components/input/eventType/InputAddress";
import { LocationEnum } from "@/components/button/eventType/TouchableHapticLocation";
import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import TouchableHapticAddItem from "@/components/button/eventType/TouchableHapticAddItem";
import { faBriefcase, faMapLocation } from "@fortawesome/pro-thin-svg-icons";
import ListDropdown from "@/components/lists/ListDropdown";
import { DROPDOWN_DURATION_ITEMS } from "@/constants/Models";
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

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.60
 * @version 0.0.1
 * @component */
export type ScreenTrayLocationProps = {
  refContainer: React.RefObject<View|null>;
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
  refContainer,
  onAfterSave,
}: ScreenTrayLocationProps) => {
  const refTimePeriod = React.useRef<View>(null);
  const { tertiaryBgColor, labelColor, linkColor, infoColor } = useThemeColors();
  const [selectedItem, setSelectedItem] = React.useState<ListItemDropdownProps>({
    title: "Arbeitszeitplan",
    description: "Arbeitszeitplan",
    icon: faClock,
    itemKey: "availability",
  });
  const [locations, setLocations] = React.useState<string[]>([]);

  
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
        title={t("Buchung in Zukunft")} 
        items={[selectedItem]}
        width={140}
        selectedItem={selectedItem}
        onPressItem={(item) => {
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
      open,
      children: children(),
    });
  }


  return (
    <View>
    <TrayContainer 
      title={"i18n.screens.trayLocation.title"} 
      description={"i18n.screens.trayLocation.description"}
      paddingHorizontal={0}>
        <View style={{ paddingHorizontal: 10, gap: 4 }}>
            <View style={[GlobalContainerStyle.rowCenterBetween, { paddingBottom: 4, paddingHorizontal: 4 }]}>  
              <TextBase text={"Primäre Räumlichkeit:"} type="label" style={{ color: labelColor }} />
              <TouchableHapticDropdown
                ref={refTimePeriod}
                text={"Geschäfts-/Privatadresse"}
                backgroundColor={tertiaryBgColor}
                hasViewCustomStyle
                textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
                viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
                onPress={onPressDropdown}/>
            </View>
          <View style={{ gap: 0 }}>        
            <TouchableHapticAddItem 
              text="Büroräumlichkeit hinzufügen" 
              icon={faBriefcase as IconProp} 
              onPress={() => {}} />
          </View>
          <View style={{ gap: 4 }}>        
            <TouchableHapticAddItem 
              text="Geschäfts-/Privatadresse hinzufügen" 
              icon={faMapPin as IconProp} 
              onPress={() => {}} />
            <InputAddress />
          </View>
          <View style={{ gap: 0 }}>        
            <TouchableHapticAddItem 
              text="Google Meet-Besprechung hinzufügen" 
              icon={faHeadset as IconProp} 
              onPress={() => {}} />
          </View>
          <View style={{ gap: 0 }}>        
            <TouchableHapticAddItem 
              text="Telefonnummer hinzufügen" 
              icon={faMobileScreenButton as IconProp} 
              onPress={() => {}} />
          </View>
          <View style={{ gap: 0 }}>        
            <TouchableHapticAddItem 
              text="Benutzerdefinierte Räumlichkeit hinzufügen" 
              icon={faInputText as IconProp} 
              onPress={() => {}} />
          </View>

        </View>
        <View style={[GlobalContainerStyle.rowCenterEnd, { paddingVertical: 4, paddingHorizontal: 12, paddingTop: 14, gap: 20 }]}>
        <TouchableHaptic
          onPress={() => {}}>
            <TextBase text="Abbrechen" style={{ color: infoColor }} />
        </TouchableHaptic>
        <TouchableHaptic
          onPress={() => {}}>
            <TextBase text="Speichern" style={{ color: linkColor }} />
        </TouchableHaptic>
        </View>
    </TrayContainer>
    <DropdownOverlay hostId="tray" />
    </View>
  );
};

export default ScreenTrayLocation;