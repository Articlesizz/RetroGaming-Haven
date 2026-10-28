// Órdenes (admin/ordenes del template): listado con pestañas y detalle de la orden.
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import AdminTabs from '../../components/admin/AdminTabs.jsx';
import FilterBar from '../../components/admin/FilterBar.jsx';
import OrderDetailView from '../../components/admin/OrderDetailView.jsx';
import OrdersTable from '../../components/admin/OrdersTable.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { ORDER_SORTS, filterOrders } from '../../utils/reports.js';

export function OrdersPage() {
  const { db } = useStore();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recientes');
  const orders = filterOrders(db.orders, { query, sort });
  return (
    <div className="mt-4">
      <h4 className="card-title">Ordenes de compra</h4>
      <p className="card-text">Compras registradas desde la tienda ({db.orders.length})</p>
      <AdminTabs
        tabs={[
          { to: '/admin/ordenes', label: 'Ordenes' },
          { to: '/admin/producto/criticos', label: 'Listado de productos críticos' },
        ]}
      />
      <FilterBar
        label="Filtros de órdenes"
        total={db.orders.length}
        shown={orders.length}
        onClear={() => {
          setQuery('');
          setSort('recientes');
        }}
        fields={[
          { id: 'admin-buscar-orden', label: 'Buscar', type: 'search', placeholder: 'ID, código o comuna', value: query, onChange: setQuery, className: 'col-12 col-md-5' },
          { id: 'admin-orden-orden', label: 'Ordenar por', type: 'select', value: sort === 'recientes' ? '' : sort, onChange: (value) => setSort(value || 'recientes'), options: ORDER_SORTS.map((item) => ({ value: item.value === 'recientes' ? '' : item.value, label: item.label })) },
        ]}
      />
      <OrdersTable orders={orders} />
    </div>
  );
}

export function OrderDetailPage() {
  const { orderId } = useParams();
  const { db } = useStore();
  const order = db.orders.find((item) => item.id === orderId);

  if (!order) {
    return (
      <div className="mt-4">
        <EmptyState title="Orden no encontrada" actionLabel="Volver a órdenes" actionTo="/admin/ordenes" />
      </div>
    );
  }
  return <OrderDetailView order={order} backTo="/admin/ordenes" backLabel="Volver a órdenes" />;
}
