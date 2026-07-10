import api from '../config/api';

export const getAssetsService = (params = {}) => api.get('/assets', { params });

export const updateAssetsPricesService = () => api.put('/assets');

export const getAssetHistoryService = (assetId, quantity) => 
  api.get(`/assets/${assetId}/history/${quantity}`);