import { internal } from "../_generated/api";
import { httpAction } from "../_generated/server";

import { ExternalAccountResource, EmailAddressResource } from "@clerk/types";

  /**
   * @public
   * @since 0.0.1
   * @version 0.0.1
   * @description Handles the sync during user creation with clerk provider
   * @param {GenericActionCtx<QueryCtx>} ctx - Context
   * @param {Request} req - HTTP-Request */
export const createUserWebhook = httpAction(async (ctx, req) => {
  const { data, type } = await req.json();
  if (type === "user.created") {
    /**
     * @description Reads the primary signed in email-address with the associated linking object */
    const { email_address, linked_to, verification } = data.email_addresses.find((emailAddress: EmailAddressResource) => emailAddress.id === data.primary_email_address_id);
    if (verification.status !== "verified") return new Response(null, { status: 401 });

    /**
     * @description Reads the overall information about the primary external account such as provider, scopes and more */
    // @ts-ignore -> The data object contains a property "identification_id" and not a property named "identificationId" as in the type definition object..
    const externalAccount = data.external_accounts.find((externalAccount: ExternalAccountResource) => externalAccount.identification_id === linked_to[0].id);
    if (!externalAccount) return new Response(null, { status: 401 });

    /** 
     * @description Sync user between clerk and convex */
    /*await ctx.runMutation(internal.auth.mutation.createUser, {
      clerkId: data.id, // Ex. -> user_2tLr08AXkdP8wWQyhnQH95pFMbL
      banned: data.banned,
      email: email_address,
      provider: externalAccount.provider // Ex. -> oauth_google / oauth_apple
    });*/
  }
  
  return new Response(null, { status: 201 });
});  