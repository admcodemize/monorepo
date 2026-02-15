import { Stack } from "expo-router";

import { shadeColor } from "@codemize/helpers/Colors";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { TRAY_CONFIGURATION_ITEMS } from "@/constants/Models";

import StackModalHeader from "@/components/container/StackModalHeader";
import SafeAreaContextViewBase from "@/components/container/SafeAreaContextView";
import DropdownOverlay from "@/components/container/DropdownOverlay";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.54
 * @version 0.0.1
 * @component */
const ModalConfigurationEventTypeLayout = () => {
  const { tertiaryBgColor } = useThemeColors();

  const tray = TRAY_CONFIGURATION_ITEMS.find((item) => item.key === "type");

  return (
    <SafeAreaContextViewBase style={{ backgroundColor: shadeColor(tertiaryBgColor, 0.1) }}>
      <StackModalHeader 
        title={tray!.title} 
        description={tray?.modal} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[id]" />
      </Stack>
      <DropdownOverlay />
    </SafeAreaContextViewBase>
  );
}

export default ModalConfigurationEventTypeLayout;