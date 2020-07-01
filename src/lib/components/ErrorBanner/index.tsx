import React from 'react';
import { Alert } from 'antd';

interface Props {
    message?: string;
    description?: string;
}

export const ErrorBanner = ({
    message = 'Uh oh! Something went wrong 😢',
    description = 'Please check your network connection and try again',
}: Props) => {
    return <Alert banner closable message={message} description={description} type="error" className="error-banner" />;
};
