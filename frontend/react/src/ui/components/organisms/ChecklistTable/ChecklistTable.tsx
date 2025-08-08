import React, { useState } from 'react';
import type { Checklist } from '../../../../shared/types';
import { Button } from '../../atoms';
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io";
import { TbLayoutNavbarExpandFilled, TbLayoutBottombarExpandFilled } from "react-icons/tb";
import './ChecklistTable.scss';

type SortField = 'created_at' | 'tank_full' | 'has_step' | 'has_license';
type SortDirection = 'asc' | 'desc';

export interface ChecklistTableProps {
  checklists: Checklist[];
  loading?: boolean;
  error?: string;
  onSort?: (field: SortField, direction: SortDirection) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
  className?: string;
}

export const ChecklistTable: React.FC<ChecklistTableProps> = ({
  checklists,
  loading = false,
  error,
  onSort,
  sortField,
  sortDirection,
  className = '',
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSort = (field: SortField) => {
    if (!onSort) return;
    
    const newDirection: SortDirection = 
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    
    onSort(field, newDirection);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '';
    return sortDirection === 'asc' ? <IoIosArrowDropupCircle size={18}/> : <IoIosArrowDropdownCircle size={18}/>;
  };

  const toggleRowExpansion = (checklistId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(checklistId)) {
        newSet.delete(checklistId);
      } else {
        newSet.add(checklistId);
      }
      return newSet;
    });
  };

  const isRowExpanded = (checklistId: string) => {
    return expandedRows.has(checklistId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBooleanDisplay = (value: boolean) => ({
    text: value ? 'Sim' : 'Não',
    className: value ? 'checklist-table__status--yes' : 'checklist-table__status--no'
  });

  if (loading && checklists.length === 0) {
    return (
      <div className={`checklist-table ${className}`}>
        <div className="checklist-table__loading">
          <div className="checklist-table__spinner">⌛</div>
          <p>Carregando checklists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`checklist-table ${className}`}>
        <div className="checklist-table__error">
          <div className="checklist-table__error-icon">⚠️</div>
          <h3>Erro ao carregar checklists</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (checklists.length === 0) {
    return (
      <div className={`checklist-table ${className}`}>
        <div className="checklist-table__empty">
          <div className="checklist-table__empty-icon">📋</div>
          <h3>Nenhum checklist encontrado</h3>
          <p>Crie seu primeiro checklist para começar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`checklist-table ${className}`}>
      <div className="checklist-table__container">
        <div className="checklist-table__header">
          <div 
            className={`checklist-table__header-cell checklist-table__header-cell--sortable ${
              sortField === 'tank_full' ? 'checklist-table__header-cell--active' : ''
            }`}
            onClick={() => handleSort('tank_full')}
          >
            Tanque Cheio {getSortIcon('tank_full')}
          </div>
          <div 
            className={`checklist-table__header-cell checklist-table__header-cell--sortable ${
              sortField === 'has_step' ? 'checklist-table__header-cell--active' : ''
            }`}
            onClick={() => handleSort('has_step')}
          >
            Tem Estepe {getSortIcon('has_step')}
          </div>
          <div 
            className={`checklist-table__header-cell checklist-table__header-cell--sortable ${
              sortField === 'has_license' ? 'checklist-table__header-cell--active' : ''
            }`}
            onClick={() => handleSort('has_license')}
          >
            Tem Licença {getSortIcon('has_license')}
          </div>
          <div 
            className={`checklist-table__header-cell checklist-table__header-cell--sortable checklist-table__header-cell--date ${
              sortField === 'created_at' ? 'checklist-table__header-cell--active' : ''
            }`}
            onClick={() => handleSort('created_at')}
          >
            Data de Criação {getSortIcon('created_at')}
          </div>
          <div className="checklist-table__header-cell">Ações</div>
        </div>

        <div className="checklist-table__body">
          {checklists.map((checklist) => {
            const tankFull = getBooleanDisplay(checklist.tank_full);
            const hasStep = getBooleanDisplay(checklist.has_step);
            const hasLicense = getBooleanDisplay(checklist.has_license);
            const isExpanded = isRowExpanded(checklist.id);

            return (
              <div key={checklist.id} className="checklist-table__row-group">
                <div className={`checklist-table__row ${isExpanded ? 'checklist-table__row--expanded' : ''}`}>
                  <div className="checklist-table__cell" data-label="Tanque Cheio">
                    <span className={`checklist-table__status ${tankFull.className}`}>
                      {tankFull.text}
                    </span>
                  </div>
                  <div className="checklist-table__cell" data-label="Tem Estepe">
                    <span className={`checklist-table__status ${hasStep.className}`}>
                      {hasStep.text}
                    </span>
                  </div>
                  <div className="checklist-table__cell" data-label="Tem Licença">
                    <span className={`checklist-table__status ${hasLicense.className}`}>
                      {hasLicense.text}
                    </span>
                  </div>
                  <div className="checklist-table__cell checklist-table__cell--date" data-label="Data de Criação">
                    {formatDate(checklist.created_at.toString())}
                  </div>
                  <div className="checklist-table__cell checklist-table__cell--actions">
                    <Button
                      variant="secondary"
                      onClick={() => toggleRowExpansion(checklist.id)}
                      className={`${isExpanded ? "checklist-table__action-button--expended": ""} checklist-table__action-button`}
                    >
                      {isExpanded ? <TbLayoutBottombarExpandFilled size={24}/> : <TbLayoutNavbarExpandFilled size={24}/>}
                    </Button>
                  </div>
                </div>
                
                {isExpanded && ( 
                  <div className="checklist-table__details">
                    <div className="checklist-table__details-content">
                      <div className="checklist-table__detail-item">
                        <strong className="checklist-table__detail-label">ID:</strong>
                        <span className="checklist-table__detail-value">{checklist.id}</span>
                      </div>
                      <div className="checklist-table__detail-item">
                        <strong className="checklist-table__detail-label">Data de Criação:</strong>
                        <span className="checklist-table__detail-value">
                          {new Date(checklist.created_at).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};