import './EvolutionBadge.css';

function EvolutionBadge({ evolution }) {
  return (
    <span className={`evolution-badge evolution-badge--${evolution}`}>
      {evolution === 'up' && '▲'}
      {evolution === 'down' && '▼'}
      {evolution === 'neutral' && '—'}
    </span>
  );
}

export default EvolutionBadge;