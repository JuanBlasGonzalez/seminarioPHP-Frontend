import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { REFRESH_INTERVAL_MS } from '../../utils/constants';

function StatPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const previousPrices = useRef({});

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets');
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
    fetchAssets();
    const interval = setInterval(fetchAssets, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const filtered = assets
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
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
  if (error) return <p>{error}</p>;

  return (
    <main>
      <h2>Cotizaciones del mercado</h2>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
              Nombre {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => toggleSort('price')} style={{ cursor: 'pointer' }}>
              Precio {sortBy === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
            </th>
            <th>Evolución</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.name}</td>
              <td>${Number(asset.current_price).toFixed(2)}</td>
              <td>
                {asset.evolution === 'up' && '▲'}
                {asset.evolution === 'down' && '▼'}
                {asset.evolution === 'neutral' && '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default StatPage;