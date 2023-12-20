import OktaAuth from "@okta/okta-auth-js";

export const oktaAuth = new OktaAuth({
    clientId: "0oa9xdehh7ez7KUt3697",
    issuer: 'https://trial-5653931.okta.com/oauth2/default',
    redirectUri: 'http://localhost:8080/signin', // Adjust the redirect URI as needed
    scopes: ['openid', 'profile', 'email'],
    // prompt: "none"
});

oktaAuth.tokenManager.clear();

export const isAuthenticated = async (): Promise<boolean> => {
    try {
        const session = await oktaAuth.session.get();
        if (session.status === "ACTIVE") {
            console.log("User is logged in with session token");
            return true
        } else {
            console.log("User is not logged in");
            return false;
        }
    } catch (error) {
        console.error("Error checking session:", error);
        return false
    }
};