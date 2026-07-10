import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPortfolioService, buyAssetService, sellAssetService, deletePortfolioAssetService } from '../../services/portfolio.services';
import { getUserService } from '../../services/user.services';
import './PortfolioPage.css';

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
      const response = await getPortfolioService();
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
      const response = await getUserService(user.id);
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
      activeAction.type === 'buy' ? await buyAssetService(holding.asset_id, quantity) : await sellAssetService(holding.asset_id, quantity);
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
      await deletePortfolioAssetService(assetId);
      await fetchPortfolio();
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo eliminar el activo.');
    }
  };

  if (loading) return <p>Cargando portfolio...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="portfolio-page">
      <h2>Mi portfolio</h2>
      <p className="portfolio-page__balance">
        Saldo disponible: <span>${Number(user.balance ?? 0).toFixed(2)}</span>
      </p>

      {holdings.length === 0 && <p>Todavía no tenés activos en tu portfolio.</p>}

      <div className="portfolio-page__grid">
        {holdings.map((holding) => {
          const currentValue = Number(holding.quantity) * Number(holding.current_price);
          const isActive = activeAction?.assetId === holding.asset_id;

          return (
            <div key={holding.asset_id} className="portfolio-card">
              <h3>{holding.name}</h3>
              <p className="portfolio-card__quantity">{holding.quantity} unidades</p>
              <p className="portfolio-card__value">${currentValue.toFixed(2)}</p>

              <div className="portfolio-card__actions">
                <button onClick={() => openAction(holding.asset_id, 'buy')} className="btn">
                  Comprar
                </button>
                <button
                  onClick={() => openAction(holding.asset_id, 'sell')}
                  disabled={Number(holding.quantity) <= 0}
                  className="btn btn-secondary"
                >
                  Vender
                </button>
                <button
                  onClick={() => handleDelete(holding.asset_id)}
                  disabled={Number(holding.quantity) !== 0}
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
              </div>

              {isActive && (
                <div className="portfolio-card__action-panel">
                  <label className="portfolio-card__quantity-label">
                    Cantidad:
                    <input
                      type="number"
                      min="1"
                      max={activeAction.type === 'sell' ? holding.quantity : 20}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </label>
                  <p className="portfolio-card__estimate">
                    {activeAction.type === 'buy' ? 'Costo estimado' : 'Recibirás aprox.'}: $
                    {(quantity * Number(holding.current_price)).toFixed(2)}
                  </p>
                  {actionError && <p className="portfolio-card__action-error">{actionError}</p>}
                  <div className="portfolio-card__action-buttons">
                    <button
                      onClick={() => handleConfirmAction(holding)}
                      disabled={actionLoading}
                      className="btn"
                    >
                      {actionLoading ? 'Procesando...' : 'Confirmar'}
                    </button>
                    <button onClick={closeAction} className="btn btn-secondary">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Link to="/panel" className="portfolio-page__panel-link">
        Ir al Panel →
      </Link>
    </div>
  );
}

export default PortfolioPage;