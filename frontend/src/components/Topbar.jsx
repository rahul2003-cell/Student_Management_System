import React from 'react';
import { LuSearch } from 'react-icons/lu';

export default function Topbar({ title, onSearch, showSearch = false }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-date">{today}</div>
      </div>
      {showSearch && (
        <div className="topbar-search">
          <LuSearch />
          <input
            type="text"
            placeholder="Search by name or email..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      )}
    </header>
  );
}
