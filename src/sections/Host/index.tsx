import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { Layout, Typography, Form, Input, InputNumber, Radio, Upload, Button } from 'antd';
import { HomeOutlined, BankOutlined, LoadingOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';

import { HOST_LISTING } from '../../lib/graphql/mutations';
import {
    HostListing as HostListingData,
    HostListingVariables,
} from '../../lib/graphql/mutations/HostListing/__generated__/HostListing';
import { ListingType } from '../../lib/graphql/globalTypes';

import { Viewer } from '../../lib/types';
import { iconColor, displayErrorMessage, displaySuccessNotification } from '../../lib/utils';

interface Props {
    viewer: Viewer;
}

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

export const Host = ({ viewer }: Props) => {
    const [imageLoading, setImageLoading] = useState(false);
    const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

    const [hostListing, { loading, data }] = useMutation<HostListingData, HostListingVariables>(HOST_LISTING, {
        onCompleted: () => {
            displaySuccessNotification('You have successfully created your listing!');
        },
        onError: () => {
            displayErrorMessage('Sorry! We could not create your listing. Please try again later.');
        },
    });

    const handleImageUpload = (info: UploadChangeParam) => {
        const { file } = info;
        if (file.status === 'uploading') {
            setImageLoading(true);
            return;
        }
        if (file.status === 'done' && file.originFileObj) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            getBase64Value(file.originFileObj, (imageBase64Value: string) => {
                setImageBase64Value(imageBase64Value);
                setImageLoading(false);
            });
        }
    };

    const handleHostListing = (values: any) => {
        const fullAddress = `${values.address}, ${values.cityTown}, ${values.stateProvince}, ${values.zipPostal}`;
        const input = {
            ...values,
            address: fullAddress,
            image: imageBase64Value,
            price: values.price * 100,
        };
        delete input.city;
        delete input.state;
        delete input.postalCode;

        hostListing({
            variables: {
                input,
            },
        });
    };

    if (!viewer.id || !viewer.hasWallet) {
        return (
            <Content className="host-content">
                <div className="host__form-header">
                    <Title level={4} className="host__form-title">
                        You have to be signed in and connected with Stripe to host a listing!
                    </Title>
                    <Text type="secondary">
                        You can sign in at the <Link to="/login">login</Link> page and connect with Stripe shortly
                        after.
                    </Text>
                </div>
            </Content>
        );
    }

    if (loading) {
        return (
            <Content className="host-content">
                <div className="host__form-header">
                    <Title level={3} className="host__form-title">
                        Please wait!
                    </Title>
                    <Text type="secondary">We are creating your listing now</Text>
                </div>
            </Content>
        );
    }
    //redirect to single listing page on success
    if (data && data.hostListing) {
        return <Redirect to={`/listing/${data.hostListing.id}`} />;
    }
    // ANTD V4 method for form usage
    const [form] = Form.useForm();

    return (
        <Content className="host-content">
            <Form layout="vertical" form={form} onFinish={handleHostListing}>
                <div className="host__form-header">
                    <Title level={3} className="host__form-title">
                        Hi ! Lets get started listing your place! 😃
                    </Title>
                    <Text type="secondary">
                        In this form we will collect some basic and additional information about your lsiting.
                    </Text>
                </div>

                <Item
                    label="Home Type"
                    name="homeType"
                    rules={[{ required: true, message: 'Please select a home type!' }]}
                >
                    <Radio.Group>
                        <Radio.Button value={ListingType.APARTMENT}>
                            <BankOutlined style={{ color: iconColor }} />
                            <span> Apartment</span>
                        </Radio.Button>
                        <Radio.Button value={ListingType.HOUSE}>
                            <HomeOutlined style={{ color: iconColor }} />
                            <span> House</span>
                        </Radio.Button>
                    </Radio.Group>
                </Item>

                <Item
                    label="Max # of Guests"
                    name="maxNumOfGuests"
                    rules={[{ required: true, message: 'Please enter a max number of guests!' }]}
                >
                    <InputNumber min={1} placeholder="4" />
                </Item>

                <Item
                    label="Title"
                    extra="Max character count of 45"
                    name="title"
                    rules={[{ required: true, message: 'Please enter a title!' }]}
                >
                    <Input maxLength={45} placeholder="The iconic and luxurious Bel-Air mansion" />
                </Item>

                <Item
                    label="Description of listing"
                    extra="Max character count of 400"
                    name="description"
                    rules={[{ required: true, message: 'Please enter a description!' }]}
                >
                    <Input.TextArea
                        rows={3}
                        maxLength={400}
                        placeholder="Modern, clean and iconnic home of the Fresh Prince. Situated in the heart of Bel-Air, Los Angeles"
                    />
                </Item>

                <Item label="Address" name="address" rules={[{ required: true, message: 'Please enter an address!' }]}>
                    <Input placeholder="251 North Bristol Avenue" />
                </Item>

                <Item
                    label="City/Town"
                    name="cityTown"
                    rules={[{ required: true, message: 'Please enter a City or Town!' }]}
                >
                    <Input placeholder="Los Angeles" />
                </Item>

                <Item
                    label="State/Province"
                    name="stateProvince"
                    rules={[{ required: true, message: 'Please enter a State or Province!' }]}
                >
                    <Input placeholder="California" />
                </Item>

                <Item
                    label="Zip/Postal Code"
                    name="zipPostal"
                    rules={[{ required: true, message: 'Please enter a Zip or Postal code' }]}
                >
                    <Input placeholder="Please enter a zip code for your listing" />
                </Item>

                <Item
                    label="Image"
                    extra="Images should be under 1MB in size and of type JPG or PNG"
                    name="image"
                    rules={[{ required: true, message: 'Please upload an image!' }]}
                >
                    <div className="host__form-image-upload">
                        <Upload
                            name="image"
                            listType="picture-card"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            beforeUpload={beforeImageUpload}
                            onChange={handleImageUpload}
                        >
                            {imageBase64Value ? (
                                <img src={imageBase64Value} alt="Listing" />
                            ) : (
                                <div>
                                    {imageLoading ? <LoadingOutlined /> : <PlusCircleOutlined />}
                                    <div className="ant-upload-text">Upload</div>
                                </div>
                            )}
                        </Upload>
                    </div>
                </Item>

                <Item
                    label="Price"
                    extra="All prices in $USD/day"
                    name="price"
                    rules={[{ required: true, message: 'Please enter a price for your listing!' }]}
                >
                    <InputNumber min={0} placeholder="120" />
                </Item>

                <Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Item>
            </Form>
        </Content>
    );
};
//these functions dont need or affect anyting inside the component so they can be outside
const beforeImageUpload = (file: File) => {
    const fileIsValidImage = file.type === 'image/jpeg' || file.type === 'image/png';
    const fileIsValidSize = file.size / 1024 / 1024 < 1;

    if (!fileIsValidImage) {
        displayErrorMessage('Your image has to be of type JPG or PNG');
        return false;
    }
    if (!fileIsValidSize) {
        displayErrorMessage('Your image has to be less than 1MB in size');
        return false;
    }
    return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (img: File | Blob, callback: (imageBase64Value: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => {
        //result could be an arraybuffer or null, but its very unlikely, we assert here that it will be a string
        callback(reader.result as string);
    };
};
