import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  test('renderiza com label e altera estado ao clicar', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Checkbox label="Aceito" onChange={onChange} />);

    const input = screen.getByRole('checkbox');
    expect(input).not.toBeChecked();

    await user.click(input);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('exibe helperText quando não há erro e error quando presente', () => {
    const { rerender } = render(<Checkbox label="Termos" helperText="Precisa marcar" />);
    expect(screen.getByText('Precisa marcar')).toBeInTheDocument();

    rerender(<Checkbox label="Termos" error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  test('respeita disabled e required', () => {
    render(<Checkbox label="Opção" disabled required />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
  });
});