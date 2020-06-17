import React from 'react';
import { render } from '@testing-library/react';
import { Listings } from './Listings';

test('renders the TinyHouse title', () => {
    const passedProp = 'TinyHouse';
    const { getByText } = render(<Listings title={passedProp} />);
    const titleText = getByText(/TinyHouse/i);
    expect(titleText).toBeInTheDocument();
});
