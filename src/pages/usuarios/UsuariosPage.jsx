import { useState, useEffect, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsersService } from '../../services/user.services';
import { updateAssetsPricesService } from '../../services/asset.services';
import './UsuariosPage.css';

const PAGE_SIZE = 5;

function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [updatingPrices, setUpdatingPrices] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getAllUsersService();
        setUsers(res.data);
      } catch {
        setError('No se pudo cargar el listado.');
      }
    });
  }, []);

  const handleUpdatePrices = async () => {
    setUpdatingPrices(true);
    try {
      await updateAssetsPricesService();
      alert('Precios actualizados correctamente.');
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudieron actualizar los precios.');
    } finally {
      setUpdatingPrices(false);
    }
  };

  const filtered = users
    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => Number(b.total_portfolio_value) - Number(a.total_portfolio_value));

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isPending) return <p>Cargando usuarios...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="usuarios-page">
      <h2>Manejo de usuarios</h2>

      <div className="usuarios-page__actions">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="usuarios-page__search"
        />
        <button onClick={handleUpdatePrices} disabled={updatingPrices} className="btn">
          {updatingPrices ? 'Actualizando...' : 'Actualizar precios del mercado'}
        </button>
      </div>

      <table className="usuarios-page__table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Valor del portfolio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((u, index) => {
            const globalRank = (page - 1) * PAGE_SIZE + index;
            return (
              <tr key={u.id} className={globalRank === 0 ? 'usuarios-page__top-row' : ''}>
                <td>{globalRank === 0 ? '🏆' : globalRank + 1}</td>
                <td>{u.name}</td>
                <td>${Number(u.total_portfolio_value).toFixed(2)}</td>
                <td>
                  <Link to={`/editar-usuario/${u.id}`} className="usuarios-page__edit-link">
                    Editar usuario
                  </Link>
                </td>
              </tr>
            );
          })}
          {pageItems.length === 0 && (
            <tr>
              <td colSpan="4">No se encontraron usuarios.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="usuarios-page__pagination">
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="btn btn-secondary">
          ‹ Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} className="btn btn-secondary">
          Siguiente ›
        </button>
      </div>
    </div>
  );
}

export default UsuariosPage;