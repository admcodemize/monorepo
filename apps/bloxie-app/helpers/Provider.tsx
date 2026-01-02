import { GoogleOneTapSignIn, GoogleSignin } from "@react-native-google-signin/google-signin";
import { config } from "@/utils/integrations/google";
import { Id } from "../../../packages/backend/convex/_generated/dataModel";
import { ToastContextOpenProps } from "@/context/ToastContext";
import { faInfoCircle } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { View } from "react-native";
import { Toast } from "toastify-react-native";

/**
 * @public
 * @since 0.0.14
 * @version 0.0.1
 * @type */
export type StartGoogleFlowProps = {
  userId?: Id<"users">;
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
  userId: Id<"users">;
  providerId: string;
  open?: (props: ToastContextOpenProps) => void;
};

/**
 * @public
 * @since 0.0.14
 * @version 0.0.3
 * @description Starts the Google OAuth flow
 * @param {StartGoogleFlowProps} param0 - The props for the Google OAuth flow
 * @param {Id<"users">} param0.userId - The convex user id
 * @param {string} param0.email - The email of the user
 * @param {boolean} param0.grantScopeGmail - Whether to grant the Gmail scope
 * @param {Function} param0.open - The function to open the toast which indicates the loading state
 * @function */
export const startGoogleFlow = async ({ 
  userId,
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

  /*open?.({
    children: <View style={{ height: 300 }}></View>,
    data: {
      title: "",
      icon: faInfoCircle as IconProp,
    }
  });*/
  
  const exchange = await fetch(`${process.env.EXPO_PUBLIC_CONVEX_SITE}/integrations/google/oauth/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      serverAuthCode: res.serverAuthCode,
      googleUser: {
        id: res.user.id,
        email: res.user.email,
      },
      userId,
      grantScopeGmail: grantScopeGmail,
    }),
  });

  /** @example {"convex": {"code": 200, "info": "BLOXIE_E00", "name": "BLOXIE_HAR_GE_S01", "severity": "success"}, "data": null} */
  const { convex } = await exchange.json();
  if (convex.code !== 200) {

  }

  console.log(convex);

  Toast.show({
    type: 'success',
    text1: convex.name,
    text2: 'Secondary message',
    position: 'bottom',
    visibilityTime: 4000,
    autoHide: true,
    useModal: false,
    onPress: () => console.log('Toast pressed'),
    onShow: () => console.log('Toast shown'),
    onHide: () => console.log('Toast hidden'),
  })
};

/**
 * @public
 * @since 0.0.14
 * @version 0.0.2
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
  /*open?.({
    children: <View style={{ height: 300 }}></View>,
    data: {
      title: "",
      icon: faInfoCircle as IconProp,
    }
  });*/

  Toast.show({
    type: 'success',
    text2: 'Secondary message',
    position: 'bottom',
    autoHide: false,
    useModal: false,
    onPress: () => console.log('Toast pressed'),
    onShow: () => console.log('Toast shown'),
    onHide: () => console.log('Toast hidden'),
  })

  const res = await fetch(`${process.env.EXPO_PUBLIC_CONVEX_SITE}/integrations/google/oauth/unlink`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      providerId
    }),
  });

  /** @example {"convex": {"code": 200, "info": "BLOXIE_E00", "name": "BLOXIE_HAR_GUL_S01", "severity": "success"}, "data": null} */
  const { convex } = await res.json();
  if (convex.code !== 200) {

  }

  Toast.hide();

};