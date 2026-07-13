import { useState, useEffect, useCallback, useTransition } from 'react';
import { getTransactionsService } from '../../services/transaction.services';
import { getAssetsService } from '../../services/asset.services';
import './OperacionesPage.css';

function OperacionesPage() {
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({ type: '', asset_id: '' });
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getAssetsService()
      .then((res) => setAssets(res.data))
      .catch(() => {});
  }, []);

  const fetchTransactions = useCallback(() => {
    startTransition(async () => {
      try {
        const params = {};
        if (filters.type) params.type = filters.type;
        if (filters.asset_id) params.asset_id = filters.asset_id;

        const response = await getTransactionsService(params);
        setTransactions(response.data);
        setError('');
      } catch (err) {
        setError('No se pudo cargar el historial.');
      }
    });
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="operaciones-page">
      <h2>Mis operaciones</h2>

      <div className="operaciones-page__filters">
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Todos los tipos</option>
          <option value="buy">Compras</option>
          <option value="sell">Ventas</option>
        </select>

        <select
          value={filters.asset_id}
          onChange={(e) => setFilters({ ...filters, asset_id: e.target.value })}
        >
          <option value="">Todos los activos</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {isPending && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {!isPending && !error && (
        <table className="operaciones-page__table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Activo</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{new Date(tx.transaction_date).toLocaleString()}</td>
                <td>
                  <span className={`operaciones-page__type operaciones-page__type--${tx.transaction_type}`}>
                    {tx.transaction_type === 'buy' ? 'Compra' : 'Venta'}
                  </span>
                </td>
                <td>{tx.asset_name}</td>
                <td>{tx.quantity}</td>
                <td>${Number(tx.price_per_unit).toFixed(2)}</td>
                <td>${Number(tx.total_amount).toFixed(2)}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="6">No hay operaciones registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OperacionesPage;