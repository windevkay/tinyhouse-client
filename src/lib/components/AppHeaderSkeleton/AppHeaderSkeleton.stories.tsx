import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { AppHeaderSkeleton } from './index';

import README from './README.md';

storiesOf('App Header', module)
    .addParameters({
        readme: {
            sidebar: README,
        },
    })
    .add('header component', () => <AppHeaderSkeleton />);
