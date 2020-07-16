import { storiesOf } from '@storybook/react';
import * as React from 'react';
//import { withReadme } from 'storybook-readme';

import { AppHeaderSkeleton } from './index';

import README from './README.md';

storiesOf('App Header', module)
    //.addDecorator(withReadme(README))
    .addParameters({
        readme: {
            // Show readme before story
            //content: README,
            // Show readme at the addons panel
            sidebar: README,
        },
    })
    .add('header component', () => <AppHeaderSkeleton />);
