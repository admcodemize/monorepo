import React from "react";
import { Button } from "react-native";
import {
  GoogleOneTapSignIn,
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { config } from "@/utils/integrations/google";

const TouchableHapticGoogle = () => {

  const startSignInFlow = async () => {
    const scopes = [
      "https://www.googleapis.com/auth/calendar",
      "openid",
    ];

    /**
     * Kurz: presentExplicitSignIn + 
     * Backend-Token-Exchange → 
     * Refresh Token im Backend speichern → 
     * pro Konto Access Tokens on demand erneuern.
     *  Damit kannst du wie Calendly beliebig viele Google-Kalender für einen Nutzer synchronisieren.
     */

    const googleConfig = {
      webClientId: config.webClientId,
      iosClientId: config.iosClientId,
      scopes,
      forceCodeForRefreshToken: true,
      offlineAccess: true,
    };

    GoogleSignin.configure(googleConfig);

    GoogleOneTapSignIn.presentExplicitSignIn(googleConfig).then((response) => {
      console.log("Explicit sign in success:", response);
    }).catch((error) => {
      console.error("Explicit sign in failed:", error);
    });

    /*try {
      const signInResponse = await GoogleOneTapSignIn.signIn(googleConfig);
      console.log("One-tap sign in success:", signInResponse);
      return;
    } catch (error) {
      if (!isErrorWithCode(error)) {
        console.error("One-tap sign in failed:", error);
        return;
      }

      if (error.code === statusCodes.NO_SAVED_CREDENTIAL_FOUND) {
        try {
          const createResponse = await GoogleOneTapSignIn.createAccount(googleConfig);
          console.log("One-tap account created:", createResponse);
          return;
        } catch (createError) {
          if (isErrorWithCode(createError)) {
            if (createError.code === statusCodes.SIGN_IN_CANCELLED) {
              console.log("User cancelled Google One-tap account creation.");
              return;
            }
          }
          console.error("Creating One-tap account failed:", createError);
          return;
        }
      }

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled Google One-tap sign in.");
        return;
      }

      try {
        const explicitResponse = await GoogleOneTapSignIn.presentExplicitSignIn(
          googleConfig
        );
        console.log("Explicit sign in success:", explicitResponse);
      } catch (explicitError) {
        console.error("Explicit One-tap sign in failed:", explicitError);
      }
    }*/
  };

  return (
    <>
    {/* 
    TODO: 666953031943-9ke7ccv64j5fc122g842a9ln788plm1p.apps.googleusercontent.com => Client ID for Google OAuth
    URL: https://console.cloud.google.com/apis/credentials?authuser=4&hl=de&inv=1&invt=AboIiw&project=bloxie-dev
    */}
        <Button
      title="Mit Google anmelden"
      onPress={startSignInFlow}
    />
    </>
  );
};

export default TouchableHapticGoogle;