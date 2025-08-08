import { useState } from "react";
import { PageLayout } from "../../components/templates";
import { ChecklistForm } from "../../components/molecules";
import { Button } from "../../components/atoms";
import { useChecklistContext } from "../../contexts";
import type { CreateChecklistRequest } from "../../../shared/types";
import { IoRefreshCircle } from "react-icons/io5";
import "./CreateCheckList.scss";
import { Toast } from "../../components/atoms";
import { useToast } from "../../hooks";
import { useNavigate } from 'react-router-dom';

export const CreateCheckList: React.FC = () => {
  const {
    checklists,
    loading,
    creating,
    error,
    createChecklist,
    clearError,
  } = useChecklistContext();
  const navigate = useNavigate();
  const [forceResetstate, setForceResetstate] = useState(false);
  const { toastState, showToast, hideToast } = useToast();


  const handleCreateChecklist = async (data: CreateChecklistRequest) => {
    try {
      await createChecklist(data);
      showToast({
        message: 'Operação concluída com sucesso!',
        variant: 'success',
        time: 2000,
      });
    } catch (error) {
      console.error("Erro ao criar checklist:", error);
    }
  };

  const handleClean = () => {
    setForceResetstate(true);
    if (error) {
      clearError();
    }
  };

  const pageActions = (
    <div className="checklist-page__actions">
      <Button
        variant="primary"
        onClick={handleClean}
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
        title="Nova Checklist"
        className="checklist-page"
      >
        <Toast {...toastState} onDismiss={hideToast} />
        <div className="checklist-page__content">
          <div className="checklist-page__main-section">
            <ChecklistForm
              onSubmit={handleCreateChecklist}
              onCancel={() => { navigate('/checklist/list');}}
              onReset={() => {}}
              forceReset={forceResetstate}
              loading={creating}
            />
          </div>
        </div>
      </PageLayout>
    </>
  );
};
