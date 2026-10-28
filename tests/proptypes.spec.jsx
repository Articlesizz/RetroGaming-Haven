// Contrato de propiedades (props) de los componentes. React 19 ya no valida `propTypes` por sí solo,
// por eso se verifican aquí con PropTypes.checkPropTypes: una prop válida no genera avisos y una inválida sí (console.error espiado).
import PropTypes from 'prop-types';
import { SEED_DB } from '../src/data/seed.js';
import AppButton from '../src/components/common/AppButton.jsx';
import ConfirmModal from '../src/components/common/ConfirmModal.jsx';
import DeleteButton from '../src/components/common/DeleteButton.jsx';
import EmptyState from '../src/components/common/EmptyState.jsx';
import FormField from '../src/components/common/FormField.jsx';
import ImageField from '../src/components/common/ImageField.jsx';
import ProductImage from '../src/components/common/ProductImage.jsx';
import QuantityInput from '../src/components/common/QuantityInput.jsx';
import StatusAlert from '../src/components/common/StatusAlert.jsx';
import FilterBar from '../src/components/admin/FilterBar.jsx';
import StatCard from '../src/components/admin/StatCard.jsx';
import Carousel from '../src/components/home/Carousel.jsx';
import CategoryCard from '../src/components/home/CategoryCard.jsx';
import CategoryGrid from '../src/components/home/CategoryGrid.jsx';
import PlatformBadges from '../src/components/products/PlatformBadges.jsx';
import ProductCard from '../src/components/products/ProductCard.jsx';
import ProductFilters from '../src/components/products/ProductFilters.jsx';
import ProductGrid from '../src/components/products/ProductGrid.jsx';
import Rating from '../src/components/products/Rating.jsx';
import WishlistButton from '../src/components/products/WishlistButton.jsx';
import { DEFAULT_FILTERS } from '../src/utils/catalog.js';

const product = SEED_DB.products[0];
const category = SEED_DB.categories[0];
const noop = () => {};

// Props válidas de ejemplo para cada componente.
const VALID = [
  ['AppButton', AppButton, { label: 'Guardar', onClick: noop, variant: 'primary', type: 'submit' }],
  ['StatusAlert', StatusAlert, { status: 'error', message: 'Algo salió mal' }],
  ['EmptyState', EmptyState, { title: 'Sin datos', actionLabel: 'Volver', actionTo: '/' }],
  ['FormField', FormField, { id: 'campo', label: 'Campo', error: 'Obligatorio', required: true }],
  ['ConfirmModal', ConfirmModal, { open: true, message: '¿Seguro?', onConfirm: noop, onCancel: noop }],
  ['DeleteButton', DeleteButton, { onConfirm: noop }],
  ['ProductImage', ProductImage, { product, width: 600 }],
  ['QuantityInput', QuantityInput, { value: 2, min: 1, max: 5, onChange: noop }],
  ['ImageField', ImageField, { id: 'img', label: 'Imagen', value: '', onChange: noop }],
  ['StatCard', StatCard, { title: 'Ventas', value: '$10.000', icon: 'bi-cash', color: 'success' }],
  ['FilterBar', FilterBar, { fields: [{ id: 'a', label: 'A', type: 'search', value: '', onChange: noop }], total: 20, shown: 4, onClear: noop }],
  ['CategoryCard', CategoryCard, { category, productCount: 3 }],
  ['CategoryGrid', CategoryGrid, { categories: SEED_DB.categories, products: SEED_DB.products }],
  ['Carousel', Carousel, { products: SEED_DB.products }],
  ['ProductGrid', ProductGrid, { products: SEED_DB.products, variant: 'add' }],
  ['ProductCard', ProductCard, { product, categoryName: 'Aventura', variant: 'click' }],
  ['ProductFilters', ProductFilters, { filters: DEFAULT_FILTERS, categories: SEED_DB.categories, onChange: noop }],
  ['Rating', Rating, { value: 4.5 }],
  ['PlatformBadges', PlatformBadges, { platforms: ['PC', 'Switch'], labels: true }],
  ['WishlistButton', WishlistButton, { product, label: true }],
];

describe('Contrato de props (PropTypes)', () => {
  let errorSpy;

  beforeEach(() => {
    PropTypes.resetWarningCache();
    errorSpy = spyOn(console, 'error');
  });

  VALID.forEach(([name, Component, props]) => {
    it(`${name} acepta sus props válidas sin avisos`, () => {
      PropTypes.checkPropTypes(Component.propTypes, props, 'prop', name);
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  it('AppButton avisa si falta la etiqueta obligatoria', () => {
    PropTypes.checkPropTypes(AppButton.propTypes, { onClick: noop }, 'prop', 'AppButton');
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.calls.mostRecent().args[0]).toContain('label');
  });

  it('QuantityInput avisa si value no es un número', () => {
    PropTypes.checkPropTypes(QuantityInput.propTypes, { value: '2', onChange: noop }, 'prop', 'QuantityInput');
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('ProductCard avisa si la variante no existe', () => {
    PropTypes.checkPropTypes(ProductCard.propTypes, { product, variant: 'gigante' }, 'prop', 'ProductCard');
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('StatusAlert avisa si el estado no está entre los permitidos', () => {
    PropTypes.checkPropTypes(StatusAlert.propTypes, { status: 'peligro' }, 'prop', 'StatusAlert');
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});
