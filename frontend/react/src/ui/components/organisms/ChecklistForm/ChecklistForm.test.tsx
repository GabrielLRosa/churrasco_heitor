import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChecklistForm } from './ChecklistForm';

const getCheckbox = (label: string) => screen.getByLabelText(label) as HTMLInputElement;

describe('ChecklistForm', () => {
  test('envia dados e reseta formulário chamando onReset', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const onReset = jest.fn();

    render(
      <ChecklistForm onSubmit={onSubmit} onReset={onReset} />
    );

    const tanque = getCheckbox('Tanque cheio');
    const step = getCheckbox('Com step');
    const cnh = getCheckbox('Com CNH');

    await user.click(tanque);
    await user.click(step);
    await user.click(cnh);

    await user.click(screen.getByRole('button', { name: 'Criar' }));

    expect(onSubmit).toHaveBeenCalledWith({ tank_full: true, has_step: true, has_license: true });
    expect(onReset).toHaveBeenCalled();

    expect(tanque.checked).toBe(false);
    expect(step.checked).toBe(false);
    expect(cnh.checked).toBe(false);
  });

  test('cancelar reseta o formulário e chama onCancel e onReset', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const onReset = jest.fn();

    render(
      <ChecklistForm onSubmit={onSubmit} onCancel={onCancel} onReset={onReset} />
    );

    const tanque = getCheckbox('Tanque cheio');
    await user.click(tanque);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onCancel).toHaveBeenCalled();
    expect(onReset).toHaveBeenCalled();
    expect(tanque.checked).toBe(false);
  });

  test('forceReset reseta quando muda para true', async () => {
    const onSubmit = jest.fn();
    const onReset = jest.fn();

    const { rerender } = render(
      <ChecklistForm onSubmit={onSubmit} onReset={onReset} forceReset={false} />
    );

    const tanque = getCheckbox('Tanque cheio');
    await userEvent.click(tanque);
    expect(tanque.checked).toBe(true);

    rerender(<ChecklistForm onSubmit={onSubmit} onReset={onReset} forceReset={true} />);

    expect(onReset).toHaveBeenCalled();
    expect((screen.getByLabelText('Tanque cheio') as HTMLInputElement).checked).toBe(false);
  });
});