import { GoogleOneTapSignIn, GoogleSignin } from "@react-native-google-signin/google-signin";
import { config } from "@/utils/integrations/google";
import { Id } from "../../../packages/backend/convex/_generated/dataModel";
import { ToastContextOpenProps } from "@/context/ToastContext";
import { faInfoCircle } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { View } from "react-native";

/**
 * @public
 * @since 0.0.14
 * @version 0.0.1
 * @type */
export type StartGoogleFlowProps = {
  email?: string;
  grantScopeGmail?: boolean;
  open?: (props: ToastContextOpenProps) => void;
};

/**
 * @public
 * @since 0.0.14
 * @version 0.0.1
 * @type */
export type UnlinkGoogleAccountProps = {
  userId?: Id<"users">;
  providerId: string;
  open?: (props: ToastContextOpenProps) => void;
};

/**
 * @public
 * @since 0.0.14
 * @version 0.0.1
 * @description Starts the Google OAuth flow
 * @param {StartGoogleFlowProps} param0 - The props for the Google OAuth flow
 * @param {string} param0.email - The email of the user
 * @param {boolean} param0.grantScopeGmail - Whether to grant the Gmail scope
 * @param {Function} param0.open - The function to open the toast which indicates the loading state
 * @function */
export const startGoogleFlow = async ({ 
  email, 
  grantScopeGmail, 
  open 
}: StartGoogleFlowProps) => {
  const scopes = [];
  if (grantScopeGmail) scopes.push("https://www.googleapis.com/auth/gmail.send");
  else scopes.push("https://www.googleapis.com/auth/calendar");

  /** @description Configure the Google OAuth flow */
  const googleConfig = {
    webClientId: config.webClientId,
    iosClientId: config.iosClientId,
    scopes,
    forceCodeForRefreshToken: true,
    offlineAccess: true,
    includeGrantedScopes: true,
    loginHint: email,
  };

  GoogleSignin.configure(googleConfig);
  const res = await GoogleOneTapSignIn.presentExplicitSignIn(googleConfig);

  open?.({
    children: <View style={{ height: 300 }}></View>,
    data: {
      title: "",
      icon: faInfoCircle as IconProp,
    }
  });
  
  const a = await fetch(`${process.env.EXPO_PUBLIC_CONVEX_SITE}/integrations/google/oauth/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      serverAuthCode: res.serverAuthCode,
      googleUser: {
        id: res.user.id,
        email: res.user.email,
      },
      userId: "j97bzw0450931g8rfqmmx38xh57vnhhz" as Id<"users">,
      grantScopeGmail: grantScopeGmail,
    }),
  });

  console.log("a:", await a.json());
};

/**
 * @public
 * @since 0.0.14
 * @version 0.0.1
 * @description Unlinks a Google account
 * -> 1. Stop the channel watch for the calendar lists so that the calendar events can not be fetched or updated incrementally anymore
 * -> 2. Collect all the events for a given provider id and remove them all from the database
 * -> 3. Remove all the calendars for the linked account from the database
 * -> 4. Finally remove the linked account from the database
 * @function */
export const unlinkGoogleAccount = async ({
  userId,
  providerId,
  open
}: UnlinkGoogleAccountProps) => {
  open?.({
    children: <View style={{ height: 300 }}></View>,
    data: {
      title: "",
      icon: faInfoCircle as IconProp,
    }
  });

  const a = await fetch(`${process.env.EXPO_PUBLIC_CONVEX_SITE}/integrations/google/oauth/unlink`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: "j97bzw0450931g8rfqmmx38xh57vnhhz" as Id<"users">,
      providerId
    }),
  });
  console.log("a:", a);
};