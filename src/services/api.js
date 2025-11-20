import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cricheros-backend.urvish.website/api/nrr';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getPointsTable = async () => {
  try {
    const response = await api.get('/points-table');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch points table');
  }
};

export const calculateNRRRange = async (data) => {
  try {
    const response = await api.post('/calculate', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to calculate NRR range');
  }
};

