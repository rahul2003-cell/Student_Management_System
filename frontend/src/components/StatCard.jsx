import React from 'react';

export default function StatCard({ label, value, foot, accent }) {
  return (
    <div className="stat-card" style={accent ? { '--accent': accent } : undefined}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {foot && <div className="stat-foot">{foot}</div>}
    </div>
  );
}
