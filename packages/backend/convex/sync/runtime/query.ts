import { query } from "../../_generated/server";

import { ConvexRumtimeAPILicenseProps, ConvexRuntimeAPIProps } from "../../../Types";
import { licenseSchema } from "../../schema";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @description The features for the freemium license
 * @constant */
const FREEMIUM_FEATURES: ConvexRumtimeAPILicenseProps["features"] = [
  { key: "workflows.templates" },
  { key: "workflows.variables" },
];

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @description The features for the premium license including the freemium features
 * @constant */
const PREMIUM_FEATURES: ConvexRumtimeAPILicenseProps["features"] = [
  ...FREEMIUM_FEATURES,
  { key: "integrations.google" },
];

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @description The template variables for the application
 * -> Used to generate the dynamic content for the workflows
 * @constant */
const TEMPLATE_VARIABLES: ConvexRuntimeAPIProps["templateVariables"] = [
  { sortOrder: 1, icon: "faH1", name: "i18n.convex.runtime.templateVariables.eventTitle", pattern: "EventTitle" },
  { sortOrder: 2, icon: "faCalendarDay", name: "i18n.convex.runtime.templateVariables.eventDate", pattern: "EventDate" },
  { sortOrder: 3, icon: "faAlarmClock", name: "i18n.convex.runtime.templateVariables.eventStartTime", pattern: "EventStartTime" },
  { sortOrder: 4, icon: "faFlagCheckered", name: "i18n.convex.runtime.templateVariables.eventEndTime", pattern: "EventEndTime" },
  { sortOrder: 5, icon: "faMapLocation", name: "i18n.convex.runtime.templateVariables.eventLocation", pattern: "EventLocation" },
  { sortOrder: 5, icon: "faParagraph", name: "i18n.convex.runtime.templateVariables.eventDescription", pattern: "EventDescription" },
  { sortOrder: 6, icon: "faUserGroupCrown", name: "i18n.convex.runtime.templateVariables.eventOrganizer", pattern: "EventOrganizer" },
  { sortOrder: 7, icon: "faUserGroup", name: "i18n.convex.runtime.templateVariables.eventParticipant", pattern: "EventParticipant" },
  { sortOrder: 8, icon: "faEnvelope", name: "i18n.convex.runtime.templateVariables.eventParticipantMail", pattern: "EventParticipantMail" },
  { sortOrder: 9, icon: "faCalculatorSimple", name: "i18n.convex.runtime.templateVariables.eventParticipantsCount", pattern: "EventParticipantsCount" },
  { sortOrder: 10, icon: "faBuildings", name: "i18n.convex.runtime.templateVariables.companyName", pattern: "CompanyName" },
  { sortOrder: 11, icon: "faLocationDot", name: "i18n.convex.runtime.templateVariables.companyAddress", pattern: "CompanyAddress" }
];

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.39
 * @version 0.0.1
 * @description The workflow decisions for the application
 * -> Used to handle specific decisions in a workflow so the process can continue or not
 * @constant */
const WORKFLOW_DECISIONS: ConvexRuntimeAPIProps["workflowDecisions"] = [
  { key: "decisionEventType", sortOrder: 1, name: "i18n.convex.runtime.workflowDecisions.eventType.title", description: "i18n.convex.runtime.workflowDecisions.eventType.description", icon: "faBolt" },
  { key: "decisionCalendarConnection", sortOrder: 2, name: "i18n.convex.runtime.workflowDecisions.calendarConnection.title", description: "i18n.convex.runtime.workflowDecisions.calendarConnection.description", icon: "faCloud" },
];

/**
 * @public
 * @since 0.0.38
 * @version 0.0.2
 * @description Returns the runtime configuration for the application
 * -> The runtime configuration contains the languages and template variables for the application */
export const get = query({
  args: { license: licenseSchema },
  handler: async (ctx, { license }): Promise<ConvexRuntimeAPIProps> => {
    return {
      templateVariables: TEMPLATE_VARIABLES,
      workflowDecisions: WORKFLOW_DECISIONS,
      hasPremiumLicense: license === "premium",
      license: license === "freemium"
        ? { features: FREEMIUM_FEATURES, counter: { linkedProviderCount: 1, workflowCount: 1, activeEventTypesCount: 1 } } 
        : { features: PREMIUM_FEATURES, counter: { linkedProviderCount: 5, workflowCount: 20, activeEventTypesCount: 20 } },
    }
  },
});