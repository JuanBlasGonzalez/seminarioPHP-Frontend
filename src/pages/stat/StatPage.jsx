import { useState, useEffect, useRef } from 'react';
import {getAssetsService} from '../../services/asset.services';
import { REFRESH_INTERVAL_MS } from '../../utils/constants';
import AssetTable from '../../components/AssetTable/AssetTable';
import './StatPage.css';

function StatPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const previousPrices = useRef({});

  const fetchAssets = async (searchTerm = '') => {
    try {
      const params = {};
      if (searchTerm) params.type = searchTerm;

      const response = await getAssetsService(params);
      const data = response.data;

      const withEvolution = data.map((asset) => {
        const prevPrice = previousPrices.current[asset.id];
        let evolution = 'neutral';
        if (prevPrice !== undefined) {
          if (Number(asset.current_price) > Number(prevPrice)) evolution = 'up';
          else if (Number(asset.current_price) < Number(prevPrice)) evolution = 'down';
        }
        return { ...asset, evolution };
      });

      const newPrevious = {};
      data.forEach((asset) => {
        newPrevious[asset.id] = asset.current_price;
      });
      previousPrices.current = newPrevious;

      setAssets(withEvolution);
      setError('');
    } catch (err) {
      setError('No se pudieron cargar los activos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets(search);
    const interval = setInterval(() => fetchAssets(search), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [search]);

  if (loading) return <p>Cargando activos...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="stat-page">
      <h2>Cotizaciones del mercado</h2>
      <p className="stat-page__subtitle">
        Precios actualizados automáticamente cada 3 minutos.
      </p>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="stat-page__search"
      />

      <AssetTable
        assets={assets}
        showActions={false}
      />
    </div>
  );
}

export default StatPage;