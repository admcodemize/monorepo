import ScreenTrayAction from "@/screens/private/TrayAction";
import ScreenTrayDashboard from "@/screens/private/TrayDashboard";
import ScreenTrayWorkflow, { ScreenTrayWorkflowProps } from "@/screens/private/configuration/workflow/trays/TrayWorkflow";
import ScreenTrayWorkflowTemplate, { ScreenTrayWorkflowTemplateProps } from "@/screens/private/configuration/workflow/trays/TrayWorkflowTemplate";
import ScreenTrayWorkflowDecision, { ScreenTrayWorkflowDecisionProps } from "@/screens/private/configuration/workflow/trays/TrayWorkflowDecision";
import ScreenTrayWorkflowAction, { ScreenTrayWorkflowActionProps } from "@/screens/private/configuration/workflow/trays/TrayWorkflowAction";
import ScreenTrayWorkflowEventType, { ScreenTrayWorkflowEventTypeProps } from "@/screens/private/configuration/workflow/trays/TrayWorkflowEventType";
import ScreenTrayWorkflowCancellationTerms, { ScreenTrayWorkflowCancellationTermsProps } from "@/screens/private/configuration/workflow/trays/TrayWorkflowCancellationTerms";
import ScreenTrayWorkflowDecisionChoose, { ScreenTrayWorkflowDecisionChooseProps } from "@/screens/private/configuration/workflow/trays/TrayWorkflowDecisionChoose";
import ScreenTrayLocation, { ScreenTrayLocationProps } from "@/screens/private/configuration/eventType/trays/TrayLocation";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.34
 * @version 0.0.1
 * @constant */
const defaultStackConfig = {
  dismissOnBackdropPress: true,
  enableSwipeToClose: true,
  adjustForKeyboard: true,
  horizontalSpacing: 10,
  backdropStyles: { backgroundColor: "#00000030" },
  trayStyles: { 
    borderRadius: 20,
  }
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.4
 * @constant */
export const stackConfigs = {
  main: defaultStackConfig,
  keyboard: {
    ...defaultStackConfig,
    dismissOnBackdropPress: false,
    enableSwipeToClose: false,
    trayStyles: {
      borderRadius: 14,
      marginBottom: 4 // -> can be used to get e small margin between keyboard and tray
    }
  }
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.11
 * @object */
export const trays = {
  main: {
    /** @description Action trays @see {@link screens/private/trays} */
    TrayAction: { component: ScreenTrayAction },
    TrayDashboard: { component: ScreenTrayDashboard },

    /** @description Workflow trays @see {@link screens/private/modal/configuration/workflow/trays} */
    TrayWorkflow: { component: (props: ScreenTrayWorkflowProps) => <ScreenTrayWorkflow {...props} /> },
    TrayWorkflowTemplate: { component: (props: ScreenTrayWorkflowTemplateProps) => <ScreenTrayWorkflowTemplate {...props} /> },
    TrayWorkflowDecision: { component: (props: ScreenTrayWorkflowDecisionProps) => <ScreenTrayWorkflowDecision {...props} /> },
    TrayWorkflowEventType: { component: (props: ScreenTrayWorkflowEventTypeProps) => <ScreenTrayWorkflowEventType {...props} /> },
    TrayWorkflowDecisionChoose: { component: (props: ScreenTrayWorkflowDecisionChooseProps) => <ScreenTrayWorkflowDecisionChoose {...props} /> },
  },
  keyboard: {
    /** @description Workflow trays @see {@link screens/private/modal/configuration/workflow/trays} -> Special settings for keyboard handling */
    TrayWorkflowAction: { component: (props: ScreenTrayWorkflowActionProps) => <ScreenTrayWorkflowAction {...props} /> },
    TrayWorkflowCancellationTerms: { component: (props: ScreenTrayWorkflowCancellationTermsProps) => <ScreenTrayWorkflowCancellationTerms {...props} /> },
    TrayLocation: { component: (props: ScreenTrayLocationProps) => <ScreenTrayLocation {...props} /> },
  }
};