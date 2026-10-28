// Tabla de solo lectura con las líneas de una compra (checkout, boleta, pagos y reportes).
import ProductImage from '../common/ProductImage.jsx';
import { formatPrice } from '../../utils/money.js';
import { isFree } from '../../utils/catalog.js';

export default function OrderLinesTable({ lines, hover = false }) {
  return (
    <div className="table-responsive">
      <table className={`table table-sm align-middle mb-0${hover ? ' table-hover' : ''}`}>
        <caption className="visually-hidden">Productos de la compra</caption>
        <thead>
          <tr>
            <th scope="col">Imagen</th>
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.productId}>
              <td>
                <ProductImage product={{ nombre: line.nombre, imagen: line.imagen }} width="50" />
              </td>
              <td>{line.nombre}</td>
              <td>{line.unitPrice === 0 ? 'FREE' : formatPrice(line.unitPrice)}</td>
              <td>{line.quantity}</td>
              <td>{line.subtotal === 0 ? 'FREE' : formatPrice(line.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const lineIsFree = (line) => isFree({ precio_nuevo: line.unitPrice });
