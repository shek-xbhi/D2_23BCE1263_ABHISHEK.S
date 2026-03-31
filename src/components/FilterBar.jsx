import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown, ChevronDown } from 'lucide-react';
import categories from '../data/categories';
import { STATUSES, STATUS_CONFIG } from '../utils/statusUtils';

const FilterBar = ({ filters, onFilterChange, onSortChange, sort }) => {
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
    value: key,
    label: config.label,
    color: config.color,
  }));

  const activeFilterCount = [
    filters.category,
    filters.status,
    filters.location,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="filter-bar">
      <div className="filter-bar-top">
        <div className="filter-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search issues by title or description..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
          {filters.search && (
            <button onClick={() => onFilterChange({ ...filters, search: '' })} className="filter-clear-btn">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="filter-actions">
          <button
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="filter-count">{activeFilterCount}</span>
            )}
          </button>

          <div className="sort-dropdown">
            <button className="sort-btn">
              <ArrowUpDown size={16} />
              <span>{sort === 'recent' ? 'Most Recent' : 'Most Validated'}</span>
              <ChevronDown size={14} />
            </button>
            <div className="sort-options">
              <button
                className={sort === 'recent' ? 'active' : ''}
                onClick={() => onSortChange('recent')}
              >
                Most Recent
              </button>
              <button
                className={sort === 'validated' ? 'active' : ''}
                onClick={() => onSortChange('validated')}
              >
                Most Validated
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="filter-bar-expanded">
          <div className="filter-group">
            <label>Category</label>
            <div className="filter-chips">
              <button
                className={`filter-chip ${!filters.category ? 'active' : ''}`}
                onClick={() => onFilterChange({ ...filters, category: '' })}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-chip ${filters.category === cat.id ? 'active' : ''}`}
                  onClick={() => onFilterChange({ ...filters, category: cat.id })}
                  style={filters.category === cat.id ? { 
                    backgroundColor: `${cat.color}20`, 
                    borderColor: cat.color, 
                    color: cat.color 
                  } : {}}
                >
                  <cat.icon size={14} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <div className="filter-chips">
              <button
                className={`filter-chip ${!filters.status ? 'active' : ''}`}
                onClick={() => onFilterChange({ ...filters, status: '' })}
              >
                All
              </button>
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`filter-chip ${filters.status === opt.value ? 'active' : ''}`}
                  onClick={() => onFilterChange({ ...filters, status: opt.value })}
                  style={filters.status === opt.value ? {
                    backgroundColor: `${opt.color}20`,
                    borderColor: opt.color,
                    color: opt.color,
                  } : {}}
                >
                  <span className="status-dot-mini" style={{ backgroundColor: opt.color }} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              className="clear-all-filters"
              onClick={() => onFilterChange({ search: '', category: '', status: '', location: '' })}
            >
              <X size={14} />
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
