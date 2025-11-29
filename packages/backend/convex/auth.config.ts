/** @description env link is declared in convex dashboard => Project -> Settings -> Environment Variables */
export default {
  providers: [{
    domain: process.env.CLERK_JWT_ISSUER_DOMAIN, 
    applicationID: "convex",
  }]
};