// Cambio de tema del panel (color-modes.js del template): claro, oscuro o automático. Se recuerda en localStorage.
import { useEffect, useState } from 'react';
import { readJson, writeJson } from '../../data/storage.js';

const THEME_KEY = 'mi-tienda:theme';
const OPTIONS = [
  { value: 'light', label: 'Claro', icon: 'bi-sun-fill' },
  { value: 'dark', label: 'Oscuro', icon: 'bi-moon-stars-fill' },
  { value: 'auto', label: 'Automático', icon: 'bi-circle-half' },
];

export function applyTheme(theme) {
  const resolved = theme === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
  document.documentElement.setAttribute('data-bs-theme', resolved);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => readJson(THEME_KEY, 'light'));

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Al salir del panel la tienda vuelve al tema claro.
  useEffect(() => () => document.documentElement.setAttribute('data-bs-theme', 'light'), []);

  const choose = (value) => {
    setTheme(value);
    writeJson(THEME_KEY, value);
  };

  const current = OPTIONS.find((option) => option.value === theme) ?? OPTIONS[0];

  return (
    <div className="dropdown">
      <button className="btn btn-link nav-link px-3 text-white dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label={`Cambiar tema (actual: ${current.label})`}>
        <i className={`bi ${current.icon}`} aria-hidden="true" />
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        {OPTIONS.map((option) => (
          <li key={option.value}>
            <button type="button" className={`dropdown-item d-flex align-items-center gap-2${option.value === theme ? ' active' : ''}`} onClick={() => choose(option.value)}>
              <i className={`bi ${option.icon}`} aria-hidden="true" /> {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
