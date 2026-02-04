
import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";

import { shadeColor } from "@codemize/helpers/Colors";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import ToastOverlay from "@/components/container/ToastOverlay";
import { router } from "expo-router";
import { Button } from "react-native";

/** 
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.54
 * @version 0.0.1
 * @component */
const ModalConfigurationEventTypes = () => {
  const { secondaryBgColor } = useThemeColors();

  const onPress = () => {
    router.push({ 
      pathname: "/configuration/eventType/[id]", 
      params: { 
        id: "1" 
      } 
    });
  }

  return (
    <SafeAreaContextViewBase style={{ backgroundColor: shadeColor(secondaryBgColor, 0.3) }}>
      <Button 
        title="Press me" 
        onPress={onPress} />
    </SafeAreaContextViewBase>
  )
}

export default ModalConfigurationEventTypes; 