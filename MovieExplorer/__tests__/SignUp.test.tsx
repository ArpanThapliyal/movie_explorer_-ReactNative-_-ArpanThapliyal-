// __tests__/SignUp.test.tsx
/**
 * @format
 */

// 1) MOCK AsyncStorage before anything else:
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
  }));
  
  // 2) MOCK RFValue
  jest.mock('react-native-responsive-fontsize', () => ({ RFValue: (x: number) => x }));
  
  // 3) MOCK axios call
  jest.mock('../src/axiosRequest/axiosRequest', () => ({
    signUpRequest: jest.fn(),
  }));
  
  // 4) MOCK react‑redux
  jest.mock('react-redux', () => ({
    useDispatch: () => jest.fn(),
  }));
  
  // NOW import your component:
  import React from 'react';
  import { render } from '@testing-library/react-native';
  import SignUp from '../src/screen/SignUp';
  
  describe('SignUp screen (simple render)', () => {
    it('renders form fields and button without native errors', () => {
      const { getByPlaceholderText, getAllByText } = render(
        <SignUp navigation={{ replace: jest.fn(), navigate: jest.fn() } as any} />
      );
      expect(getByPlaceholderText('Full Name')).toBeTruthy();
      expect(getAllByText('Create Account').length).toBeGreaterThan(0);
    });
  });
  