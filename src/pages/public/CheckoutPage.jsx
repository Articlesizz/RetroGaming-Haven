// Checkout (comprar.html del template). Un pago rechazado NO vacía el carrito y conserva el borrador.
// Un pago aprobado se registra una sola vez por intento (idempotente), descuenta stock y vacía el carrito.
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import CheckoutForm from '../../components/forms/CheckoutForm.jsx';
import OrderLinesTable from '../../components/cart/OrderLinesTable.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusAlert from '../../components/common/StatusAlert.jsx';
import { readJson, removeKey, writeJson } from '../../data/storage.js';
import { buildOrder, calculateOrderTotals, stockProblems } from '../../services/orderService.js';
import { simulatePayment } from '../../services/paymentSimulator.js';
import { newId } from '../../services/repository.js';
import { buildCartDetails } from '../../utils/cart.js';
import { formatPrice } from '../../utils/money.js';
import { hasErrors, validateCheckout } from '../../utils/validators.js';

export const CHECKOUT_DRAFT_KEY = 'mi-tienda:checkout-draft';

const EMPTY_FORM = { name: '', lastName: '', email: '', street: '', department: '', region: '', comuna: '', notes: '', delivery: 'retiro' };

// Precarga los datos del usuario con sesión; el borrador guardado tiene prioridad sobre ellos.
export function buildInitialForm(user, draft = readJson(CHECKOUT_DRAFT_KEY, {})) {
  const fromUser = user
    ? {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        street: user.street ?? '',
        department: user.department ?? '',
        region: user.region ?? '',
        comuna: user.comuna ?? '',
      }
    : {};
  return { ...EMPTY_FORM, ...fromUser, ...(draft && typeof draft === 'object' ? draft : {}) };
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { db, registerOrder } = useStore();
  const { lines, clear } = useCart();
  const { user } = useSession();
  const details = buildCartDetails(lines, db.products);

  const [form, setForm] = useState(() => buildInitialForm(user));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [scenario, setScenario] = useState('aprobado');
  // El id del intento se reutiliza al reintentar desde el pago fallido: así un reintento nunca duplica la compra.
  const [attemptId] = useState(() => location.state?.attemptId ?? newId('ord'));

  useEffect(() => {
    writeJson(CHECKOUT_DRAFT_KEY, form);
  }, [form]);

  if (details.length === 0) {
    return (
      <div className="container mt-5">
        <EmptyState title="No hay productos para pagar" description="Tu carrito está vacío." actionLabel="Ir al catálogo" actionTo="/productos" />
      </div>
    );
  }

  const totals = calculateOrderTotals(details, form.delivery);

  const handleFieldChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value, ...(field === 'region' ? { comuna: '' } : {}) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateCheckout(form, { hasItems: true });
    setErrors(validation);
    if (hasErrors(validation)) {
      setStatus({ status: 'error', message: 'Revisa los campos marcados antes de pagar.' });
      return;
    }

    const problems = stockProblems(details, db.products);
    if (problems.length > 0) {
      setStatus({ status: 'error', message: problems.join(' ') });
      return;
    }

    const payment = simulatePayment({ amount: totals.total, scenario });
    if (payment.status !== 'approved') {
      navigate('/comprar-error', { state: { attemptId, amount: totals.total, reason: payment.message } });
      return;
    }

    const order = buildOrder({
      id: attemptId,
      customer: { customerId: user?.id ?? null, name: form.name, lastName: form.lastName, email: form.email },
      address: { street: form.street, department: form.department, region: form.region, comuna: form.comuna, notes: form.notes },
      details,
      deliveryType: form.delivery,
      payment,
    });

    const result = registerOrder(order);
    if (!result.ok) {
      setStatus({ status: 'error', message: result.error });
      return;
    }
    clear();
    removeKey(CHECKOUT_DRAFT_KEY);
    navigate(`/comprar-ok/${order.id}`);
  };

  return (
    <section id="productos-comprados" className="py-3">
      <div className="container">
        <div className="d-flex justify-content-between flex-wrap gap-2">
          <div>
            <h4 className="card-title">Carrito de compra</h4>
            <p className="card-text">Completa la siguiente información</p>
          </div>
          <p className="btn btn-primary py-3 mb-0 align-self-start">
            Total a pagar: <strong>{formatPrice(totals.total)}</strong>
          </p>
        </div>

        <div className="mt-3">
          <OrderLinesTable lines={details} hover />
          <dl className="row mt-2 mb-4 text-end">
            <dt className="col-8">Subtotal productos</dt>
            <dd className="col-4">{formatPrice(totals.subtotal)}</dd>
            <dt className="col-8">Despacho</dt>
            <dd className="col-4">{formatPrice(totals.deliveryCost)}</dd>
          </dl>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <StatusAlert status={status?.status} message={status?.message} />
            <CheckoutForm
              form={form}
              errors={errors}
              onFieldChange={handleFieldChange}
              onSubmit={handleSubmit}
              scenario={scenario}
              onScenarioChange={setScenario}
              total={totals.total}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
