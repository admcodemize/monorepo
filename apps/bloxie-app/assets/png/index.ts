import React from "react";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.12
 * @version 0.0.1
 * @constant */
export const PNG_ASSETS = React.useMemo(() => ({
  googleCalendar: require("@/assets/png/google_calendar.png"),
  googleMail: require("@/assets/png/google_mail.png"),
  googleMeet: require("@/assets/png/google_meet.png"),
  microsoftOutlook: require("@/assets/png/microsoft_outlook.png"),
  slackCalendar: require("@/assets/png/slack_calendar.png"),
  paypalPayments: require("@/assets/png/paypal_payment.png"),
}), []);