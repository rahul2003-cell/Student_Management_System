import React from 'react';

export default function StatusBadge({ status }) {
  const isActive = String(status).toUpperCase() === 'ACTIVE';
  return (
    <span className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}
