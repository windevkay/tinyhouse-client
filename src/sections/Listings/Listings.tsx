import React from 'react';

import { useQuery, useMutation } from 'react-apollo';
import { Listings as ListingsData } from './__generated__/Listings';
import { DeleteListing as DeleteListingData, DeleteListingVariables } from './__generated__/DeleteListing';

import { LISTINGS, DELETE_LISTING } from './gql';

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
        <ul>
            {listings.map((listing) => {
                return (
                    <li key={listing.id}>
                        {listing.title} <button onClick={() => handleDeleteListing(listing.id)}>Delete</button>
                    </li>
                );
            })}
        </ul>
    ) : null;

    if (error) {
        return <h2>Something went wrong</h2>;
    }

    if (loading) {
        return <h2>Loading...</h2>;
    }

    const deleteListingLoadingMessage = deleteListingLoading ? <h4>Deletion in progress...</h4> : null;

    const deleteListingErrorMessage = deleteListingError ? <h4>Something went wrong...</h4> : null;

    return (
        <div>
            <h2>{title}</h2>
            {listingsList}
            {deleteListingLoadingMessage}
            {deleteListingErrorMessage}
        </div>
    );
};
