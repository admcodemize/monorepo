import { Button, Text } from "react-native";
import { useSSO,  } from "@clerk/clerk-expo";
import * as AuthSession from 'expo-auth-session';

import { fetchTyped } from "@codemize/backend/Fetch";

import ViewBase from "@/components/container/View";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.2
 * @component */
const Index = () => {
  const { startSSOFlow } = useSSO();

  /**
   * @description Starts the OAuth Google flow
   * @returns {Promise<void>} - A promise that resolves when the OAuth Google flow is completed
   * @function */
  const onOAuthGoogle = async (): Promise<void> => {
    const [err, session] = await fetchTyped(startSSOFlow({
      authSessionOptions: {
        showInRecents: true,
      },
      strategy: 'oauth_google',
      redirectUrl: AuthSession.makeRedirectUri({
        scheme: "bloxie", 
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