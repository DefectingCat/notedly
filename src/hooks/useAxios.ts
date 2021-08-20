import axios from 'axios';

const useAxios = () => {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:4001/upload',
  });

  return instance;
};

export default useAxios;
