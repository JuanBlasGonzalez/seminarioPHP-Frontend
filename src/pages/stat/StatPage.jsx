import { useState, useTransition } from 'react';
import { useAssetEvolution } from '../../hooks/useAssetEvolution';
import AssetTable from '../../components/AssetTable/AssetTable';
import './StatPage.css';

function StatPage() {
  const { assets, error, fetchAssets } = useAssetEvolution();
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const params = {};
      if (search) params.type = search;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      await fetchAssets(false, params);
    });
  };

  if (isPending && assets.length === 0) return <p>Cargando activos...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="stat-page">
      <h2>Cotizaciones del mercado</h2>
      <p className="stat-page__subtitle">
        Precios actualizados automáticamente cada 3 minutos.
      </p>

      <form className="stat-page__search-container" onSubmit={handleSearch}>
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
        <button type="submit" className="btn">Buscar</button>
      </form>

      <AssetTable assets={assets} showActions={false} />
    </div>
  );
}

export default StatPage;