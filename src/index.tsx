import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { Listings } from './sections';

const client = new ApolloClient({
    uri: '/api',
});

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <Listings title="TinyHouse Listings" />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
