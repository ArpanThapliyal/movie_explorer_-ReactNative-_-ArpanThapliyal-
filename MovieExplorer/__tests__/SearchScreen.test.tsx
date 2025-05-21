// __tests__/SearchScreen.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SearchScreen from '../src/screen/Search';

//  Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

//  Mock debounce (so it doesn't delay search)
jest.mock('lodash.debounce', () => (fn) => fn);

//  Mock Redux usage
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn((selector) =>
    selector({ user: { role: 'user' } })
  ),
}));

//  Mock GetAllMovies
jest.mock('../src/axiosRequest/axiosRequest', () => ({
  GetAllMovies: jest.fn().mockResolvedValue([
    {
      id: 1,
      title: 'The Matrix',
      release_year: 1999,
      genre: 'Sci-Fi',
      poster_url: 'url1',
    },
    {
      id: 2,
      title: 'Inception',
      release_year: 2010,
      genre: 'Action',
      poster_url: 'url2',
    },
  ]),
}));

describe('SearchScreen', () => {
  it('renders SearchScreen and shows movie list', async () => {
    const { getByText } = render(<SearchScreen />);

    // Wait for API data to populate
    await waitFor(() => {
      expect(getByText('The Matrix')).toBeTruthy();
    });
  });

  it('filters movies based on search input', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<SearchScreen />);

    // Wait for initial data
    await waitFor(() => getByText('The Matrix'));

    const input = getByPlaceholderText('Search by title...');
    fireEvent.changeText(input, 'Matrix');

    await waitFor(() => {
      expect(getByText('The Matrix')).toBeTruthy();
      expect(queryByText('Inception')).toBeNull();
    });
  });
});
