import { AUTH_URL } from '../../../lib/graphql/queries';
//import { LOG_IN } from '../../../lib/graphql/mutations';
//mocks for Jest
export const jestMocks = [
    {
        request: {
            query: AUTH_URL,
        },
        result: {
            data: {
                authUrl: 'TestGeneratedAuthUrl',
            },
        },
    },
];
