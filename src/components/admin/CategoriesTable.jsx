// Tabla de categorías del administrador (categoria/index.html del template): imagen, nombre, descripción y cantidad.
import { Link } from 'react-router-dom';
import DeleteButton from '../common/DeleteButton.jsx';
import CategoryVisual from '../home/CategoryVisual.jsx';

export default function CategoriesTable({ categories, products, onDelete }) {
  return (
    <div className="card text-start">
      <div className="card-body">
        <div className="table-responsive small">
          <table className="table table-sm table-hover align-middle">
            <caption className="visually-hidden">Listado de categorías</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Imagen</th>
                <th scope="col">Categoría</th>
                <th scope="col">Descripción</th>
                <th scope="col">Cantidad de Productos</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, position) => (
                <tr key={category.id}>
                  <th scope="row">{position + 1}</th>
                  <td style={{ width: 60 }}>
                    <CategoryVisual category={category} height={50} className="rounded" />
                  </td>
                  <td>
                    <Link to={`/admin/categoria/${category.id}/editar`}>{category.nombre}</Link>
                  </td>
                  <td>{category.descripcion}</td>
                  <td>{products.filter((product) => product.categoryId === category.id).length}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <Link className="btn btn-outline-secondary btn-sm" to={`/admin/categoria/${category.id}/editar`}>
                        Editar
                      </Link>
                      <DeleteButton message={`¿Eliminar la categoría ${category.nombre}?`} onConfirm={() => onDelete(category.id)} />
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
