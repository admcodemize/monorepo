import { httpRouter } from "convex/server";
import { httpActionGoogleExchange, httpActionGoogleCallback, httpActionGoogleWatchEvents, httpActionGoogleWatchLists } from "./http/integrations/google";

const http = httpRouter();

http.route({path: "/integrations/google/oauth/exchange", method: "POST", handler: httpActionGoogleExchange });
http.route({path: "/integrations/google/oauth/callback", method: "GET", handler: httpActionGoogleCallback });
http.route({path: "/integrations/google/events/watch", method: "POST", handler: httpActionGoogleWatchEvents });
http.route({path: "/integrations/google/lists/watch", method: "POST", handler: httpActionGoogleWatchLists });

export default http;