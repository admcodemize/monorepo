import { PropsWithChildren } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { faBarsProgress, faCalendarClock, faFileLines, faHandshakeSlash, faSignsPost } from "@fortawesome/duotone-thin-svg-icons";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.31
 * @version 0.0.1
 * @type */
export type WorkflowItemProps = PropsWithChildren & {
  workflowKey: string;
  icon: IconProp;
  title: string;
  description: string;
  info?: string;
  hasConnections?: boolean;
  isCommingSoon?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.31
 * @version 0.0.1
 * @constant */
export const WORKFLOW_ITEMS_EMAIL_OR_SMS: WorkflowItemProps[] = [{
  workflowKey: "remember",
  icon: faCalendarClock as IconProp,
  title: "i18n.screens.workflow.workProcess.emailOrSms.remember.title",
  description: "i18n.screens.workflow.workProcess.emailOrSms.remember.description",
}, {
  workflowKey: "thanks",
  icon: faHandshakeSlash as IconProp,
  title: "i18n.screens.workflow.workProcess.emailOrSms.thanks.title",
  description: "i18n.screens.workflow.workProcess.emailOrSms.thanks.description",
}, {
  workflowKey: "file",
  icon: faFileLines as IconProp,
  title: "i18n.screens.workflow.workProcess.emailOrSms.file.title",
  description: "i18n.screens.workflow.workProcess.emailOrSms.file.description",
}, {
  workflowKey: "survey",
  icon: faBarsProgress as IconProp,
  title: "i18n.screens.workflow.workProcess.emailOrSms.survey.title",
  description: "i18n.screens.workflow.workProcess.emailOrSms.survey.description",
}, {
  workflowKey: "postProcessing",
  icon: faSignsPost as IconProp,
  title: "i18n.screens.workflow.workProcess.emailOrSms.postProcessing.title",
  description: "i18n.screens.workflow.workProcess.emailOrSms.postProcessing.description",
}];