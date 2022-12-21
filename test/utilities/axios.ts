import Axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { Agent } from 'http';

export const axios: AxiosInstance = getAxiosInstance({ baseURL: 'http://localhost:3001/' });

export function getAxiosInstance(config?: CreateAxiosDefaults): AxiosInstance {
  const axiosConfig = { ...config };
  axiosConfig.httpAgent = new Agent({ keepAlive: false }); // workaround
  return Axios.create(axiosConfig);
}
