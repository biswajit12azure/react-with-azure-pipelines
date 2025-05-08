import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    // clientId: "YOUR_CLIENT_ID",
    // authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
    // redirectUri: "http://localhost:3000",
    clientId: "d4fdc014-7705-4f31-a57c-e4cd99f27078",
    authority: "https://login.microsoftonline.com/6b79820f-864a-4f1c-a8c2-85c5f09e79d7",
    redirectUri: "https://wglhzus2desvas001.azurewebsites.net",
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;