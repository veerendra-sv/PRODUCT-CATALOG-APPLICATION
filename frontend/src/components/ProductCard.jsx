import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../services/api';
import { Edit2, Trash2, Package } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();
  const admin = isAdmin();

  return (
    <div className="pcard" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="pcard-img">
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.productName}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          : null}
        <div className="pcard-img-fallback" style={{ display: product.imageUrl ? 'none' : 'flex' }}>
          <Package size={36} />
        </div>
      </div>

      <div className="pcard-body">
        <p className="pcard-brand">{product.brand || 'Unknown Brand'}</p>
        <h3 className="pcard-name">{product.productName}</h3>
        <p className="pcard-desc">{product.description}</p>

        <div className="pcard-footer">
          <span className="pcard-price">
            ₹{Number(product.price || 0).toLocaleString('en-IN')}
          </span>
          {admin && (
            <div className="pcard-actions" onClick={e => e.stopPropagation()}>
              <button className="btn btn-secondary btn-sm"
                onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
                <Edit2 size={12} />
              </button>
              <button className="btn btn-danger btn-sm"
                onClick={() => onDelete && onDelete(product.id)}>
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;



