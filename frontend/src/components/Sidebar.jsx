import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuGraduationCap,
  LuBookOpen,
  LuChartBar,
} from 'react-icons/lu';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LuLayoutDashboard, end: true },
  { to: '/students', label: 'Students', icon: LuGraduationCap },
  { to: '/courses', label: 'Courses', icon: LuBookOpen },
  { to: '/reports', label: 'Reports', icon: LuChartBar },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-seal">SM</div>
        <div>
          <div className="brand-name">The Ledger</div>
          <div className="brand-sub">Registrar's Office</div>
        </div>
      </div>

      <span className="nav-eyebrow">Records</span>
      <ul className="nav-list">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        Student Management System<br />
        v1.0.0 &middot; Built with Spring Boot &amp; React
      </div>
    </aside>
  );
}
