// Botón verde del carrito con el importe (como en la barra inferior del template).
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useStore } from '../../context/StoreContext.jsx';
import { buildCartDetails, cartTotals } from '../../utils/cart.js';
import { formatPrice } from '../../utils/money.js';

export default function CartButton({ className = 'btn btn-success' }) {
  const { lines } = useCart();
  const { db } = useStore();
  const totals = cartTotals(buildCartDetails(lines, db.products));
  return (
    <Link className={className} to="/carrito" aria-label={`Carrito: ${totals.itemCount} unidades, total ${formatPrice(totals.subtotal)}`}>
      <strong>
        <i className="bi bi-cart4" aria-hidden="true" /> Carrito <span>{formatPrice(totals.subtotal)}</span>
      </strong>
    </Link>
  );
}
