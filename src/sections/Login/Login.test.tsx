/* eslint-disable */
import React from 'react';
import { shallow, mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { Card, Layout } from 'antd';

import { Login } from './index';
//import { jestMocks } from './__mocks__';

import googleLogo from './assets/google_logo.jpg';

const { Content } = Layout;

const renderType = { mount: 'mount', shallow: 'shallow' };

const returnLoginComponent = (type: string) => {
    if (type === renderType.mount) {
        const LoginComponent = mount(
            <MockedProvider>
                <Login setViewer={() => {}} />
            </MockedProvider>,
        );
        return LoginComponent;
    } else {
        const LoginComponent = shallow(
            <MockedProvider>
                <Login setViewer={() => {}} />
            </MockedProvider>,
        );
        return LoginComponent;
    }
};

describe('Login', () => {
    it('Renders the snapshot', () => {
        const LoginComponent = mount(
            <MockedProvider /*mocks={mocks} addTypename={false}*/>
                <Login setViewer={() => {}} />
            </MockedProvider>,
        );
        expect(LoginComponent).toMatchSnapshot();
    });

    it('Renders the Card component from AntD', () => {
        const wrapper = returnLoginComponent(renderType.mount);
        expect(wrapper.find(Card)).toHaveLength(1);
    });

    it('Renders the Content component from AntD', () => {
        const wrapper = returnLoginComponent(renderType.mount);
        expect(wrapper.find(Content)).toHaveLength(1);
    });

    it('Renders the Google Logo', () => {
        const wrapper = returnLoginComponent(renderType.mount);
        expect(
            wrapper.containsMatchingElement(
                <img src={googleLogo} alt="Google Logo" className="log-in-card__google-button-logo" />,
            ),
        ).toBeTruthy();
    });
});
