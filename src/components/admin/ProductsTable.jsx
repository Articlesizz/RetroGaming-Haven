// Tabla de productos del administrador (producto/index.html del template) con acciones de ver, editar y eliminar.
import { Link } from 'react-router-dom';
import DeleteButton from '../common/DeleteButton.jsx';
import ProductImage from '../common/ProductImage.jsx';
import { hasOffer, isCritical } from '../../utils/catalog.js';
import { formatPrice } from '../../utils/money.js';

export default function ProductsTable({ products, categories, onDelete }) {
  const categoryNames = new Map(categories.map((category) => [category.id, category.nombre]));
  if (products.length === 0) return <p className="text-secondary">No hay productos que coincidan.</p>;

  return (
    <div className="card text-start">
      <div className="card-body">
        <div className="table-responsive small">
          <table className="table table-sm table-hover align-middle">
            <caption className="visually-hidden">Listado de productos</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Imagen</th>
                <th scope="col">Juego</th>
                <th scope="col">Categoría</th>
                <th scope="col">Descripción</th>
                <th scope="col">Precio</th>
                <th scope="col">Disponibilidad</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">{product.id}</th>
                  <td>
                    <ProductImage product={product} className="admin-thumb" width="50" />
                  </td>
                  <td>
                    <Link to={`/admin/producto/${product.id}`}>{product.nombre}</Link>
                    {isCritical(product) && <span className="badge text-bg-danger ms-2">Crítico</span>}
                  </td>
                  <td>{categoryNames.get(product.categoryId) ?? 'Sin categoría'}</td>
                  <td>{product.descripcion}</td>
                  <td>
                    {hasOffer(product) && <s className="text-secondary me-1">{formatPrice(product.precio_descuento)}</s>}
                    {product.precio_nuevo === 0 ? 'FREE' : formatPrice(product.precio_nuevo)}
                  </td>
                  <td>{product.disponibilidad === 'Agotado' || product.stock <= 0 ? <span className="badge bg-secondary">Agotado</span> : <span className="badge bg-success">Disponible ({product.stock})</span>}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <Link className="btn btn-outline-secondary btn-sm" to={`/admin/producto/${product.id}/editar`}>
                        Editar
                      </Link>
                      <DeleteButton message={`¿Eliminar el producto ${product.nombre}?`} onConfirm={() => onDelete(product.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
