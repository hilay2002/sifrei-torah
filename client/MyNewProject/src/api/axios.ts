import axios from 'axios';

const expressApi = axios.create({
  baseURL: 'http://192.168.1.210:5001', 
});

export default expressApi;