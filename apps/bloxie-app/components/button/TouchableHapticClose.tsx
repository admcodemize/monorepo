import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faXmark } from "@fortawesome/pro-solid-svg-icons"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

import { STYLES } from "@codemize/constants/Styles"

import { useThemeColors } from "@/hooks/theme/useThemeColor"

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
 * @version 0.0.1 
 * @component */
const TouchableHapticClose = ({
  onPress,
}: TouchableHapticCloseProps) => {
  const colors = useThemeColors();

  /**
   * @description Handles the on press event for the close button
   * @function */
  const onPressClose = React.useCallback(() => onPress(), [onPress]);

  return (
    <TouchableHaptic
      onPress={onPressClose}
      style={[TouchableHapticCloseStyle.close, { 
        borderColor: colors.secondaryBorderColor,
        backgroundColor: colors.tertiaryBgColor 
      }]}>
        <FontAwesomeIcon
          icon={faXmark as IconProp}
          size={STYLES.sizeFaIcon - 2}
          color={colors.secondaryIconColor} />
    </TouchableHaptic>
  )
}

export default TouchableHapticClose;