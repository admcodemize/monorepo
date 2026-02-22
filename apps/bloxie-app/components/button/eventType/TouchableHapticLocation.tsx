import React from "react";
import { View } from "react-native";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faMapPin } from "@fortawesome/pro-thin-svg-icons";
import { useTrays } from "react-native-trays";

import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { EVENT_TYPE_LOCATIONS } from "@/constants/Models";

import TextBase from "@/components/typography/Text";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";
import { ScreenTrayLocationInputs } from "@/screens/private/configuration/eventType/trays/TrayLocation";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.63
 * @version 0.0.1
 * @enum */
export enum LocationEnum {
  OFFICE = "office",
  ADDRESS = "address",
  GOOGLE_MEET = "googleMeet",
  PHONE = "phone",
  CUSTOM = "custom",
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.2
 * @type */
export type TouchableHapticLocationProps = {
  onChangeValues: (locations: ScreenTrayLocationInputs) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.58
 * @version 0.0.1
 * @param {TouchableHapticLocationProps} param0 
 * @param {Function} param0.onChangeValues - Callback function when user changed the values of the locations
 * @component */
const TouchableHapticLocation = ({
  onChangeValues,
}: TouchableHapticLocationProps) => {
  const refLocation = React.useRef<View>(null);
  const { secondaryBgColor, tertiaryBgColor, infoColor, labelColor } = useThemeColors();
  const { push, dismiss } = useTrays('keyboard');

  const [locations, setLocations] = React.useState<ScreenTrayLocationInputs>();
  const [primary, setPrimary] = React.useState<LocationEnum|undefined>(undefined);

  /**
   * @description Used to open the location tray for adding one or more locations
   * @function */
  const onPressLocation = () => {
    push('TrayLocation', {
      primary: primary,
      locations: locations,
      onAfterSave: (primary: LocationEnum, locations: ScreenTrayLocationInputs) => {
        dismiss('TrayLocation');
        setPrimary(primary);
        setLocations(locations);
        onChangeValues(locations);
      },
    });
  } 

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: secondaryBgColor,
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faMapPin as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={t("i18n.buttons.location.title")} 
          style={{ color: infoColor }} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 2 }]}>
        <TextBase
          text={`${t("i18n.buttons.location.primary")}: `}
          type="label"
          style={{ color: labelColor }} />
        <TouchableHapticDropdown
          ref={refLocation}
          text={t(EVENT_TYPE_LOCATIONS.find((item) => item.itemKey === primary)?.title ?? "i18n.screens.trayLocation.dropdownPlaceholder")}
          backgroundColor={tertiaryBgColor}
          hasViewCustomStyle
          textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
          onPress={onPressLocation}/>
      </View>
    </View>
  );
};

export default TouchableHapticLocation;