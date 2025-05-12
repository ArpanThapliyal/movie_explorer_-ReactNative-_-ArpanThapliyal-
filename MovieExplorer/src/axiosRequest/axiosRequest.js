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

//sign-out api
export const LogoutRequest = async (user_token) => {
  return axios.delete(
    'https://movie-explorer-app.onrender.com/users/sign_out',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization : `Bearer ${user_token}`
      },
    }
  );
};

//all movies api
export const GetAllMovies = async (page = 1, perPage = 8) => {
  try {
    const res = await axios.get(`https://movie-explorer-app.onrender.com/api/v1/movies?page=${page}&per_page=${perPage}`);
    return res.data.movies;
  } catch (err) {
    console.log("some error occurred", err);
    return null;
  }
};


//get single movie api
export const GetMovieById = async (id,token) =>{
  try{
    const res = await axios.get(`https://movie-explorer-app.onrender.com/api/v1/movies/${id}`,
    {
      headers:{
        'Content-Type':'application/json',
        Authorization : `Bearer ${token}`
      }
    }
    );
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

// Update movie
export const UpdateMovieRequest = async (id, formData, token) => {
  try {
    const res = await axios.patch(
      `https://movie-explorer-app.onrender.com/api/v1/movies/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error('UpdateMovieRequest error:', err.response?.data || err);
    throw err;
  }
};

// Delete movie
export const DeleteMovieRequest = async (id, token) => {
  try {
    const res = await axios.delete(
      `https://movie-explorer-app.onrender.com/api/v1/movies/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Movie deleted successfully');
    return res.data;
  } catch (err) {
    console.error('DeleteMovieRequest error:', err.response?.data || err);
    throw err;
  }
};

// adding device token to backend
export const addDeviceNotification = async (device_token, user_token) => {
  try {
    const res = await axios.post(
      'https://movie-explorer-app.onrender.com/api/v1/update_device_token',
      { device_token },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user_token}`,
        },
      }
    );
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(
      'addDeviceNotification error:',
      error.response?.data || error.message || error
    );
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


//subscription api's

//this is the api for checking the subscription
export const checkSubscriptionStatus = async(user_token)=>{
  try {
    const res = await axios.get(`https://movie-explorer-app.onrender.com/api/v1/subscriptions/status`,
    {
      headers : {
        'Content-Type':'application/json',
        Authorization: `Bearer ${user_token}`,
      }
    }
    );
    return res.data;
    
  } catch (error) {
    console.log("some error occured",err);
    return null;
  };
}


