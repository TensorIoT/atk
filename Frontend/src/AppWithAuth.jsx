import React, { useState, Suspense } from "react";
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { AuthState } from "@aws-amplify/ui-components";

import CustomSignIn from "./CustomSignIn";

const App = React.lazy(() => import("App"));

const AppWithAuth = () => {
  const [authState, setAuthState] = useState();

  const signedIn = authState === AuthState.SignedIn;

  return (
    <Suspense fallback={<div />}>
      <AmplifyAuthenticator
        handleAuthStateChange={(authState) => setAuthState(authState)}
      >
        {signedIn ? (
          <App />
        ) : (
          <div
            slot="sign-in"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "15rem",
            }}
          >
            <CustomSignIn slot="sign-in" />
          </div>
        )}
      </AmplifyAuthenticator>
    </Suspense>
  );
};

export default AppWithAuth;
