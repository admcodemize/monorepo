import React from "react";
import { TextInput, View } from "react-native";
import { t } from "i18next";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faGlobePointer, faHand } from "@fortawesome/pro-thin-svg-icons";
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
export type InputInvitationSlugProps = {
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a input text component for the invitation limit of the event type
 * @since 0.0.58
 * @version 0.0.3
 * @param {InputInvitationSlugProps} param0 
 * @component */
const InputInvitationSlug = ({
}: InputInvitationSlugProps) => {
  const { infoColor, textColor, labelColor } = useThemeColors();
  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        //backgroundColor: secondaryBgColor,
        gap: 0
      }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
          <FontAwesomeIcon 
            icon={faGlobePointer as IconProp} 
            size={STYLES.sizeFaIcon} 
            color={infoColor} />
          <TextBase
            text={"Slug"} 
            style={{ color: infoColor }} />
          <TextBase 
            text={t("bloxie.ch/mstoeckli7/")} 
            style={{ color: labelColor }} />
        </View>
        <TextInput
          placeholder={t("event-type-slug")}
          keyboardType="url"
          autoCapitalize="none"
          cursorColor={infoColor}
          selectionColor={infoColor}
          maxLength={20}
          style={[GlobalTypographyStyle.inputText, {
            textAlign: "right",
            color: infoColor,
            flexGrow: 1,
            height: "auto"
          }]} />
      </View>
  );
};

export default InputInvitationSlug;