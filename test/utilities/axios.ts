import Axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

export const axios: AxiosInstance = Axios.create({
  baseURL: 'http://localhost:3001/',
});

export function getAxiosInstance(config?: CreateAxiosDefaults): AxiosInstance {
  return Axios.create(config);
}
