import { httpAction } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { Id } from "../../_generated/dataModel";

/**
 * @public
 * @since 0.0.9
 * @version 0.0.1
 * @description Handles the http action for linking a google account
 * @type */
export type HttpActionLinkGoogleProps = {
  serverAuthCode: string;
  googleUser: { id: string; email: string };
  userId: Id<"users">;
}

/**
 * @public
 * @since 0.0.9
 * @version 0.0.1
 * @description Handles the http action for linking a google account
 * @param {Object} param0
 * @param {string} param0.userId - User identification
 * @param {string} param0.provider - Oauth provider which has been used for the authentication flow
 * @param {string} param0.providerId - Provider identification
 * @param {string} param0.email - Email-address by oauth provider or email authentication
 * @param {array} param0.scopes - Scopes which have been used for the authentication flow
 * @param {string} param0.refreshToken - Refresh token for the authentication flow 
 * @function */
export const httpActionLinkGoogle = httpAction(async ({ runMutation, runAction, runQuery }, req) => {
  const { serverAuthCode, googleUser, userId }: HttpActionLinkGoogleProps = await req.json();

  if (!process.env.PROVIDER_GOOGLE_WEB_CLIENT_ID || !process.env.PROVIDER_GOOGLE_WEB_CLIENT_SECRET) {
    return new Response(JSON.stringify({ error: "i18n.convex.http.integrations.google.error.clientIdOrSecretNotFound" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  /** 
   * @description Exchange the server auth code for a token
   * -> redirect_uri is the callback URL for the token exchange which is defined in the Google Cloud Console */
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: serverAuthCode,
      client_id: process.env.PROVIDER_GOOGLE_WEB_CLIENT_ID,
      client_secret: process.env.PROVIDER_GOOGLE_WEB_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: "https://harmless-dodo-18.convex.site/integrations/google/oauth/callback",
    }),
  });

  /** @description If the token exchange fails, return the error */
  if (!tokenRes.ok) return new Response(await tokenRes.text(), { status: tokenRes.status });
  
  const token = await tokenRes.json();
  if (!token.refresh_token) return new Response("i18n.convex.http.integrations.google.error.missingRefreshToken", { status: 500 });

  /** @description Check if the account is already linked */
  const linkedAccount = await runQuery(internal.sync.integrations.query.linkedByProviderId, {
    userId,
    provider: "google",
    providerId: googleUser.id,
    email: googleUser.email,
  });

  if (linkedAccount) {
    await runAction(internal.sync.integrations.google.action.fetchCalendarEvents, { userId });

    /** @description Update the linked account */
    await runMutation(internal.sync.integrations.mutation.update, {
      _id: linkedAccount._id,
      refreshToken: await runAction(internal.sync.integrations.action.encryptedToken,{ token: token.refresh_token }),
    });
  } else {
    /** @description Link the provider to the user */
    await runMutation(internal.sync.integrations.mutation.create, {
      userId,
      provider: "google",
      providerId: googleUser.id,
      email: googleUser.email,
      scopes: token.scope ? token.scope.split(" ") : [],
      refreshToken: await runAction(internal.sync.integrations.action.encryptedToken,{ token: token.refresh_token }),
    });
  }

  return new Response("i18n.convex.http.integrations.google.success.linkOrUpdate", {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

/**
 * @public
 * @since 0.0.9
 * @version 0.0.1
 * @description Handles the http action for linking a google account
 * @function */
export const httpActionGoogleCallback = httpAction(async () => new Response("i18n.convex.http.integrations.google.success.callback", { status: 200 }));