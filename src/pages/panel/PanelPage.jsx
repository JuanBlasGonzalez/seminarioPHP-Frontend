import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {getUserService} from '../../services/user.services';
import {getAssetsService,getAssetHistoryService} from '../../services/asset.services';
import {buyAssetService} from '../../services/portfolio.services';
import { REFRESH_INTERVAL_MS } from '../../utils/constants';
import './PanelPage.css';

function PanelPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const previousPrices = useRef({});

  const [buyTarget, setBuyTarget] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [buyError, setBuyError] = useState('');
  const [buyLoading, setBuyLoading] = useState(false);

  const [historyTarget, setHistoryTarget] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await getUserService(user.id);
      updateUser({ balance: response.data.balance });
    } catch (err) {
      console.error(err);
    } 
  }, [user?.id]);
  
  const fetchAssets = async () => {
    try {
      const response = await getAssetsService();
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

  const openBuy = (asset) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBuyTarget(asset);
    setQuantity(1);
    setBuyError('');
  };

  const confirmBuy = async () => {
    if (!quantity || quantity <= 0) {
      setBuyError('La cantidad debe ser mayor a 0.');
      return;
    }
    setBuyLoading(true);
    try {
      await buyAssetService(buyTarget.id, quantity);
      setBuyTarget(null);
      fetchAssets();
      await fetchBalance();
    } catch (err) {
      setBuyError(err.response?.data?.error || 'No se pudo completar la compra.');
    } finally {
      setBuyLoading(false);
    }
  };

  const openHistory = async (asset) => {
    setHistoryTarget(asset);
    setHistoryLoading(true);
    try {
      const response = await getAssetHistoryService(asset.id, 5);
      const prices = response.data.map((m) => Number(m.price_per_unit)).reverse();
      setHistoryData(prices);
    } catch {
      setHistoryData([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const renderChart = (data) => {
    if (data.length === 0) return <p>Sin datos históricos.</p>;

    const width = 300;
    const height = 100;
    const padding = 10;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const stepX = (width - padding * 2) / (data.length - 1);

    const points = data.map((value, i) => {
      const x = padding + i * stepX;
      const y = padding + (height - padding * 2) * (1 - (value - min) / range);
      return `${x},${y}`;
    }).join(' ');

    const trendUp = data[data.length - 1] >= data[0];

    return (
      <div className="panel-page__chart">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <polyline
            points={points}
            fill="none"
            stroke={trendUp ? 'var(--color-gain)' : 'var(--color-loss)'}
            strokeWidth="2"
          />
        </svg>
        <p className="panel-page__chart-range">
          Min: ${min.toFixed(2)} · Max: ${max.toFixed(2)}
        </p>
      </div>
    );
  };

  if (loading) return <p>Cargando activos...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="panel-page">
      <h2>Panel de operaciones</h2>
      <p className="panel-page__subtitle">
        Comprá activos y consultá su historial reciente de precios.
      </p>

      <table className="panel-page__table">
        <thead>
          <tr>
            <th>Activo</th>
            <th>Precio</th>
            <th>Evolución</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.name}</td>
              <td className="panel-page__price">
                ${Number(asset.current_price).toFixed(2)}
              </td>
              <td className={`panel-page__evolution--${asset.evolution}`}>
                {asset.evolution === 'up' && '▲'}
                {asset.evolution === 'down' && '▼'}
                {asset.evolution === 'neutral' && '—'}
              </td>
              <td>
                <div className="panel-page__actions">
                  <button onClick={() => openBuy(asset)} className="btn">
                    Comprar
                  </button>
                  <button onClick={() => openHistory(asset)} className="btn btn-secondary">
                    Historial
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {buyTarget && (
        <div className="panel-page__modal">
          <div className="panel-page__modal-content">
            <h3 className="panel-page__modal-title">Comprar {buyTarget.name}</h3>
            <p>Precio actual: ${Number(buyTarget.current_price).toFixed(2)}</p>
            <label>Cantidad:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <p className="panel-page__estimate">
              Total estimado: ${(quantity * Number(buyTarget.current_price)).toFixed(2)}
            </p>
            {buyError && <p className="panel-page__modal-error">{buyError}</p>}
            <div className="panel-page__modal-buttons">
              <button onClick={confirmBuy} disabled={buyLoading} className="btn">
                {buyLoading ? 'Comprando...' : 'Confirmar compra'}
              </button>
              <button onClick={() => setBuyTarget(null)} className="btn btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {historyTarget && (
        <div className="panel-page__modal">
          <div className="panel-page__modal-content">
            <h3 className="panel-page__modal-title">
              Historial de {historyTarget.name}
            </h3>
            {historyLoading ? <p>Cargando...</p> : renderChart(historyData)}
            <button onClick={() => setHistoryTarget(null)} className="btn btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PanelPage;