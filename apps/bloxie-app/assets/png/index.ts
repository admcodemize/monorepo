import React from "react";
import { ImageSourcePropType } from "react-native";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.12
 * @version 0.0.2
 * @constant */
export const PNG_ASSETS: Record<string, ImageSourcePropType> = React.useMemo(() => ({
  googleCalendar: require("@/assets/png/google_calendar.png"),
  googleMail: require("@/assets/png/google_mail.png"),
  googleMeet: require("@/assets/png/google_meet.png"),
  microsoftOutlook: require("@/assets/png/microsoft_outlook.png"),
  slackCalendar: require("@/assets/png/slack_calendar.png"),
  paypalPayments: require("@/assets/png/paypal_payment.png"),
}), []);