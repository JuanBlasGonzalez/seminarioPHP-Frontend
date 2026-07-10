import { useState, useEffect, useRef } from 'react';
import {getAssetsService} from '../../services/asset.services';
import { REFRESH_INTERVAL_MS } from '../../utils/constants';
import './StatPage.css';

function StatPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
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

  const sorted = [...assets].sort((a, b) => {
    const valA = sortBy === 'price' ? Number(a.current_price) : a.name.toLowerCase();
    const valB = sortBy === 'price' ? Number(b.current_price) : b.name.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

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

      <table className="stat-page__table">
        <thead>
          <tr>
            <th onClick={() => toggleSort('name')} className="stat-page__sortable">
              Nombre {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => toggleSort('price')} className="stat-page__sortable">
              Precio {sortBy === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
            </th>
            <th>Evolución</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.name}</td>
              <td className="stat-page__price">
                ${Number(asset.current_price).toFixed(2)}
              </td>
              <td className={`stat-page__evolution--${asset.evolution}`}>
                {asset.evolution === 'up' && '▲'}
                {asset.evolution === 'down' && '▼'}
                {asset.evolution === 'neutral' && '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatPage;