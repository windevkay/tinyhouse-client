import React from 'react';
import { Button, Card, Divider, Typography, DatePicker } from 'antd';
import moment, { Moment } from 'moment';

import { formatListingPrice, displayErrorMessage } from '../../../../lib/utils';

import { Listing as ListingData } from '../../../../lib/graphql/queries/Listing/__generated__/Listing';
import { Viewer } from '../../../../lib/types';
import { BookingsIndex } from './types';

const { Paragraph, Title, Text } = Typography;

interface Props {
    viewer: Viewer;
    host: ListingData['listing']['host'];
    price: number;
    bookingsIndex: ListingData['listing']['bookingsIndex'];
    checkInDate: Moment | null;
    checkOutDate: Moment | null;
    setCheckInDate: (checkInDate: Moment | null) => void;
    setCheckOutDate: (checkOutDate: Moment | null) => void;
    setModalVisible: (modalVisible: boolean) => void;
}

export const ListingCreateBooking = ({
    viewer,
    host,
    price,
    bookingsIndex,
    checkInDate,
    checkOutDate,
    setCheckInDate,
    setCheckOutDate,
    setModalVisible,
}: Props) => {
    const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

    const dateIsBooked = (currentDate: Moment) => {
        const year = moment(currentDate).year();
        const month = moment(currentDate).month();
        const day = moment(currentDate).date();

        if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
            return Boolean(bookingsIndexJSON[year][month][day]);
        } else {
            return false;
        }
    };

    const disabledDate = (currentDate?: Moment) => {
        if (currentDate) {
            const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf('day'));
            return dateIsBeforeEndOfDay || dateIsBooked(currentDate);
        } else {
            return false;
        }
    };

    const verifyAndSetCheckoutDate = (selectedCheckOutDate: Moment | null) => {
        if (checkInDate && selectedCheckOutDate) {
            if (moment(selectedCheckOutDate).isBefore(checkInDate, 'days')) {
                return displayErrorMessage(`Checkout date cannot be prior to check in!`);
            }

            let dateCursor = checkInDate;
            while (moment(dateCursor).isBefore(selectedCheckOutDate, 'days')) {
                dateCursor = moment(dateCursor).add(1, 'days');

                const year = moment(dateCursor).year();
                const month = moment(dateCursor).month();
                const day = moment(dateCursor).date();

                if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month] && bookingsIndexJSON[year][month][day]) {
                    return displayErrorMessage(
                        'Sorry, the period of time selected overlaps with another existing booking on this listing',
                    );
                }
            }
        }
        setCheckOutDate(selectedCheckOutDate);
    };

    const viewerIsHost = viewer.id === host.id;
    const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet;
    const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
    const buttonDisabled = checkOutInputDisabled || !checkInDate || !checkOutDate;

    let buttonMessage = 'You wont be charged yet!';
    if (!viewer.id) {
        buttonMessage = 'You have to be signed in to book a listing';
    } else if (viewerIsHost) {
        buttonMessage = 'You cant book your own listing!';
    } else if (!host.hasWallet) {
        buttonMessage = 'Host has disconnected from Stripe and cant receive payments';
    }

    return (
        <div className="listing-booking">
            <Card className="listing-booking__card">
                <div>
                    <Paragraph>
                        <Title level={2} className="listing-booking__card-title">
                            {formatListingPrice(price)}
                            <span>/day</span>
                        </Title>
                    </Paragraph>
                    <Divider />
                    <div className="listing-booking__card-date-picker">
                        <Paragraph strong>Check In</Paragraph>
                        <DatePicker
                            value={checkInDate ? checkInDate : undefined}
                            format={'YYYY/MM/DD'}
                            showToday={false}
                            disabled={checkInInputDisabled}
                            onChange={(value) => setCheckInDate(value)}
                            disabledDate={disabledDate}
                            onOpenChange={() => setCheckOutDate(null)}
                        />
                    </div>
                    <div className="listing-booking__card-date-picker">
                        <Paragraph strong>Check Out</Paragraph>
                        <DatePicker
                            value={checkOutDate ? checkOutDate : undefined}
                            format={'YYYY/MM/DD'}
                            showToday={false}
                            onChange={(value) => verifyAndSetCheckoutDate(value)}
                            disabledDate={disabledDate}
                            disabled={checkOutInputDisabled}
                        />
                    </div>
                </div>
                <Divider />
                <Button
                    disabled={buttonDisabled}
                    size="large"
                    type="primary"
                    className="listing-booking__card-cta"
                    onClick={() => setModalVisible(true)}
                >
                    Request to book!
                </Button>
                <Text type="secondary" mark>
                    {buttonMessage}
                </Text>
            </Card>
        </div>
    );
};
