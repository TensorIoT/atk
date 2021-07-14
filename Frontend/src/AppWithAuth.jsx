import React, { useState, Suspense } from 'react';
import {
	AmplifyAuthenticator,
	AmplifyRequireNewPassword,
} from '@aws-amplify/ui-react';
import {
	AuthState,
	onAuthUIStateChange,
	UI_AUTH_CHANNEL,
	AUTH_STATE_CHANGE_EVENT,
} from '@aws-amplify/ui-components';
import { Hub } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';

import CustomSignIn from './CustomSignIn';

const App = React.lazy(() => import('App'));

const AppWithAuth = () => {
	const classes = useStyles();
	const [authState, setAuthState] = useState();
	const [authData, setAuthData] = React.useState(null);

	const signedIn = authState === AuthState.SignedIn;

	const handleAuthStateChange = async (nextAuthState, authData) => {
		Hub.dispatch(UI_AUTH_CHANNEL, {
			event: AUTH_STATE_CHANGE_EVENT,
			message: nextAuthState,
			data: authData ? authData : null,
		});
	};

	React.useEffect(() => {
		return onAuthUIStateChange((nextAuthState, authData) => {
			setAuthState(nextAuthState);
			setAuthData(authData);
		});
	}, []);

	React.useEffect(() => {
		return onAuthUIStateChange((nextAuthState, authData) => {
			setAuthState(nextAuthState);
			setAuthData(authData);
		});
	}, []);

	return (
		<Suspense fallback={<div />}>
			<AmplifyAuthenticator
				handleAuthStateChange={(authState) => setAuthState(authState)}
			>
				{signedIn ? (
					<App />
				) : (
					<>
						<div
							slot="sign-in"
							style={{
								display: 'flex',
								justifyContent: 'center',
								marginTop: '15rem',
							}}
						>
							<CustomSignIn signIn={handleAuthStateChange} />
						</div>
						<div slot="require-new-password">
							<AmplifyRequireNewPassword
								user={authData}
								handleAuthStateChange={handleAuthStateChange}
								slot="require-new-password"
								className={classes.amplifyDefaultContainer}
							/>
						</div>
					</>
				)}
			</AmplifyAuthenticator>
		</Suspense>
	);
};

const useStyles = makeStyles((theme) => ({
	amplifyDefaultContainer: {
		display: 'flex',
		justifyContent: 'center',
		margin: '1rem auto 0 auto',
	},
}));

export default AppWithAuth;
