import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, useMutation } from 'react-apollo';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout, Affix, Spin } from 'antd';

import './styles/index.css';

import { Viewer } from './lib/types';

import { LOG_IN } from './lib/graphql/mutations';
import { LogIn as LogInData, LogInVariables } from './lib/graphql/mutations/Login/__generated__/LogIn';

import { Home, Host, Listing, Listings, Login, NotFound, User, AppHeader, Stripe } from './sections';
import { AppHeaderSkeleton, ErrorBanner } from './lib/components';

//create apollo client
const client = new ApolloClient({
    uri: '/api',
    request: async (operation) => {
        const token = sessionStorage.getItem('token');
        operation.setContext({
            headers: {
                'X-CSRF-TOKEN': token || '',
            },
        });
    },
});
//initiate a site viewer
const initialViewer: Viewer = {
    id: null,
    token: null,
    avatar: null,
    hasWallet: null,
    didRequest: false,
};
//setup routing
const App = () => {
    const [viewer, setViewer] = useState<Viewer>(initialViewer);
    //for use for logging in using cookie
    const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
        onCompleted: (data) => {
            if (data && data.logIn) {
                setViewer(data.logIn);

                //set token in session storage for use in requests to server
                if (data.logIn.token) {
                    sessionStorage.setItem('token', data.logIn.token);
                } else {
                    sessionStorage.removeItem('token');
                }
            }
        },
    });
    //on component mount try to login using cookie
    const logInRef = useRef(logIn);
    useEffect(() => {
        logInRef.current();
    }, []);

    if (!viewer.didRequest && !error) {
        return (
            <Layout className="app-skeleton">
                <AppHeaderSkeleton />
                <div className="app-skeleton__spin-section">
                    <Spin size="large" tip="Launching TinyHouse" />
                </div>
            </Layout>
        );
    }

    const logInErrorBannerElement = error ? (
        <ErrorBanner description="There was an issue logging you in. Please try again later." />
    ) : null;

    return (
        <StripeProvider apiKey={process.env.REACT_APP_S_PUBLISHABLE_KEY as string}>
            <Router>
                <Layout id="app">
                    {logInErrorBannerElement}
                    <Affix offsetTop={0} className="app__affix-header">
                        <AppHeader viewer={viewer} setViewer={setViewer} />
                    </Affix>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/host" render={(props) => <Host {...props} viewer={viewer} />} />
                        <Route
                            exact
                            path="/listing/:id"
                            render={(props) => (
                                <Elements>
                                    <Listing {...props} viewer={viewer} />
                                </Elements>
                            )}
                        />
                        <Route exact path="/listings/:location?" component={Listings} />
                        <Route exact path="/login" render={(props) => <Login {...props} setViewer={setViewer} />} />
                        <Route
                            exact
                            path="/stripe"
                            render={(props) => <Stripe {...props} viewer={viewer} setViewer={setViewer} />}
                        />
                        <Route
                            exact
                            path="/user/:id"
                            render={(props) => <User {...props} viewer={viewer} setViewer={setViewer} />}
                        />
                        <Route component={NotFound} />
                    </Switch>
                </Layout>
            </Router>
        </StripeProvider>
    );
};

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root'),
);
