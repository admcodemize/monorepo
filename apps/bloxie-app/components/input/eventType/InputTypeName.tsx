import React from "react";
import { TextInput, View } from "react-native";
import { t } from "i18next";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { shadeColor } from "@codemize/helpers/Colors";
import { ConvexWorkflowQueryAPIProps } from "@codemize/backend/Types";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { WORKFLOW_TRIGGER_ITEMS } from "@/constants/Models";

import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import TextBase from "@/components/typography/Text";
import ListDropdown from "@/components/lists/ListDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { STYLES } from "@codemize/constants/Styles";
import { faInputText, faSignature } from "@fortawesome/duotone-thin-svg-icons";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import DottedBackground from "@/components/container/DottedBackground";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.57
 * @version 0.0.1
 * @type */
export type InputTypeNameProps = {
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a input text component for the name of the event type
 * @since 0.0.57
 * @version 0.0.2
 * @param {InputTypeNameProps} param0 
 * @component */
const InputTypeName = ({
}: InputTypeNameProps) => {
  const { secondaryBgColor, infoColor } = useThemeColors();

  return (
    <>
    <DottedBackground />
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: shadeColor(secondaryBgColor, 0.3),
      }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
          <FontAwesomeIcon icon={faSignature as IconProp} size={STYLES.sizeFaIcon} color={infoColor} />
          <TextBase
            text={"Name des Ereignistyp"} 
            type="label" 
            style={{ color: infoColor }} />
        </View>
        <TextInput
          placeholder={t("Ereignistyp 1")}
          cursorColor={infoColor}
          selectionColor={infoColor}
          style={[GlobalTypographyStyle.inputText, {
            textAlign: "right",
            color: infoColor,
            flexGrow: 1
          }]} />
      </View>
    </>
  );
};

export default InputTypeName;