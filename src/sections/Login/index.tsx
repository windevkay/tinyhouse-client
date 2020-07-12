import React, { useEffect, useRef } from 'react';
import { Redirect } from 'react-router';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Card, Layout, Spin, Typography } from 'antd';

import { Viewer } from '../../lib/types';

import { AUTH_URL } from '../../lib/graphql/queries';
import { LOG_IN } from '../../lib/graphql/mutations';
import { AuthUrl as AuthUrlData } from '../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl';
import { LogIn as LogInData, LogInVariables } from '../../lib/graphql/mutations/Login/__generated__/LogIn';

//import googleLogo from './assets/google_logo.jpg';
/* eslint-disable */
const googleLogo = require('./assets/google_logo.jpg');
import { ErrorBanner } from '../../lib/components';
import { displayErrorMessage, displaySuccessNotification } from '../../lib/utils';

//props
interface Props {
    setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login = ({ setViewer }: Props) => {
    const client = useApolloClient();
    const [logIn, { data: logInData, loading: logInLoading, error: logInError }] = useMutation<
        LogInData,
        LogInVariables
    >(LOG_IN, {
        onCompleted: (data) => {
            if (data && data.logIn && data.logIn.token) {
                setViewer(data.logIn);
                sessionStorage.setItem('token', data.logIn.token);
                displaySuccessNotification("You've successfully logged in!");
            }
        },
    });

    const handleAuthorize = async () => {
        try {
            const { data } = await client.query<AuthUrlData>({
                query: AUTH_URL,
            });
            //redirect viewer to the url (login) page
            window.location.href = data.authUrl;
        } catch {
            displayErrorMessage("Sorry! We weren't able to log you in. Try again later");
        }
    };

    //when auth url is available and we are redirected by google back to /login
    //we use the effect hook | this is like component did mount but with conditions

    //we wont provide deps for useeffect so we use ref to reference the original mutation
    const logInRef = useRef(logIn);
    useEffect(() => {
        //check if code exists in window
        const code = new URL(window.location.href).searchParams.get('code');
        if (code) {
            logInRef.current({
                variables: {
                    input: { code },
                },
            });
        }
    }, []);

    if (logInLoading) {
        return (
            <Content className="log-in">
                <Spin size="large" tip="Logging you in..." />
            </Content>
        );
    }

    const logInErrorBannerElement = logInError ? (
        <ErrorBanner description="Sorry! We weren't able to log you in. Try again later" />
    ) : null;

    if (logInData && logInData.logIn) {
        const { id: viewerId } = logInData.logIn;
        return <Redirect to={`/user/${viewerId}`} />;
    }

    return (
        <Content className="log-in">
            {logInErrorBannerElement}
            <Card className="log-in-card">
                <div className="log-in-card__intro">
                    <Title level={3} className="log-in-card__intro-title">
                        <span role="img" aria-label="wave">
                            👋
                        </span>
                    </Title>
                    <Title level={3} className="log-in-card__intro-title">
                        Log in to TinyHouse!
                    </Title>
                    <Text>Sign in with Google to start booking available rentals!</Text>
                </div>
                <button className="log-in-card__google-button" onClick={handleAuthorize}>
                    <img src={googleLogo} alt="Google Logo" className="log-in-card__google-button-logo" />
                    <span className="log-in-card__google-button-text">Sign in with Google</span>
                </button>
                <Text type="secondary">
                    Note: By signing in, you will be redirected to Googles sign in page and asked to consent to signing
                    in with your account
                </Text>
            </Card>
        </Content>
    );
};
