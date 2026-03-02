import { TrayProvider } from "react-native-trays";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { stackConfigs, trays } from "@/helpers/Trays";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.5
 * @component */
const ModalGeneralLayout = () => {
  return (
    <SafeAreaProvider>
      <TrayProvider 
        stackConfigs={stackConfigs}
        trays={{ ...trays.main, ...trays.keyboard }}>
          <></>
      </TrayProvider>
    </SafeAreaProvider>
  );
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @component */
const RootLayout = () => <ModalGeneralLayout />;

export default RootLayout;