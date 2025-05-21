// __tests__/Dashboard.test.tsx
/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';

// 1) Stub out the dashboardHeader and dashboardBody components
jest.mock(
  '../src/components/dashboard/dashboardHeader',
  () => () => <></>
);
jest.mock(
  '../src/components/dashboard/dashboardBody',
  () => () => <></>
);

// Now import Dashboard
import Dashboard from '../src/screen/Dashboard';

describe('Dashboard screen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<Dashboard />);
    expect(toJSON()).toBeTruthy();
  });

  it('matches snapshot structure', () => {
    const { toJSON } = render(<Dashboard />);
    expect(toJSON()).toMatchSnapshot();
  });
});
