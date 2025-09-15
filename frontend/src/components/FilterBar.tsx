import React from 'react';
import { FilterStatus } from '../types';
import '../styles/FilterBar.css';

interface FilterBarProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  currentFilter, 
  onFilterChange, 
  stats 
}) => {
  const filters: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: stats.total },
    { key: 'pending', label: '未完成', count: stats.pending },
    { key: 'completed', label: '已完成', count: stats.completed },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-buttons">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            className={`filter-button ${
              currentFilter === key ? 'active' : ''
            }`}
            onClick={() => onFilterChange(key)}
          >
            <span className="filter-label">{label}</span>
            <span className="filter-count">({count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;