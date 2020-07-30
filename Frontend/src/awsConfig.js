import { Auth } from "aws-amplify";
import { LORA_ATK } from "apis/_NAMES.js";

export default {
  Auth: {
    mandatorySignIn: true,
    region: "",
    userPoolId: "",
    userPoolWebClientId: "",
  },
  API: {
    endpoints: [
      {
        name: LORA_ATK,
        endpoint: "<url for api gateway stage>",
        custom_header: async () => {
          return {
            Authorization: `${(await Auth.currentSession())
              .getIdToken()
              .getJwtToken()}`,
          };
        },
      },
    ],
  },
};
