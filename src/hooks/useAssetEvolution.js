import { useState, useEffect } from 'react';
import { getAssetsService } from '../services/asset.services';
import { REFRESH_INTERVAL_MS } from '../utils/constants';

export function useAssetEvolution() {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');

  const fetchAssets = async (updatePrevious = true, params = {}) => {
    try {
      const response = await getAssetsService(params);
      const data = response.data;

      const stored = sessionStorage.getItem('previous_prices');
      const prevPrices = stored ? JSON.parse(stored) : {};

      const withEvolution = data.map((asset) => {
        const prevPrice = prevPrices[asset.id];
        let evolution = 'neutral';
        if (prevPrice !== undefined) {
          if (Number(asset.current_price) > Number(prevPrice)) evolution = 'up';
          else if (Number(asset.current_price) < Number(prevPrice)) evolution = 'down';
        }
        return { ...asset, evolution };
      });

      if (updatePrevious) {
        const newPrevious = {};
        data.forEach((asset) => {
          newPrevious[asset.id] = asset.current_price;
        });
        sessionStorage.setItem('previous_prices', JSON.stringify(newPrevious));
      }

      setAssets([...withEvolution]);
      setError('');
    } catch (err) {
      setError('No se pudieron cargar los activos.');
    }
  };

  useEffect(() => {
    fetchAssets(false);
    const interval = setInterval(() => fetchAssets(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return { assets, error, fetchAssets };
}