import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChecklistFilters } from './ChecklistFilters';

describe('ChecklistFilters', () => {
  test('abre e fecha tooltip, aplicando filtros', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    const { container } = render(<ChecklistFilters onFiltersChange={onFiltersChange} />);

    const toggleBtn = container.querySelector('.checklist-filters__toggle') as HTMLElement;
    await user.click(toggleBtn);

    expect(container.querySelector('.checklist-filters__content')).toBeInTheDocument();

    const tanqueGroup = screen.getByText('Tanque Cheio').closest('.checklist-filters__filter-group') as HTMLElement;
    const simButton = within(tanqueGroup).getByText('Sim');
    await user.click(simButton);

    await user.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));

    expect(onFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      page: 1,
      limit: 10,
      tank_full: true,
    }));
  });

  test('botão Limpar Filtros limpa filtros', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    const { container } = render(<ChecklistFilters onFiltersChange={onFiltersChange} />);

    const toggleBtn = container.querySelector('.checklist-filters__toggle') as HTMLElement;
    await user.click(toggleBtn);

    const tanqueGroup = screen.getByText('Tanque Cheio').closest('.checklist-filters__filter-group') as HTMLElement;
    const simButton = within(tanqueGroup).getByText('Sim');
    await user.click(simButton);

    await user.click(toggleBtn);

    const clearBtn = screen.getByRole('button', { name: 'Limpar Filtros' });
    await user.click(clearBtn);

    expect(onFiltersChange).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  test('clicar fora fecha tooltip', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();
    const { container } = render(<ChecklistFilters onFiltersChange={onFiltersChange} />);

    const toggleBtn = container.querySelector('.checklist-filters__toggle') as HTMLElement;
    await user.click(toggleBtn);
    expect(container.querySelector('.checklist-filters__content')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(container.querySelector('.checklist-filters__content')).not.toBeInTheDocument();
  });
});