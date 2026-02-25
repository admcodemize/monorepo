import React from "react";
import { TextInput, View } from "react-native";
import { t } from "i18next";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faGlobePointer } from "@fortawesome/pro-thin-svg-icons";
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
 * @version 0.0.2
 * @type */
export type InputInvitationSlugProps = {
  onChangeValue: (value: string) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a input text component for the invitation limit of the event type
 * @since 0.0.58
 * @version 0.0.4
 * @param {InputInvitationSlugProps} param0 
 * @component */
const InputInvitationSlug = ({
  onChangeValue,
}: InputInvitationSlugProps) => {
  const { infoColor, labelColor, errorColor } = useThemeColors();
  const [value, setValue] = React.useState<string>("");

  /**
   * @description Used to handle the change event of the input field
   * @param {string} value - The new value of the input field
   * @function */
  const onChangeValueInternal = (value: string) => {
    setValue(value);
    onChangeValue(value);
  };

  return (
    <View style={[GlobalWorkflowStyle.touchableParent, {
      gap: 6,
      height: "auto",
    }]}>
      <View style={[GlobalContainerStyle.rowCenterBetween, { height: 32 }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
          <FontAwesomeIcon 
            icon={faGlobePointer as IconProp} 
            size={STYLES.sizeFaIcon} 
            color={infoColor} />
          <TextBase
            text={t("i18n.screens.eventType.bookingPage.invitationSlug.title")} 
            style={{ color: infoColor }} />
          <TextBase 
            text={t("./mstoeckli7/")} 
            style={{ color: labelColor }} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeValueInternal}
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
      <TextBase
        text={t("i18n.screens.eventType.bookingPage.invitationSlug.description")}
        type="label"
        style={{ color: errorColor, paddingBottom: 6 }} />
    </View>
  );
};

export default InputInvitationSlug;