import { useState } from 'react';
import PriceTag from '../PriceTag/PriceTag';
import EvolutionBadge from '../EvolutionBadge/EvolutionBadge';
import './AssetTable.css';

function AssetTable({ assets, showActions, onBuyClick, onHistoryClick }) {
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const sorted = [...assets].sort((a, b) => {
    const valA = sortBy === 'price' ? Number(a.current_price) : a.name.toLowerCase();
    const valB = sortBy === 'price' ? Number(b.current_price) : b.name.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <table className="asset-table">
      <thead>
        <tr>
          <th onClick={() => toggleSort('name')} className="asset-table__sortable">
            Activo {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => toggleSort('price')} className="asset-table__sortable">
            Precio {sortBy === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
          </th>
          <th>Evolución</th>
          {showActions && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {sorted.map((asset) => (
          <tr key={asset.id}>
            <td>{asset.name}</td>
            <td>
              <PriceTag value={asset.current_price} />
            </td>
            <td>
              <EvolutionBadge evolution={asset.evolution} />
            </td>
            {showActions && (
              <td>
                <div className="asset-table__actions">
                  <button onClick={() => onBuyClick(asset)} className="btn">
                    Comprar
                  </button>
                  <button onClick={() => onHistoryClick(asset)} className="btn btn-secondary">
                    Historial
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AssetTable;