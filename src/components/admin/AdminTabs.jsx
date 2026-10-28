// Pestañas de sección del panel (nav nav-tabs del template). La pestaña activa se calcula por la ruta.
import { NavLink } from 'react-router-dom';

export default function AdminTabs({ tabs }) {
  return (
    <ul className="nav nav-tabs mb-3 flex-wrap">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab.to}>
          <NavLink to={tab.to} end={tab.end ?? true} className={({ isActive }) => `nav-link nav-menu${isActive ? ' active' : ''}`}>
            {tab.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
