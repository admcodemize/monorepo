import { httpRouter } from "convex/server";
import { 
  httpActionGoogleExchange, 
  httpActionGoogleCallback, 
  httpActionGoogleWatchEvents, 
  httpActionGoogleWatchLists, 
  httpActionGoogleUnlink, 
  httpActionGoogleSend 
} from "./http/integrations/google";

import { httpActionAuthUserCreate } from "./http/auth/user";

const http = httpRouter();

http.route({path: "/integrations/google/oauth/exchange", method: "POST", handler: httpActionGoogleExchange });
http.route({path: "/integrations/google/oauth/unlink", method: "POST", handler: httpActionGoogleUnlink });
http.route({path: "/integrations/google/oauth/send", method: "POST", handler: httpActionGoogleSend });
http.route({path: "/integrations/google/oauth/callback", method: "GET", handler: httpActionGoogleCallback });
http.route({path: "/integrations/google/events/watch", method: "POST", handler: httpActionGoogleWatchEvents });
http.route({path: "/integrations/google/lists/watch", method: "POST", handler: httpActionGoogleWatchLists });

http.route({path: "/auth/user", method: "POST", handler: httpActionAuthUserCreate });

export default http;