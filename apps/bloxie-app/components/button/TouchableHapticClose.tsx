import React from "react"

import { useThemeColors } from "@/hooks/theme/useThemeColor"
import { useTranslation } from "react-i18next"

import TextBase from "@/components/typography/Text"
import TouchableHaptic from "@/components/button/TouchableHaptic"

import TouchableHapticCloseStyle from "@/styles/components/button/TouchableHapticClose"

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type TouchableHapticCloseProps = {
  onPress: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @component */
const TouchableHapticClose = ({
  onPress,
}: TouchableHapticCloseProps) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  
  /**
   * @description Handles the on press event for the close button
   * @function */
  const onPressClose = React.useCallback(() => onPress(), [onPress]);

  return (
    <TouchableHaptic
      onPress={onPressClose}
      style={[TouchableHapticCloseStyle.close]}>
        <TextBase
          text={t("i18n.buttons.close")}
          type="label"
          style={[{ color: colors.linkColor, fontSize: 12 }]} />
    </TouchableHaptic>
  )
}

export default TouchableHapticClose;