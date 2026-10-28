// Productos críticos (index-critico.html del template): stock actual, stock crítico y estado (AGOTADO o SOLICITAR PRODUCTOS).
import { Link } from 'react-router-dom';
import ProductImage from '../common/ProductImage.jsx';

export function criticalStatus(product) {
  if (product.stock <= 0) return { label: 'AGOTADO', className: 'bg-dark' };
  return { label: `SOLICITAR PRODUCTOS (${Math.max(product.stock_critico - product.stock, 0)})`, className: 'bg-warning text-dark' };
}

export default function CriticalProductsTable({ products, categories }) {
  const categoryNames = new Map(categories.map((category) => [category.id, category.nombre]));
  if (products.length === 0) return <p className="text-secondary">No hay productos con stock crítico.</p>;

  return (
    <div className="card text-start">
      <div className="card-body">
        <div className="table-responsive small">
          <table className="table table-sm table-hover align-middle">
            <caption className="visually-hidden">Productos con stock crítico</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Imagen</th>
                <th scope="col">Juego</th>
                <th scope="col">Categoría</th>
                <th scope="col">Descripción</th>
                <th scope="col" className="text-center">
                  Stock
                </th>
                <th scope="col" className="text-center">
                  Stock Crítico
                </th>
                <th scope="col" className="text-center">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = criticalStatus(product);
                return (
                  <tr key={product.id}>
                    <th scope="row">{product.id}</th>
                    <td>
                      <ProductImage product={product} className="admin-thumb" width="50" />
                    </td>
                    <td>
                      <Link to={`/admin/producto/${product.id}`}>{product.nombre}</Link>
                    </td>
                    <td>{categoryNames.get(product.categoryId)}</td>
                    <td>{product.descripcion}</td>
                    <td className="text-center">{product.stock}</td>
                    <td className="text-center">{product.stock_critico}</td>
                    <td className="text-center">
                      <h5 className="mb-0">
                        <span className={`badge ${status.className}`}>{status.label}</span>
                      </h5>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
