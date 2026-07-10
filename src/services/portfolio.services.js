import api from '../config/api';

export const getPortfolioService = () => api.get('/portfolio');

export const deletePortfolioAssetService = (assetId) => api.delete(`/portfolio/${assetId}`);

export const buyAssetService = (assetId, quantity) => 
  api.post('/trade/buy', { asset_id: assetId, quantity });

export const sellAssetService = (assetId, quantity) => 
  api.post('/trade/sell', { asset_id: assetId, quantity });