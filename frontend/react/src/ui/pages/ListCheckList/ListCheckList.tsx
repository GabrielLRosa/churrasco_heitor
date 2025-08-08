import React, { useState, useEffect, useCallback } from "react";
import {
  PageLayout,
  ChecklistForm,
  ChecklistFilters,
  Pagination,
  Modal,
  ChecklistTable,
  Button,
  Toast,
} from "@ui/components";

import { useChecklistContext } from "@ui/contexts";
import type {
  CreateChecklistRequest,
  ChecklistListParams,
} from "@shared/types";
import { IoRefreshCircle } from "react-icons/io5";
import "./ListCheckList.scss";
import { useToast } from "@ui/hooks";

type SortField = "created_at" | "tank_full" | "has_step" | "has_license";
type SortDirection = "asc" | "desc";

export const ListCheckList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const {
    checklists,
    loading,
    creating,
    error,
    pagination,
    createChecklist,
    getChecklists,
    refresh,
    clearError,
    activeFilters,
  } = useChecklistContext();

  useEffect(() => {
    getChecklists({
      ...(activeFilters ?? {}),
      limit: pageLimit,
      page: currentPage,
      sort: `${sortField},${sortDirection}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { toastState, showToast, hideToast } = useToast();

  const handleCreateChecklist = async (data: CreateChecklistRequest) => {
    try {
      await createChecklist(data);
      setShowForm(false);
      showToast({
        message: "Operação concluída com sucesso!",
        variant: "success",
        time: 2000,
      });
    } catch (error) {
      console.error("Erro ao criar checklist:", error);
    }
  };

  const handleCloseModal = () => {
    setShowForm(false);
    if (error) {
      clearError();
    }
  };

  const handleRefresh = () => {
    refresh();
    if (error) {
      clearError();
    }
  };

  const openCreateForm = useCallback(() => {
    setShowForm(true);
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    (window as { openChecklistForm?: () => void }).openChecklistForm =
      openCreateForm;

    return () => {
      delete (window as { openChecklistForm?: () => void }).openChecklistForm;
    };
  }, [openCreateForm]);

  const handleFiltersChange = (filters: ChecklistListParams) => {
    setCurrentPage(1);
    getChecklists({
      ...filters,
      page: 1,
      limit: pageLimit,
      sort: `${sortField},${sortDirection}`,
    });
    if (error) {
      clearError();
    }
  };

  const handleSort = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1);
    getChecklists({
      ...(activeFilters ?? {}),
      page: 1,
      limit: pageLimit,
      sort: `${field},${direction}`,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getChecklists({
      ...(activeFilters ?? {}),
      page,
      limit: pageLimit,
      sort: `${sortField},${sortDirection}`,
    });
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setPageLimit(newLimit);
    setCurrentPage(1);
    getChecklists({
      ...(activeFilters ?? {}),
      page: 1,
      limit: newLimit,
      sort: `${sortField},${sortDirection}`,
    });
  };

  const pageActions = (
    <div className="checklist-page__actions">
      <ChecklistFilters
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />
      <Button
        variant="primary"
        onClick={handleRefresh}
        disabled={loading}
        loading={loading && checklists.length === 0}
      >
        <IoRefreshCircle size={32} />
      </Button>
    </div>
  );

  return (
    <>
      <PageLayout
        actions={pageActions}
        title="Checklists"
        className="checklist-page"
      >
        <Toast {...toastState} onDismiss={hideToast} />
        <div className="checklist-page__content">
          <div className="checklist-page__main-section">
            <ChecklistTable
              checklists={checklists || []}
              loading={loading}
              error={error || undefined}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          </div>

          <div className="checklist-page__pagination-section">
            <Pagination
              currentPage={pagination?.page || 1}
              totalPages={pagination?.totalPages || 1}
              itemsPerPage={pageLimit}
              totalItems={pagination ? checklists?.length || 0 : 0}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              loading={loading}
            />
          </div>
        </div>
      </PageLayout>

      <Modal
        isOpen={showForm}
        onClose={handleCloseModal}
        title="Novo Checklist"
        size="medium"
        closeOnOverlayClick={true}
        closeOnEscape={true}
      >
        <ChecklistForm
          onSubmit={handleCreateChecklist}
          onCancel={handleCloseModal}
          loading={creating}
        />
      </Modal>
    </>
  );
};
