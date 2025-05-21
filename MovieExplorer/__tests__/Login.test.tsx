// __tests__/Login.test.tsx
/**
 * @format
 */

// 1) MOCK AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
  }));
  
  // 2) MOCK RFValue
  jest.mock('react-native-responsive-fontsize', () => ({ RFValue: (x: number) => x }));
  
  // 3) MOCK axios
  jest.mock('../src/axiosRequest/axiosRequest', () => ({
    LoginRequest: jest.fn(),
  }));
  
  // 4) MOCK react‑redux
  jest.mock('react-redux', () => ({
    useDispatch: () => jest.fn(),
  }));
  
  import React from 'react';
  import { render } from '@testing-library/react-native';
  import Login from '../src/screen/Login';
  
  describe('Login screen (simple render)', () => {
    it('renders inputs and button without native errors', () => {
      const { getByPlaceholderText, getByText } = render(
        <Login navigation={{ replace: jest.fn(), navigate: jest.fn() } as any} />
      );
      expect(getByPlaceholderText('Email')).toBeTruthy();
      expect(getByText('Sign in')).toBeTruthy();
    });
  });
  