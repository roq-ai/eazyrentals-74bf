import axios from 'axios';
import queryString from 'query-string';
import { LeaseInterface, LeaseGetQueryInterface } from 'interfaces/lease';
import { GetQueryInterface } from '../../interfaces';

export const getLeases = async (query?: LeaseGetQueryInterface) => {
  const response = await axios.get(`/api/leases${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLease = async (lease: LeaseInterface) => {
  const response = await axios.post('/api/leases', lease);
  return response.data;
};

export const updateLeaseById = async (id: string, lease: LeaseInterface) => {
  const response = await axios.put(`/api/leases/${id}`, lease);
  return response.data;
};

export const getLeaseById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/leases/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLeaseById = async (id: string) => {
  const response = await axios.delete(`/api/leases/${id}`);
  return response.data;
};
