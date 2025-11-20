import axios from 'axios';
import { responseInterceptor, errorInterceptor } from './interceptors';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error),
);

export { api };