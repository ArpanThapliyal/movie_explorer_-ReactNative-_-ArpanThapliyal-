import axios from 'axios';

//sign-up api
export const signUpRequest = async (data) => {
  return axios.post(
    'https://movie-explorer-app.onrender.com/users',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

//sign-in api
export const LoginRequest = async (data) => {
  return axios.post(
    'https://movie-explorer-app.onrender.com/users/sign_in',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

//all movies api
export const GetAllMovies = async () =>{
  try{
    const res = await axios.get('https://movie-explorer-app.onrender.com/api/v1/movies?page=1&per_page=35')
    return res.data.movies;
  }catch(err){
    console.log("some error occured",err);
    return null;
  }
};


//get single movie api
export const GetMovieById = async (id) =>{
  try{
    const res = await axios.get(`https://movie-explorer-app.onrender.com/api/v1/movies/${id}`)
    return res.data;
  }catch(err){
    console.log("some error occured",err);
    return null;
  }
};

// add movie
export const AddMovieRequest = async (formData, token) => {
  try {
    const res = await axios.post(
      'https://movie-explorer-app.onrender.com/api/v1/movies',
      formData,                              // <-- send FormData directly
      {
        headers: {
          'Content-Type': 'multipart/form-data',   // <-- multipart
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error('AddMovieRequest error:', err.res?.data || err);
    throw err;
  }
};

// adding device token to backend
export const addDeviceNotification = async (device_token, user_token) => {
  try {
    // Build FormData
    const formData = new FormData();
    formData.append('device_token', device_token);

    // Send request
    const res = await axios.post(
      'https://movie-explorer-app.onrender.com/api/v1/update_device_token',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user_token}`,
        },
      }
    );

    // Return the payload
    return res.data;
  } catch (error) {
    // Log the error for debugging
    console.error('addDeviceNotification error:', error.res?.data || error.message || error);

    // Rethrow so callers can handle or await will reject
    throw error;
  }
};


// enabling and disabling notifications
export const enableNotification = async (user_token) => {
  try {
    const res = await axios.patch(
      'https://movie-explorer-app.onrender.com/api/v1/toggle_notifications',
      null, // no payload—backend handles the toggle logic
      {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      }
    );
    console.log(res.data);
    return res;
  } catch (error) {
    console.error(
      'enabling/disabling notification error:',
      error.res?.data || error.message || error
    );
    throw error;
  }
};
