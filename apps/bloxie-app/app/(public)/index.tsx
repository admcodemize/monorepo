import ViewBase from "@/components/container/View";
import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from 'expo-auth-session';
import { fetchTyped } from "@codemize/backend/Fetch";
import { Button, Text } from "react-native";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @component */
const Index = () => {
  const { startSSOFlow } = useSSO();

  const onOAuthGoogle = async () => {
    const [err, session] = await fetchTyped(startSSOFlow({
      strategy: 'oauth_google',

      // For web, defaults to current path
      // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
      // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
      redirectUrl: AuthSession.makeRedirectUri({
        scheme: "bloxie",            // muss in app.json/app.config.ts hinterlegt sein
        path: "https://harmless-dodo-18.convex.site/auth/user",
      })
    }));

    if (err) {
      return;
    }
    
    if (session.createdSessionId) await session.setActive!({ 
      session: session.createdSessionId
    });
  }


  return (
    <ViewBase>
      <Text>Public</Text>
      <Button title="OAuth Google" onPress={onOAuthGoogle} />
    </ViewBase>
  );
};

export default Index;