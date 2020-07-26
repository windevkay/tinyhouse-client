import React from 'react';
import { List, Card, Skeleton } from 'antd';
// eslint-disable-next-line
const listingLoadingCardCover = require('../../assets/listing-loading-card-cover.jpg');

export const ListingsSkeleton = () => {
    const emptyData = [{}, {}, {}, {}, {}, {}, {}, {}];
    return (
        <div>
            <Skeleton paragraph={{ rows: 1 }} />
            <List
                grid={{
                    gutter: 8,
                    xs: 1,
                    sm: 2,
                    lg: 4,
                }}
                dataSource={emptyData}
                renderItem={() => (
                    <List.Item>
                        <Card
                            cover={
                                <div
                                    style={{ backgroundImage: `url(${listingLoadingCardCover})` }}
                                    className="listings-skeleton__card-cover-img"
                                ></div>
                            }
                            loading
                            className="listings-skeleton__card-cover-img"
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};
