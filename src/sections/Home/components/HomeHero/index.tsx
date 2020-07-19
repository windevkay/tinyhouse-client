import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Input, Row, Typography } from 'antd';
// eslint-disable-next-line
const torontoImage = require('../../assets/toronto.jpg');
// eslint-disable-next-line
const dubaiImage = require('../../assets/dubai.jpg');
// eslint-disable-next-line
const losAngelesImage = require('../../assets/los-angeles.jpg');
// eslint-disable-next-line
const londonImage = require('../../assets/london.jpg');

const { Title } = Typography;
const { Search } = Input;

interface Props {
    onSearch: (value: string) => void;
}

export const HomeHero = ({ onSearch }: Props) => {
    return (
        <div className="home-hero">
            <div className="home-hero__search">
                <Title className="home-hero__title">Find a place you will love to stay</Title>
                <Search
                    placeholder="Search 'San Fransisco'"
                    size="large"
                    enterButton
                    className="home-hero__search-input"
                    onSearch={onSearch}
                />
            </div>
            <Row gutter={12} className="home-hero__cards">
                <Col xs={12} md={6}>
                    <Link to="/listings/toronto">
                        <Card cover={<img alt="Toronto" src={torontoImage} />}>Toronto</Card>
                    </Link>
                </Col>
                <Col xs={12} md={6}>
                    <Link to="/listings/dubai">
                        <Card cover={<img alt="Dubai" src={dubaiImage} />}>Dubai</Card>
                    </Link>
                </Col>
                <Col xs={0} md={6}>
                    <Link to="/listings/los%20angeles">
                        <Card cover={<img alt="Los Angeles" src={losAngelesImage} />}>Los Angeles</Card>
                    </Link>
                </Col>
                <Col xs={0} md={6}>
                    <Link to="/listings/london">
                        <Card cover={<img alt="London" src={londonImage} />}>London</Card>
                    </Link>
                </Col>
            </Row>
        </div>
    );
};
