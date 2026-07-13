import { useState, useEffect, useRef, useTransition } from 'react';
import { getAssetsService } from '../../services/asset.services';
import { REFRESH_INTERVAL_MS } from '../../utils/constants';
import AssetTable from '../../components/AssetTable/AssetTable';
import './StatPage.css';

function StatPage() {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isPending, startTransition] = useTransition();
  const previousPrices = useRef({});
  

  const fetchAssets = (searchTerm = '', min = '', max = '') => {
    startTransition(async () => {
      try {
        const params = {};
        if (searchTerm) params.type = searchTerm;
        if (min) params.min_price = min;
        if (max) params.max_price = max;

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
          if(err.response?.status === 400) {
            setAssets([]);
          } else {
             setError('No se pudieron cargar los activos.');
          }
      }
    });
  };

  useEffect(() => {
    fetchAssets('', '', '');
    const interval = setInterval(() => fetchAssets('', '', ''), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []); 

  if (isPending && assets.length === 0) return <p>Cargando activos...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="stat-page">
      <h2>Cotizaciones del mercado</h2>
      <p className="stat-page__subtitle">
        Precios actualizados automáticamente cada 3 minutos.
      </p>

      <form
        className="stat-page__search-container"
        onSubmit={(e) => {
          e.preventDefault();
          fetchAssets(search, minPrice, maxPrice);
        }}
      >
        <input
          type="text"
          placeholder="Buscar por nombre exacto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="stat-page__search"
        />
        <input
          type="number"
          placeholder="Precio mínimo"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="stat-page__search"
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="stat-page__search"
        />
        <button type="submit" className="btn">
          Buscar
        </button>
      </form>

      {assets.length === 0 && !isPending && (
      <p className="stat-page__no-results">No se encontraron activos.</p>
      )}

      <AssetTable assets={assets} showActions={false} />
    </div>
  );
}

export default StatPage;