import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import TouchableHapticClose from "@/components/button/TouchableHapticClose";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type StackModalHeaderProps = {
  title: string;
  description?: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.2
 * @param {StackModalHeaderProps} param0
 * @param {string} param0.title - The title to display
 * @param {string} param0.description - The description to display
 * @component */
const StackModalHeader = ({
  title,
  description,
}: StackModalHeaderProps) => {
  const { infoColor } = useThemeColors();

  /**
   * @description Handles the on press event for the close/back button
   * @function */
  const onPressClose = React.useCallback(() => router.back(), []);

  return (
    <View style={{ paddingHorizontal: STYLES.paddingHorizontal, paddingBottom: STYLES.paddingVertical, gap: 4 }}>
      <View style={[GlobalContainerStyle.rowCenterBetween]}> 
        <TextBase 
          text={title}
          style={[GlobalTypographyStyle.headerSubtitle, { fontSize: 12 }]} />
        <TouchableHapticClose onPress={onPressClose} />
      </View>
      {description && <TextBase 
        type="label" 
        text={description} 
        numberOfLines={3}
        style={[GlobalTypographyStyle.labelText, { color: infoColor }]} />}
    </View>
  )
}

export default StackModalHeader;