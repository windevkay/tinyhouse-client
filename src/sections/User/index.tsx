import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Col, Layout, Row } from 'antd';

import { USER } from '../../lib/graphql/queries';
import { User as UserData, UserVariables } from '../../lib/graphql/queries/User/__generated__/User';
import { Viewer } from '../../lib/types';

import { UserProfile, UserBookings, UserListings } from './components';

import { ErrorBanner, PageSkeleton } from '../../lib/components';

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

interface MatchParams {
    id: string;
}

const { Content } = Layout;
const PAGE_LIMIT = 4;

//the match prop is automatically accessible to use from the route params
//use intersection type pattern to specify we are destructuring props of several types
export const User = ({ viewer, match, setViewer }: Props & RouteComponentProps<MatchParams>) => {
    const [listingsPage, setListingsPage] = useState(1);
    const [bookingsPage, setBookingsPage] = useState(1);

    const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(USER, {
        variables: {
            id: match.params.id,
            bookingsPage,
            listingsPage,
            limit: PAGE_LIMIT,
        },
    });

    const handleUserRefetch = async () => await refetch();
    //on stripe connect error, we will be redirected back to this page, so lets check for the error param
    const stripeError = new URL(window.location.href).searchParams.get('stripe_error');
    const stripeErrorBanner = stripeError ? (
        <ErrorBanner description="We had an issue connecting with Stripe. Please try again later." />
    ) : null;

    if (loading) {
        return (
            <Content className="user">
                <PageSkeleton />
            </Content>
        );
    }

    if (error) {
        return (
            <Content className="user">
                <ErrorBanner description="This user may not exist or an error was encountered" />
                <PageSkeleton />
            </Content>
        );
    }

    const user = data ? data.user : null;
    const viewerIsUser = viewer.id === match.params.id;

    const userProfileElement = user ? (
        <UserProfile
            user={user}
            viewerIsUser={viewerIsUser}
            viewer={viewer}
            setViewer={setViewer}
            handleUserRefetch={handleUserRefetch}
        />
    ) : null;

    //does user have listings and bookings
    const userListings = user ? user.listings : null;
    const userBookings = user ? user.bookings : null;

    const userListingsElement = userListings ? (
        <UserListings
            userListings={userListings}
            listingsPage={listingsPage}
            limit={PAGE_LIMIT}
            setListingsPage={setListingsPage}
        />
    ) : null;

    const userBookingsElement = userBookings ? (
        <UserBookings
            userBookings={userBookings}
            bookingsPage={bookingsPage}
            limit={PAGE_LIMIT}
            setBookingsPage={setBookingsPage}
        />
    ) : null;

    return (
        <Content className="user">
            {stripeErrorBanner}
            <Row gutter={12} justify="space-between">
                <Col xs={24}>{userProfileElement}</Col>
                <Col xs={24}>
                    {userListingsElement}
                    {userBookingsElement}
                </Col>
            </Row>
        </Content>
    );
};
