import { TrayProvider } from "react-native-trays";
import { Stack } from "expo-router";

import { stackConfigs, trays } from "@/helpers/Trays";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.4
 * @component */
const ModalAccountLayout = () => {
  return (

      <TrayProvider 
        stackConfigs={stackConfigs}
        trays={{ ...trays.main, ...trays.keyboard }}>
          <></>
      </TrayProvider>

  );
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @component */
const RootLayout = () => <ModalAccountLayout />;

export default RootLayout;