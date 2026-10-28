// Productos (admin/producto del template): listado, críticos, formato tarjeta, reportes, nuevo, mostrar y editar.
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import AdminTabs from '../../components/admin/AdminTabs.jsx';
import FilterBar from '../../components/admin/FilterBar.jsx';
import { PLATFORMS } from '../../data/fichas.js';
import CriticalProductsTable from '../../components/admin/CriticalProductsTable.jsx';
import ProductCardsGrid from '../../components/admin/ProductCardsGrid.jsx';
import ProductsTable from '../../components/admin/ProductsTable.jsx';
import ProductForm from '../../components/forms/ProductForm.jsx';
import ProductImage from '../../components/common/ProductImage.jsx';
import DeleteButton from '../../components/common/DeleteButton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusAlert from '../../components/common/StatusAlert.jsx';
import ChartGrid from '../../components/reports/ChartGrid.jsx';
import { ADMIN_STATUS_OPTIONS, filterAdminProducts, hasOffer, isCritical } from '../../utils/catalog.js';
import { productCharts } from '../../utils/chartData.js';
import { formatPrice } from '../../utils/money.js';
import { criticalProducts } from '../../utils/reports.js';

const TABS = [
  { to: '/admin/producto', label: 'Listado de productos' },
  { to: '/admin/producto/criticos', label: 'Listado de productos criticos' },
  { to: '/admin/producto/formato', label: 'Formato tarjeta' },
  { to: '/admin/producto/reporte', label: 'Reportes' },
  { to: '/admin/producto/nuevo', label: 'Nuevo producto' },
];

function Header({ title, subtitle = 'Listado de productos' }) {
  return (
    <>
      <h4 className="card-title">{title}</h4>
      <p className="card-text">{subtitle}</p>
      <AdminTabs tabs={TABS} />
    </>
  );
}

export function ProductsPage() {
  const { db, deleteProduct } = useStore();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [message, setMessage] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState('');
  const products = filterAdminProducts(db.products, { query, categoryId, platform, status });
  const clearFilters = () => {
    setQuery('');
    setCategoryId('');
    setPlatform('');
    setStatus('');
  };

  const handleDelete = (id) => {
    const result = deleteProduct(id);
    setMessage(result.ok ? { status: 'success', message: 'Producto eliminado.' } : { status: 'error', message: result.error });
  };

  return (
    <div className="mt-4">
      <Header title="Productos" />
      <FilterBar
        label="Filtros de productos"
        total={db.products.length}
        shown={products.length}
        onClear={clearFilters}
        fields={[
          { id: 'admin-buscar-producto', label: 'Buscar', type: 'search', placeholder: 'Nombre o descripción', value: query, onChange: setQuery, className: 'col-12 col-md-4' },
          { id: 'admin-filtro-categoria', label: 'Categoría', type: 'select', value: categoryId, onChange: setCategoryId, options: [{ value: '', label: 'Todas' }, ...db.categories.map((category) => ({ value: category.id, label: category.nombre }))] },
          { id: 'admin-filtro-plataforma', label: 'Plataforma', type: 'select', value: platform, onChange: setPlatform, options: [{ value: '', label: 'Todas' }, ...PLATFORMS.map((item) => ({ value: item.id, label: item.label }))] },
          { id: 'admin-filtro-estado', label: 'Estado', type: 'select', value: status, onChange: setStatus, options: ADMIN_STATUS_OPTIONS },
        ]}
      />
      <StatusAlert status={message?.status} message={message?.message} />
      <ProductsTable products={products} categories={db.categories} onDelete={handleDelete} />
    </div>
  );
}

export function CriticalProductsPage() {
  const { db } = useStore();
  return (
    <div className="mt-4">
      <Header title="Productos" />
      <p className="text-secondary small">Un producto es crítico cuando su stock es menor o igual a su "Stock crítico", que se define en cada producto.</p>
      <CriticalProductsTable products={criticalProducts(db.products)} categories={db.categories} />
    </div>
  );
}

export function ProductCardsPage() {
  const { db } = useStore();
  return (
    <div className="mt-4">
      <Header title="Productos" />
      <ProductCardsGrid products={db.products} />
    </div>
  );
}

export function ProductReportsPage() {
  const { db } = useStore();
  const charts = productCharts(db);
  return (
    <div className="mt-4">
      <Header title="Análisis de Ventas de Productos" subtitle="Gráficos calculados con las ventas y visitas de la tienda" />
      <ChartGrid charts={charts} />
    </div>
  );
}

export function ProductCreatePage() {
  const { db, createProduct } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const result = createProduct(values);
    if (result.ok) navigate(`/admin/producto/${result.record.id}`);
    return result;
  };

  return (
    <div className="mt-4">
      <Header title="Crear nuevo producto" subtitle="Completa los datos del juego" />
      <div className="card">
        <div className="card-body">
          <ProductForm categories={db.categories} onSubmit={handleSubmit} submitLabel="Guardar" />
        </div>
      </div>
    </div>
  );
}

export function ProductShowPage() {
  const { id } = useParams();
  const { db, deleteProduct } = useStore();
  const navigate = useNavigate();
  const product = db.products.find((item) => item.id === id);

  if (!product) {
    return (
      <div className="mt-4">
        <EmptyState title="Producto no encontrado" actionLabel="Volver a productos" actionTo="/admin/producto" />
      </div>
    );
  }

  const category = db.categories.find((item) => item.id === product.categoryId);
  const handleDelete = () => {
    deleteProduct(product.id);
    navigate('/admin/producto');
  };

  return (
    <div className="mt-4">
      <h4>
        <Link to="/admin/producto" className="text-secondary me-2 decoration-none" aria-label="Volver a productos">
          <i className="bi bi-arrow-left-circle-fill" aria-hidden="true" />
        </Link>
        Producto #{product.id} - <strong>{product.nombre}</strong>
      </h4>
      <div className="card">
        <div className="card-body row g-3">
          <div className="col-md-5">
            <ProductImage product={product} className="product-img rounded" />
          </div>
          <div className="col-md-7">
            <div className="d-flex flex-column mb-3">
              <span className="precio-descuento text-decoration-line-through">{hasOffer(product) ? formatPrice(product.precio_descuento) : <br />}</span>
              <span className="precio-nuevo fw-bolder">{product.precio_nuevo === 0 ? 'FREE' : formatPrice(product.precio_nuevo)}</span>
            </div>
            <p>{product.descripcion || 'Sin descripción'}</p>
            <ul>
              <li>Categoría: {category?.nombre ?? 'Sin categoría'}</li>
              <li>
                Stock: {product.stock} (stock crítico: {product.stock_critico})
                {isCritical(product) && <span className="badge text-bg-danger ms-2">Crítico</span>}
              </li>
              <li>Disponibilidad: {product.disponibilidad}</li>
              <li>Visitas: {product.vistas ?? 0}</li>
            </ul>
            <div className="d-flex flex-wrap gap-2">
              <Link className="btn btn-secondary" to={`/admin/producto/${product.id}/editar`}>
                Editar
              </Link>
              <DeleteButton label="Eliminar producto" message={`¿Eliminar ${product.nombre}?`} onConfirm={handleDelete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductEditPage() {
  const { id } = useParams();
  const { db, updateProduct } = useStore();
  const navigate = useNavigate();
  const product = db.products.find((item) => item.id === id);

  if (!product) {
    return (
      <div className="mt-4">
        <EmptyState title="Producto no encontrado" actionLabel="Volver a productos" actionTo="/admin/producto" />
      </div>
    );
  }

  const handleSubmit = (values) => {
    const result = updateProduct(product.id, values);
    if (result.ok) navigate(`/admin/producto/${product.id}`);
    return result;
  };

  return (
    <div className="mt-4">
      <h4>
        <Link to={`/admin/producto/${product.id}`} className="text-secondary me-2 decoration-none" aria-label="Volver al producto">
          <i className="bi bi-arrow-left-circle-fill" aria-hidden="true" />
        </Link>
        Producto #{product.id} - <strong>{product.nombre}</strong>
      </h4>
      <div className="card">
        <div className="card-body">
          <ProductForm key={product.id} product={product} categories={db.categories} onSubmit={handleSubmit} submitLabel="Guardar" />
        </div>
      </div>
    </div>
  );
}
