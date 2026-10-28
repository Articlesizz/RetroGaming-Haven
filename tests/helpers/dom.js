// Utilidades de prueba para renderizar componentes React 19 en el DOM real del navegador de Karma.
import { createRoot } from 'react-dom/client';
import { act } from 'react';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export function render(ui) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => {
    root.render(ui);
  });
  return {
    host,
    unmount() {
      act(() => root.unmount());
      host.remove();
    },
  };
}

export function click(element) {
  act(() => {
    element.click();
  });
}

// Escribe en un input/textarea controlado: usa el setter nativo para que React detecte el cambio.
export function typeText(element, text) {
  const proto = element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  act(() => {
    setter.call(element, text);
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

export function changeSelect(element, value) {
  act(() => {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

export function submitForm(form) {
  act(() => {
    form.requestSubmit();
  });
}

// Ejecuta una acción del store dentro de act() y devuelve su resultado (React actualiza el estado antes de seguir).
export function runAction(action) {
  let result;
  act(() => {
    result = action();
  });
  return result;
}

export function buttonWithText(root, text) {
  return Array.from(root.querySelectorAll('button')).find((button) => button.textContent.trim() === text);
}

// Almacenamiento en memoria con la misma interfaz que localStorage.
export function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
    removeItem: (key) => {
      delete data[key];
    },
    data,
  };
}
