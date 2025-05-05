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
    const res = await axios.get('https://movie-explorer-app.onrender.com/api/v1/movies')
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

