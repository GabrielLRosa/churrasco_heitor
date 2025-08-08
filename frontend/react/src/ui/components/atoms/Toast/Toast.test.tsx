import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
  test('não renderiza quando isVisible=false', () => {
    const { container } = render(<Toast message="Olá" isVisible={false} />);
    expect(container.firstChild).toBeNull();
  });

  test('renderiza quando isVisible=true e exibe mensagem', () => {
    render(<Toast message="Sucesso!" isVisible />);
    expect(screen.getByText('Sucesso!')).toBeInTheDocument();
  });

  test('aplica classes por variante e dispara onDismiss no click', () => {
    const onDismiss = jest.fn();
    const { rerender } = render(<Toast message="Msg" variant="success" isVisible onDismiss={onDismiss} />);
    const container = screen.getByText('Msg').closest('.toast') as HTMLElement;
    expect(container).toHaveClass('toast--success');

    fireEvent.click(container);
    expect(onDismiss).toHaveBeenCalled();

    rerender(<Toast message="Msg" variant="danger" isVisible />);
    expect(screen.getByText('Msg').closest('.toast')).toHaveClass('toast--danger');

    rerender(<Toast message="Msg" variant="warning" isVisible />);
    expect(screen.getByText('Msg').closest('.toast')).toHaveClass('toast--warning');
  });
});