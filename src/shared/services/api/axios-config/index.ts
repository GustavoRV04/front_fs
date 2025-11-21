import axios from 'axios';
import { responseInterceptor, errorInterceptor } from './interceptors';
import { Enviroment } from '../../../enviroment';

const api = axios.create({
    baseURL: Enviroment.URL_BASE,
});

api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error),
);

export { api };