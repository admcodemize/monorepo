import React from "react";
import { TextInput, View } from "react-native";
import { t } from "i18next";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faHand } from "@fortawesome/pro-thin-svg-icons";
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
 * @since 0.0.58
 * @version 0.0.1
 * @type */
export type InputInvitationLimitProps = {
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a input text component for the invitation limit of the event type
 * @since 0.0.58
 * @version 0.0.3
 * @param {InputInvitationLimitProps} param0 
 * @component */
const InputInvitationLimit = ({
}: InputInvitationLimitProps) => {
  const { secondaryBgColor, infoColor } = useThemeColors();
  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        //backgroundColor: secondaryBgColor,
      }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
          <FontAwesomeIcon 
            icon={faHand as IconProp} 
            size={STYLES.sizeFaIcon} 
            color={infoColor} />
          <TextBase
            text={"Maximale Anzahl der Teilnehmer"} 
            style={{ color: infoColor }} />
        </View>
        <TextInput
          placeholder={t("10")}
          cursorColor={infoColor}
          selectionColor={infoColor}
          style={[GlobalTypographyStyle.inputText, {
            textAlign: "right",
            color: infoColor,
            flexGrow: 1
          }]} />
      </View>
  );
};

export default InputInvitationLimit;