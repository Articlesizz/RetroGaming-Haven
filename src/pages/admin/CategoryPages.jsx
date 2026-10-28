// Categorías (admin/categoria del template): listado con eliminar (bloqueado si hay productos), nueva y editar.
// El template incluye la vista "Editar categoría #id" (categoria/2000). El diagrama de la figura 10 enlaza CATEGORÍA con
// "EDITAR USUARIO", que se interpreta como una rotulación errónea: pendiente de validación con el docente.
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import AdminTabs from '../../components/admin/AdminTabs.jsx';
import CategoriesTable from '../../components/admin/CategoriesTable.jsx';
import CategoryForm from '../../components/forms/CategoryForm.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusAlert from '../../components/common/StatusAlert.jsx';

const TABS = [
  { to: '/admin/categoria', label: 'Listado de categorías' },
  { to: '/admin/categoria/nuevo', label: 'Nueva categoría' },
];

export function CategoriesAdminPage() {
  const { db, deleteCategory } = useStore();
  const [message, setMessage] = useState(null);

  const handleDelete = (id) => {
    const result = deleteCategory(id);
    setMessage(result.ok ? { status: 'success', message: 'Categoría eliminada.' } : { status: 'error', message: result.error });
  };

  return (
    <div className="mt-4">
      <h4 className="card-title">Categorías</h4>
      <p className="card-text">Listado de categorías</p>
      <AdminTabs tabs={TABS} />
      <StatusAlert status={message?.status} message={message?.message} />
      <CategoriesTable categories={db.categories} products={db.products} onDelete={handleDelete} />
    </div>
  );
}

export function CategoryCreatePage() {
  const { createCategory } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const result = createCategory(values);
    if (result.ok) navigate('/admin/categoria');
    return result;
  };

  return (
    <div className="mt-4">
      <h4>Crear nueva categoría</h4>
      <AdminTabs tabs={TABS} />
      <div className="card">
        <div className="card-body">
          <CategoryForm onSubmit={handleSubmit} submitLabel="Guardar" />
        </div>
      </div>
    </div>
  );
}

export function CategoryEditPage() {
  const { id } = useParams();
  const { db, updateCategory } = useStore();
  const navigate = useNavigate();
  const category = db.categories.find((item) => item.id === id);

  if (!category) {
    return (
      <div className="mt-4">
        <EmptyState title="Categoría no encontrada" actionLabel="Volver a categorías" actionTo="/admin/categoria" />
      </div>
    );
  }

  const handleSubmit = (values) => {
    const result = updateCategory(category.id, values);
    if (result.ok) navigate('/admin/categoria');
    return result;
  };

  return (
    <div className="mt-4">
      <h4>
        <Link to="/admin/categoria" className="text-secondary me-2 decoration-none" aria-label="Volver a categorías">
          <i className="bi bi-arrow-left-circle-fill" aria-hidden="true" />
        </Link>
        Editar categoría #{category.id.replace(/^cat-/, '')}
      </h4>
      <div className="card">
        <div className="card-body">
          <CategoryForm key={category.id} category={category} onSubmit={handleSubmit} submitLabel="Guardar" />
        </div>
      </div>
    </div>
  );
}
