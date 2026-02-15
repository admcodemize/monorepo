
import TrayContainer from "@/components/container/TrayContainer";
import React from "react";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.60
 * @version 0.0.1
 * @component */
export type ScreenTrayLocationProps = {
  onAfterSave: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.60
 * @version 0.0.1
 * @param {ScreenTrayLocationProps} param0
 * @component */
const ScreenTrayLocation = ({
  onAfterSave,
}: ScreenTrayLocationProps) => {
  const [locations, setLocations] = React.useState<string[]>([]);

  /**
   * @description Used to add a location to the list
   * @function */
  const onAddLocation = (location: string) => {
    setLocations([...locations, location]);
  }

  return (
    <TrayContainer 
      title={"i18n.screens.trayLocation.title"} 
      description={"i18n.screens.trayLocation.description"}>

    </TrayContainer>
  );
};

export default ScreenTrayLocation;