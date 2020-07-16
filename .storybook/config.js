import { configure, addDecorator, addParameters } from '@storybook/react';
import { addReadme } from 'storybook-readme';

import '../src/styles/index.css';

addParameters({
    options: {
        theme: { base: '' }, // this is just a workaround for addon-readme
    },
});

addDecorator(addReadme);

const req = require.context('../src', true, /.stories.tsx$/);
function loadStories() {
    req.keys().forEach(req);
}
configure(loadStories, module);
