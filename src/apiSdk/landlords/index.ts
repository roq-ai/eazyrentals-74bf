import axios from 'axios';
import queryString from 'query-string';
import { LandlordInterface, LandlordGetQueryInterface } from 'interfaces/landlord';
import { GetQueryInterface } from '../../interfaces';

export const getLandlords = async (query?: LandlordGetQueryInterface) => {
  const response = await axios.get(`/api/landlords${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLandlord = async (landlord: LandlordInterface) => {
  const response = await axios.post('/api/landlords', landlord);
  return response.data;
};

export const updateLandlordById = async (id: string, landlord: LandlordInterface) => {
  const response = await axios.put(`/api/landlords/${id}`, landlord);
  return response.data;
};

export const getLandlordById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/landlords/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLandlordById = async (id: string) => {
  const response = await axios.delete(`/api/landlords/${id}`);
  return response.data;
};
