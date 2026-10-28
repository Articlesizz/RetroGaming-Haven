// Formulario de producto (nuevo.html / edit.html del template): código, nombre, descripción, precios, stock,
// stock crítico, categoría, disponibilidad e imagen. El código solo se elige al crear (pasa a ser el id).
import { useState } from 'react';
import FormField from '../common/FormField.jsx';
import ImageField from '../common/ImageField.jsx';
import StatusAlert from '../common/StatusAlert.jsx';
import { PLATFORMS } from '../../data/fichas.js';

const PEGI_OPTIONS = [3, 7, 12, 16, 18];

function toFormValues(product, categories) {
  return {
    codigo: product?.id ?? '',
    nombre: product?.nombre ?? '',
    descripcion: product?.descripcion ?? '',
    categoryId: product?.categoryId ?? categories[0]?.id ?? '',
    precio_descuento: product?.precio_descuento ?? '',
    precio_nuevo: product?.precio_nuevo ?? '',
    stock: product?.stock ?? '',
    stock_critico: product?.stock_critico ?? 5,
    disponibilidad: product?.disponibilidad ?? 'Disponible',
    imagen: product?.imagen ?? '',
    plataformas: product?.plataformas ?? [],
    clasificacion: product?.clasificacion ?? '',
    anio: product?.anio ?? '',
    desarrollador: product?.desarrollador ?? '',
    detalle: product?.detalle ?? '',
  };
}

export default function ProductForm({ product, categories, onSubmit, submitLabel = 'Guardar' }) {
  const [values, setValues] = useState(() => toFormValues(product, categories));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const editing = Boolean(product);

  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  const togglePlatform = (id) =>
    setValues((current) => ({
      ...current,
      plataformas: current.plataformas.includes(id) ? current.plataformas.filter((item) => item !== id) : [...current.plataformas, id],
    }));
  const invalid = (field) => (errors[field] ? ' is-invalid' : '');

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = onSubmit(values);
    if (!result.ok) {
      setErrors(result.errors);
      setMessage(result.errors.form ?? 'Revisa los campos marcados.');
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="row g-3" aria-label="Formulario de producto">
      <FormField id="producto-codigo" label="Código" error={errors.codigo} className="col-12 col-md-4">
        <input id="producto-codigo" type="text" placeholder="Automático si lo dejas vacío" className={`form-control${invalid('codigo')}`} value={values.codigo} onChange={update('codigo')} readOnly={editing} disabled={editing} />
      </FormField>
      <FormField id="producto-nombre" label="Nombre del Juego" error={errors.nombre} required className="col-12 col-md-8">
        <input id="producto-nombre" type="text" placeholder="Ingrese el nombre del juego" className={`form-control${invalid('nombre')}`} value={values.nombre} onChange={update('nombre')} />
      </FormField>
      <FormField id="producto-descripcion" label="Descripción" error={errors.descripcion} required className="col-12">
        <textarea id="producto-descripcion" rows={3} className={`form-control${invalid('descripcion')}`} value={values.descripcion} onChange={update('descripcion')} />
      </FormField>
      <FormField id="producto-precio-normal" label="Precio normal (tachado, opcional)" error={errors.precio_descuento} className="col-12 col-md-3">
        <input id="producto-precio-normal" type="number" min="0" step="1" className={`form-control${invalid('precio_descuento')}`} value={values.precio_descuento} onChange={update('precio_descuento')} />
      </FormField>
      <FormField id="producto-precio" label="Precio (0 = FREE)" error={errors.precio_nuevo} required className="col-12 col-md-3">
        <input id="producto-precio" type="number" min="0" step="1" placeholder="Ingrese el precio del juego" className={`form-control${invalid('precio_nuevo')}`} value={values.precio_nuevo} onChange={update('precio_nuevo')} />
      </FormField>
      <FormField id="producto-stock" label="Stock" error={errors.stock} required className="col-12 col-md-3">
        <input id="producto-stock" type="number" min="0" step="1" placeholder="Cantidad de productos" className={`form-control${invalid('stock')}`} value={values.stock} onChange={update('stock')} />
      </FormField>
      <FormField id="producto-stock-critico" label="Stock crítico" error={errors.stock_critico} required className="col-12 col-md-3">
        <input id="producto-stock-critico" type="number" min="0" step="1" placeholder="Cantidad de productos alerta" className={`form-control${invalid('stock_critico')}`} value={values.stock_critico} onChange={update('stock_critico')} />
      </FormField>
      <FormField id="producto-categoria" label="Categoría" error={errors.categoryId} required className="col-12 col-md-6">
        <select id="producto-categoria" className={`form-select${invalid('categoryId')}`} value={values.categoryId} onChange={update('categoryId')}>
          <option value="" disabled>
            Seleccione una categoría
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
      </FormField>
      <FormField id="producto-disponibilidad" label="Disponibilidad" error={errors.disponibilidad} required className="col-12 col-md-6">
        <select id="producto-disponibilidad" className={`form-select${invalid('disponibilidad')}`} value={values.disponibilidad} onChange={update('disponibilidad')}>
          <option value="Disponible">Disponible</option>
          <option value="Agotado">Agotado</option>
        </select>
      </FormField>
      <fieldset className="col-12 col-md-6">
        <legend className="form-label fs-6">Plataformas</legend>
        <div className="d-flex flex-wrap gap-3">
          {PLATFORMS.map((platform) => (
            <div className="form-check" key={platform.id}>
              <input className="form-check-input" type="checkbox" id={`producto-plataforma-${platform.id}`} checked={values.plataformas.includes(platform.id)} onChange={() => togglePlatform(platform.id)} />
              <label className="form-check-label" htmlFor={`producto-plataforma-${platform.id}`}>
                {platform.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      <FormField id="producto-clasificacion" label="Clasificación PEGI" className="col-6 col-md-3">
        <select id="producto-clasificacion" className="form-select" value={values.clasificacion} onChange={update('clasificacion')}>
          <option value="">Sin clasificar</option>
          {PEGI_OPTIONS.map((age) => (
            <option key={age} value={age}>
              PEGI {age}
            </option>
          ))}
        </select>
      </FormField>
      <FormField id="producto-anio" label="Año de lanzamiento" className="col-6 col-md-3">
        <input id="producto-anio" type="number" min="1970" max="2100" className="form-control" value={values.anio} onChange={update('anio')} />
      </FormField>
      <FormField id="producto-desarrollador" label="Desarrollador" className="col-12">
        <input id="producto-desarrollador" type="text" className="form-control" value={values.desarrollador} onChange={update('desarrollador')} />
      </FormField>
      <FormField id="producto-detalle" label="Reseña (opcional)" className="col-12">
        <textarea id="producto-detalle" rows={2} className="form-control" value={values.detalle} onChange={update('detalle')} />
      </FormField>
      <ImageField id="producto-imagen" label="Imagen del Producto" value={values.imagen} onChange={(dataUrl) => setValues((current) => ({ ...current, imagen: dataUrl }))} className="col-12" />
      <div className="col-12 d-flex justify-content-end">
        <button type="submit" className="btn btn-primary">
          <strong>{submitLabel}</strong>
        </button>
      </div>
      <div className="col-12">
        <StatusAlert status="error" message={message} />
      </div>
    </form>
  );
}
