import './PriceTag.css';

function PriceTag({ value }) {
  return (
    <span className="price-tag">
      ${Number(value).toFixed(2)}
    </span>
  );
}

export default PriceTag;