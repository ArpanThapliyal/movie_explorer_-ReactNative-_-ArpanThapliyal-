import axios from 'axios';

export const signUpRequest = async (data) => {
  return axios.post(
    'https://movie-explorer-app.onrender.com/api/v1/auth/sign_up',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
export const LoginRequest = async (data) => {
  return axios.post(
    'https://movie-explorer-app.onrender.com/api/v1/auth/sign_in',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
