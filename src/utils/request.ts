import axios from 'axios';

const request = axios.create({
    timeout: 10000, // Request timeout,
});

export const longRequest = axios.create({
    timeout: 100000, // Request timeout (90 seconds),
});

request.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        console.log(error);

        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default request;