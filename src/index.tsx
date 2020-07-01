import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout, Affix } from 'antd';

import './styles/index.css';
import { Viewer } from './lib/types';

import { Home, Host, Listing, Listings, Login, NotFound, User, AppHeader } from './sections';
//create apollo client
const client = new ApolloClient({
    uri: '/api',
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
    return (
        <Router>
            <Layout id="app">
                <Affix offsetTop={0} className="app__affix-header">
                    <AppHeader />
                </Affix>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/host" component={Host} />
                    <Route exact path="/listing/:id" component={Listing} />
                    <Route exact path="/listings/:location?" component={Listings} />
                    <Route exact path="/login" render={(props) => <Login {...props} setViewer={setViewer} />} />
                    <Route exact path="/user/:id" component={User} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </Router>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
