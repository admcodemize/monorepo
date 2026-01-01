/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth_mutation from "../auth/mutation.js";
import type * as auth_query from "../auth/query.js";
import type * as http from "../http.js";
import type * as http_auth_user from "../http/auth/user.js";
import type * as http_integrations_google from "../http/integrations/google.js";
import type * as sync_events_mutation from "../sync/events/mutation.js";
import type * as sync_events_query from "../sync/events/query.js";
import type * as sync_integrations_action from "../sync/integrations/action.js";
import type * as sync_integrations_google_action from "../sync/integrations/google/action.js";
import type * as sync_integrations_mutation from "../sync/integrations/mutation.js";
import type * as sync_integrations_query from "../sync/integrations/query.js";
import type * as sync_settings_action from "../sync/settings/action.js";
import type * as sync_settings_mutation from "../sync/settings/mutation.js";
import type * as sync_settings_query from "../sync/settings/query.js";
import type * as sync_template_query from "../sync/template/query.js";
import type * as sync_workflow_query from "../sync/workflow/query.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "auth/mutation": typeof auth_mutation;
  "auth/query": typeof auth_query;
  http: typeof http;
  "http/auth/user": typeof http_auth_user;
  "http/integrations/google": typeof http_integrations_google;
  "sync/events/mutation": typeof sync_events_mutation;
  "sync/events/query": typeof sync_events_query;
  "sync/integrations/action": typeof sync_integrations_action;
  "sync/integrations/google/action": typeof sync_integrations_google_action;
  "sync/integrations/mutation": typeof sync_integrations_mutation;
  "sync/integrations/query": typeof sync_integrations_query;
  "sync/settings/action": typeof sync_settings_action;
  "sync/settings/mutation": typeof sync_settings_mutation;
  "sync/settings/query": typeof sync_settings_query;
  "sync/template/query": typeof sync_template_query;
  "sync/workflow/query": typeof sync_workflow_query;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
