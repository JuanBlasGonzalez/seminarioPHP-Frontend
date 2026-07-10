import api from '../config/api';

export const getTransactionsService = (params = {}) => 
  api.get('/transactions', { params });