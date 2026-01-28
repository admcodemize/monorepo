import TrayContainer from "@/components/container/TrayContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @component */
export type ScreenTrayWorkflowDecisionChooseProps = {
  onPress: () => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.46
 * @version 0.0.1
 * @param {ScreenTrayWorkflowDecisionChooseProps} param0
 * @param {() => void} param0.onPress - The function to call when the decision is chosen
 * @component */
const ScreenTrayWorkflowDecisionChoose = ({
  onPress,
}: ScreenTrayWorkflowDecisionChooseProps) => {
  return (
    <TrayContainer 
      title={"i18n.screens.trayWorkflowDecisionChoose.title"} 
      description={"i18n.screens.trayWorkflowDecisionChoose.description"}>

    </TrayContainer>
  );
};

export default ScreenTrayWorkflowDecisionChoose;