import React from "react";
import { View } from "react-native";
import { t } from "i18next";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { shadeColor } from "@codemize/helpers/Colors";
import { STYLES } from "@codemize/constants/Styles";

import TextBase from "@/components/typography/Text";
import TouchableHapticSwitch from "@/components/button/TouchableHapticSwitch";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import Divider from "@/components/container/Divider";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import { useTrays } from "react-native-trays";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @type */
export type TouchableHapticCancellationTermsProps = {
  onPress: (selected: boolean) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.46
 * @version 0.0.2
 * @param {TouchableHapticCancellationTermsProps} param0 
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @component */
const TouchableHapticCancellationTerms = ({
  onPress,
}: TouchableHapticCancellationTermsProps) => {
  const { secondaryBgColor, infoColor } = useThemeColors();
  const { push, dismiss } = useTrays('keyboard');

  const [selected, setSelected] = React.useState<boolean>(false);
  React.useEffect(() => onPress(selected), [selected]);

  /** @description Handles the on press event for editing the cancellation terms */
  const onPressCancellationTerms = React.useCallback(() => {
    push('TrayWorkflowCancellationTerms', {
      onAfterSave: () => {
        dismiss('TrayWorkflowCancellationTerms');
      },
    });
  }, [push]);

  return (
    <View
      style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
        backgroundColor: shadeColor(secondaryBgColor, 0.3)
      }]}>
      <TextBase
        text={t("i18n.screens.workflow.builder.cancellationTerms")} 
        type="label" 
        style={{ color: infoColor }} />
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: STYLES.sizeGap + 6 }]}>
        <TouchableHaptic onPress={onPressCancellationTerms}>
          <TextBase
            text={t("i18n.global.edit")} 
            type="label" />
        </TouchableHaptic>
        <Divider vertical />
        <View style={{ width: 40 }}>
        <TouchableHapticSwitch
          state={selected}
          onStateChange={setSelected}/>
        </View>
      </View>
    </View>
  );
};

export default TouchableHapticCancellationTerms;