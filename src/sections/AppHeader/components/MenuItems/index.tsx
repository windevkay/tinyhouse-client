import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Button, Menu, Avatar } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';

import { LOG_OUT } from '../../../../lib/graphql/mutations';
import { LogOut as LogOutData } from '../../../../lib/graphql/mutations/LogOut/__generated__/LogOut';

import { Viewer } from '../../../../lib/types';

import { displaySuccessNotification, displayErrorMessage } from '../../../../lib/utils';

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

export const MenuItems = ({ viewer, setViewer }: Props) => {
    const [logOut] = useMutation<LogOutData>(LOG_OUT, {
        onCompleted: (data) => {
            if (data && data.logOut) {
                setViewer(data.logOut);
                sessionStorage.removeItem('token');
                displaySuccessNotification("You've successfully logged out!");
            }
        },
        //eslint-disable-next-line
        onError: (data) => {
            displayErrorMessage('Something happened and we could not log you out. Try again');
        },
    });

    const handleLogOut = () => {
        logOut();
    };

    const subMenuLogin =
        viewer.id && viewer.avatar ? (
            <SubMenu title={<Avatar src={viewer.avatar} />}>
                <Item key="/user" icon={<UserOutlined />}>
                    <Link to={`/user/${viewer.id}`}>Profile</Link>
                </Item>
                <Item key="/logout" icon={<LogoutOutlined />}>
                    <Button type="primary" onClick={handleLogOut}>
                        Logout
                    </Button>
                </Item>
            </SubMenu>
        ) : (
            <Item>
                <Link to="/login">
                    <Button type="primary">Sign In</Button>
                </Link>
            </Item>
        );

    return (
        <Menu mode="horizontal" selectable={false} className="menu">
            <Item key="/host" icon={<HomeOutlined />}>
                <Link to="/host">Host</Link>
            </Item>
            {subMenuLogin}
        </Menu>
    );
};
