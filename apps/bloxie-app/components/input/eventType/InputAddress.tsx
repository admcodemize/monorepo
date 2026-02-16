import React from "react";
import { TextInput, View } from "react-native";
import { t } from "i18next";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faGlobePointer, faHand, faMapLocation } from "@fortawesome/pro-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.61
 * @version 0.0.1
 * @type */
export type InputAddressProps = {
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a input text component for the address of the event type
 * @since 0.0.61
 * @version 0.0.1
 * @param {InputAddressProps} param0 
 * @component */
const InputAddress = ({
}: InputAddressProps) => {
  const { infoColor } = useThemeColors();
  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        //backgroundColor: secondaryBgColor,
      }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
          <FontAwesomeIcon 
            icon={faMapLocation as IconProp} 
            size={STYLES.sizeFaIcon} 
            color={infoColor} />
          <TextBase
            text={"Adresse"} 
            style={{ color: infoColor }} />
        </View>
        <TextInput
          placeholder={t("Victora Square, Perth WA 6000, Australia")}
          multiline={false}
          numberOfLines={1}
          autoCapitalize="none"
          cursorColor={infoColor}
          selectionColor={infoColor}
          style={[GlobalTypographyStyle.inputText, {
            textAlign: "right",
            color: infoColor,
          }]} />
      </View>
  );
};

export default InputAddress;