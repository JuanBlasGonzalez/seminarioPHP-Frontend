import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function PortfolioPage() {
  const { user, updateUser } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeAction, setActiveAction] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPortfolio = useCallback(async () => {
    try {
      const response = await api.get('/portfolio');
      setHoldings(response.data);
      setError('');
    } catch (err) {
      setError('No se pudo cargar el portfolio.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await api.get(`/users/${user.id}`);
      updateUser({ balance: response.data.balance });
    } catch (err) {
      console.error(err);
    }
  }, [user.id]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const openAction = (assetId, type) => {
    setActiveAction({ assetId, type });
    setQuantity(1);
    setActionError('');
  };

  const closeAction = () => {
    setActiveAction(null);
    setActionError('');
  };

  const handleConfirmAction = async (holding) => {
    if (!quantity || quantity <= 0) {
      setActionError('La cantidad debe ser mayor a 0.');
      return;
    }

    if (activeAction.type === 'sell' && quantity > Number(holding.quantity)) {
      setActionError('No tenés esa cantidad de unidades para vender.');
      return;
    }

    setActionLoading(true);
    try {
      const endpoint = activeAction.type === 'buy' ? '/trade/buy' : '/trade/sell';
      await api.post(endpoint, { asset_id: holding.asset_id, quantity });
      await fetchPortfolio();
      await fetchBalance();
      closeAction();
    } catch (err) {
      setActionError(err.response?.data?.error || 'No se pudo completar la operación.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (assetId) => {
    try {
      await api.delete(`/portfolio/${assetId}`);
      await fetchPortfolio();
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo eliminar el activo.');
    }
  };

  if (loading) return <p>Cargando portfolio...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <h2>Mi portfolio</h2>
      <p>Saldo disponible: ${Number(user.balance ?? 0).toFixed(2)}</p>

      {holdings.length === 0 && <p>Todavía no tenés activos en tu portfolio.</p>}

      {holdings.map((holding) => {
        const currentValue = Number(holding.quantity) * Number(holding.current_price);
        const isActive = activeAction?.assetId === holding.asset_id;

        return (
          <div key={holding.asset_id}>
            <h3>{holding.name}</h3>
            <p>Cantidad: {holding.quantity}</p>
            <p>Valor actual: ${currentValue.toFixed(2)}</p>

            <button onClick={() => openAction(holding.asset_id, 'buy')}>
              Comprar
            </button>
            <button onClick={() => openAction(holding.asset_id, 'sell')}
              disabled={Number(holding.quantity) <= 0}>
              Vender
            </button>
            <button onClick={() => handleDelete(holding.asset_id)}
              disabled={Number(holding.quantity) !== 0}>
              Eliminar
            </button>

            {isActive && (
              <div>
                <label>Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  max={activeAction.type === 'sell' ? holding.quantity : 20}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <p>
                  {activeAction.type === 'buy' ? 'Costo estimado' : 'Recibirás aprox.'}: $
                  {(quantity * Number(holding.current_price)).toFixed(2)}
                </p>
                {actionError && <p>{actionError}</p>}
                <button onClick={() => handleConfirmAction(holding)} disabled={actionLoading}>
                  {actionLoading ? 'Procesando...' : 'Confirmar'}
                </button>
                <button onClick={closeAction}>Cancelar</button>
              </div>
            )}
          </div>
        );
      })}
    </main>
  );
}

export default PortfolioPage;