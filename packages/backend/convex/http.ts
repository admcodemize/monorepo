import { httpRouter } from "convex/server";
import { httpActionLinkGoogle, httpActionGoogleCallback } from "./http/integrations/google";

const http = httpRouter();

http.route({path: "/integrations/google/oauth/exchange", method: "POST", handler: httpActionLinkGoogle });
http.route({path: "/integrations/google/oauth/callback", method: "GET", handler: httpActionGoogleCallback });

export default http;