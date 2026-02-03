import { Button, Linking, Text, View } from "react-native";
import { useSSO,  } from "@clerk/clerk-expo";
import * as AuthSession from 'expo-auth-session';

import { fetchTyped } from "@codemize/backend/Fetch";

import ViewBase from "@/components/container/View";
import TouchableHapticGoogle from "@/components/button/oauth/TouchableHapticGoogle";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import GlobalButtonStyle from "@/styles/GlobalButton";
import TextBase from "@/components/typography/Text";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import { useThemeColor, useThemeColors } from "@/hooks/theme/useThemeColor";
import { STYLES } from "@codemize/constants/Styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFontFamily, useFontSize } from "@/hooks/typography/useFont";
import { shadeColor } from "@codemize/helpers/Colors";
import { FAMILIY } from "@codemize/constants/Fonts";

const TERMS_URL = "https://bloxie.ch/terms";
const PRIVACY_URL = "https://bloxie.ch/privacy";
/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @component */
const ScreenSignIn = () => {
  const { focusedBgColor, focusedContentColor } = useThemeColors();
  const labelColor = useThemeColor("label");
  const labelFontSize = useFontSize("label");
  const labelFontFamily = useFontFamily("label");
  const { bottom } = useSafeAreaInsets();
  const { startSSOFlow } = useSSO();

  /**
   * @description Starts the OAuth Google flow
   * @returns {Promise<void>} - A promise that resolves when the OAuth Google flow is completed
   * @function */
  const onOAuthProvider = async (provider: "google"|"apple"): Promise<void> => {
    const [err, session] = await fetchTyped(startSSOFlow({
      authSessionOptions: {
        showInRecents: true,
      },
      strategy: provider === "google" ? "oauth_google" : "oauth_apple",
      redirectUrl: AuthSession.makeRedirectUri({
        scheme: "bloxie", 
        path: "https://harmless-dodo-18.convex.site/auth/user",
      })
    }));

    if (err) return;
    if (session.createdSessionId) await session.setActive!({ 
      session: session.createdSessionId
    });
  }

  return (
    <ViewBase 
      schemeProperty="tertiaryBg"
      style={[{ paddingHorizontal: STYLES.paddingHorizontal, paddingVertical: STYLES.paddingVertical, justifyContent: "flex-end", paddingBottom: bottom + 40, gap: STYLES.sizeGap * 4 }]}>
        <View style={[{  }]}>
        <TextBase
          text="bloxie"
          type="header"
          style={[{ fontSize: 32, fontFamily: String(FAMILIY.header) }]}/>
        <Text
          style={[{ color: labelColor, fontSize: 14, fontFamily: labelFontFamily }]}>
          intelligent{" "}
          <Text
            style={{ fontFamily: String(FAMILIY.header), color: "#000" }}>
            vernetzt
          </Text>
          {" "}einfach{" "}
          <Text
            style={{ fontFamily: String(FAMILIY.header), color: "#000" }}>
            geplant
          </Text>
          .
        </Text>
      </View>






        <View style={[{ gap: STYLES.sizeGap * 1.25 }]}>
      <TouchableHaptic 
        onPress={() => onOAuthProvider("google")}
        style={[GlobalButtonStyle.spacing, GlobalContainerStyle.columnCenterCenter, {
          backgroundColor: focusedBgColor,
          height: STYLES.sizeTouchable + 14,
        }]}>
          <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
            <FontAwesomeIcon
              icon={faGoogle as IconProp} 
              size={STYLES.sizeFaIcon} 
              color={focusedContentColor} />
            <TextBase
              text="Sign in with Google"
              type="title"
              color={focusedContentColor}/>
          </View> 
        </TouchableHaptic>
        <TouchableHaptic 
        onPress={() => onOAuthProvider("apple")}
        style={[GlobalButtonStyle.spacing, GlobalContainerStyle.columnCenterCenter, {
          backgroundColor: "#d7d7d7",
          height: STYLES.sizeTouchable + 14,
        }]}>
          <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
            <FontAwesomeIcon
              icon={faApple as IconProp} 
              size={STYLES.sizeFaIcon} 
              color={focusedContentColor} />
            <TextBase
              text="Sign in with Apple"
              type="title"
              color={focusedContentColor}/>
          </View> 
        </TouchableHaptic>
        </View>
        <Text
          style={[{ textAlign: "center", color: labelColor, fontSize: labelFontSize, fontFamily: labelFontFamily }]}>
          By signing in with an account, you agree to Bloxie's{" "}
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() => Linking.openURL(TERMS_URL)}>
            Terms of Service
          </Text>
          {" "}and{" "}
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() => Linking.openURL(PRIVACY_URL)}>
            Privacy Policy
          </Text>
        </Text>
    </ViewBase>
  );
}

export default ScreenSignIn;