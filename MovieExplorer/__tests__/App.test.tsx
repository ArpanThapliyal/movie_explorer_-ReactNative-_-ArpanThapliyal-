// __tests__/App.test.tsx
/**
 * @format
 */

 // 1) MOCK react‑redux **before** imports
 jest.mock('react-redux', () => ({
  Provider: ({ children }: any) => children,
  useDispatch: () => jest.fn(),
  useSelector: () => ({ user: { token: null } }),  // stub your selector
}));

// 2) STUB notifee
jest.mock('@notifee/react-native', () => ({
  createChannel: jest.fn().mockResolvedValue('chan'),
  displayNotification: jest.fn().mockResolvedValue(undefined),
}));

// 3) STUB messaging
jest.mock('@react-native-firebase/messaging', () => () => ({
  getToken: jest.fn(),
  onMessage: jest.fn(() => jest.fn()),
}));

// 4) STUB Navigation & RFValue
jest.mock('../src/navigation/Navigation', () => () => null);
jest.mock('react-native-responsive-fontsize', () => ({ RFValue: (x: number) => x }));

import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('App (simple render)', () => {
 it('mounts without crashing or native errors', () => {
   const { toJSON } = render(<App />);
   expect(toJSON()).toBeTruthy();
 });
});
