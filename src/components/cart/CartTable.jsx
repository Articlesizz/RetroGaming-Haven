// Tabla del carrito (carrito.html del template): imagen, nombre, precio, cantidad (-/+ limitado al stock), subtotal y eliminar.
// Los productos gratis no admiten cambios de cantidad, igual que en el template.
import AppButton from '../common/AppButton.jsx';
import ProductImage from '../common/ProductImage.jsx';
import { formatPrice } from '../../utils/money.js';

export default function CartTable({ items, onIncrement, onDecrement, onRemove, total }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped" id="cart-table">
        <caption className="visually-hidden">Productos en el carrito de compras</caption>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productId}>
              <td>
                <ProductImage product={{ nombre: item.nombre, imagen: item.imagen }} width="50" className="" />
              </td>
              <td>{item.nombre}</td>
              <td>{item.free ? 'FREE' : formatPrice(item.unitPrice)}</td>
              <td>
                <div className="d-flex align-items-center">
                  {!item.free && (
                    <AppButton label="-" variant="outline-secondary" className="btn-sm" disabled={item.quantity <= 1} onClick={() => onDecrement(item.productId)} />
                  )}
                  <span className="mx-2" aria-label={`Cantidad de ${item.nombre}`}>
                    {item.quantity}
                  </span>
                  {!item.free && (
                    <AppButton label="+" variant="outline-secondary" className="btn-sm" disabled={item.quantity >= item.stock} onClick={() => onIncrement(item.productId)} />
                  )}
                </div>
              </td>
              <td>{item.free ? 'FREE' : formatPrice(item.subtotal)}</td>
              <td>
                <AppButton label="Eliminar" variant="danger" className="btn-sm" onClick={() => onRemove(item.productId)} />
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="4" className="text-end fw-bold">
              Total
            </td>
            <td colSpan="2" className="fw-bold">
              <strong>{formatPrice(total)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
