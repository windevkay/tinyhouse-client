import React from 'react';

import { useQuery, useMutation } from 'react-apollo';
import { Listings as ListingsData } from './__generated__/Listings';
import { List, Avatar, Button, Spin, Alert } from 'antd';

import { DeleteListing as DeleteListingData, DeleteListingVariables } from './__generated__/DeleteListing';

import { LISTINGS, DELETE_LISTING } from './gql';
import { ListingsSkeleton } from './components';
import './styles/Listings.css';

interface Props {
    title: string;
}

export const Listings = ({ title }: Props) => {
    const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);

    const [deleteListing, { loading: deleteListingLoading, error: deleteListingError }] = useMutation<
        DeleteListingData,
        DeleteListingVariables
    >(DELETE_LISTING);

    const handleDeleteListing = async (id: string) => {
        await deleteListing({ variables: { id } });
        refetch();
    };

    const listings = data ? data.listings : null;

    const listingsList = listings ? (
        <List
            itemLayout="horizontal"
            dataSource={listings}
            renderItem={(listing) => (
                <List.Item
                    actions={[
                        <Button key={listing.id} type="primary" onClick={() => handleDeleteListing(listing.id)}>
                            Delete
                        </Button>,
                    ]}
                >
                    <List.Item.Meta
                        title={listing.title}
                        description={listing.address}
                        avatar={<Avatar src={listing.image} shape="square" size={48} />}
                    />
                </List.Item>
            )}
        />
    ) : null;

    if (error) {
        return (
            <div className="listings">
                <ListingsSkeleton title={title} error />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="listings">
                <ListingsSkeleton title={title} />
            </div>
        );
    }

    const deleteListingErrorAlert = deleteListingError ? (
        <Alert type="error" message="Something went wrong" className="listings__alert" />
    ) : null;

    return (
        <div className="listings">
            <Spin spinning={deleteListingLoading}>
                {deleteListingErrorAlert}
                <h2>{title}</h2>
                {listingsList}
            </Spin>
        </div>
    );
};
