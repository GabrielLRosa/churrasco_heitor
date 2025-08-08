import React, { useState, useRef } from 'react';
import { Button } from '../../atoms';
import { useClickOutside } from '../../../hooks';
import type { ChecklistListParams } from '../../../../shared/types';
import { RiFilterFill } from "react-icons/ri";
import { RiFilterOffFill } from "react-icons/ri";
import './ChecklistFilters.scss';

const BOOLEAN_FILTERS = ['tank_full', 'has_step', 'has_license'] as const;
type BooleanFilterKeys = typeof BOOLEAN_FILTERS[number];

interface ChecklistFiltersProps {
  onFiltersChange: (filters: ChecklistListParams) => void;
  loading?: boolean;
  className?: string;
}

export const ChecklistFilters: React.FC<ChecklistFiltersProps> = ({
  onFiltersChange,
  loading = false,
  className = '',
}) => {
  const [activeFilters, setActiveFilters] = useState<Partial<Record<BooleanFilterKeys, boolean>>>({});
  const [showFilters, setShowFilters] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const { ref: tooltipRef } = useClickOutside({
    onOutsideClick: showFilters ? () => setShowFilters(false) : undefined,
    enabled: showFilters,
  });

  const getFilterLabel = (filterKey: BooleanFilterKeys): string => {
    const labels: Record<BooleanFilterKeys, string> = {
      tank_full: 'Tanque Cheio',
      has_step: 'Tem Estepe',
      has_license: 'Tem CNH',
    };
    return labels[filterKey];
  };

  const handleFilterToggle = (filterKey: BooleanFilterKeys, value: boolean) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (newFilters[filterKey] === value) {
        delete newFilters[filterKey];
      } else {
        newFilters[filterKey] = value;
      }
      
      return newFilters;
    });
  };

  const handleApplyFilters = () => {
    const filters: ChecklistListParams = {
      page: 1, 
      limit: 10,
      ...activeFilters,
    };
    
    onFiltersChange(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    onFiltersChange({
      page: 1,
      limit: 10,
    });
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className={`checklist-filters ${className}`}>
      <div className="checklist-filters__container">
        <div ref={buttonRef}>
          <Button
            variant="primary"
            onClick={() => setShowFilters(!showFilters)}
            className="checklist-filters__toggle"
          >
            {showFilters ? <RiFilterOffFill size={28} /> : <RiFilterFill size={28} />}
            {hasActiveFilters && <span className="checklist-filters__active-indicator">({Object.keys(activeFilters).length})</span>}
          </Button>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="warning"
            onClick={handleClearFilters}
            disabled={loading}
          >
            Limpar Filtros
          </Button>
        )}

        {showFilters && (
          <div ref={tooltipRef} className="checklist-filters__content checklist-filters__tooltip">
          <div className="checklist-filters__grid">
            {BOOLEAN_FILTERS.map((filterKey) => (
              <div key={filterKey} className="checklist-filters__filter-group">
                <label className="checklist-filters__filter-label">
                  {getFilterLabel(filterKey)}
                </label>
                
                <div className="checklist-filters__filter-options">
                  <button
                    type="button"
                    className={`checklist-filters__option checklist-filters__option--yes ${
                      activeFilters[filterKey] === true ? 'checklist-filters__option--active' : ''
                    }`}
                    onClick={() => handleFilterToggle(filterKey, true)}
                    disabled={loading}
                  >
                    Sim
                  </button>
                  
                  <button
                    type="button"
                    className={`checklist-filters__option checklist-filters__option--no ${
                      activeFilters[filterKey] === false ? 'checklist-filters__option--active' : ''
                    }`}
                    onClick={() => handleFilterToggle(filterKey, false)}
                    disabled={loading}
                  >
                    Não
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="checklist-filters__actions">
            <Button
              variant="primary"
              onClick={handleApplyFilters}
              disabled={loading}
              loading={loading}
            >
              Aplicar Filtros
            </Button>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};