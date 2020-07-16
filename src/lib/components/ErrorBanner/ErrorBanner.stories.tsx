import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { ErrorBanner } from './index';

storiesOf('ErrorBanner', module)
    .add('without props', () => <ErrorBanner />)
    .add('with props', () => <ErrorBanner message={'Error Message'} description={'Error Description'} />);
