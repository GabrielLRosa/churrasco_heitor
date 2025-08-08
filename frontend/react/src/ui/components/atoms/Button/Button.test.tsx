import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  test('renderiza com texto e classes padrão', () => {
    render(<Button>Enviar</Button>);
    const btn = screen.getByRole('button', { name: 'Enviar' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('button', 'button--primary', 'button--medium');
  });

  test('aplica variantes e tamanhos', () => {
    render(<>
      <Button variant="secondary">A</Button>
      <Button variant="danger">B</Button>
      <Button variant="success">C</Button>
      <Button variant="warning">D</Button>
      <Button size="small">E</Button>
      <Button size="large">F</Button>
    </>);

    expect(screen.getByRole('button', { name: 'A' })).toHaveClass('button--secondary');
    expect(screen.getByRole('button', { name: 'B' })).toHaveClass('button--danger');
    expect(screen.getByRole('button', { name: 'C' })).toHaveClass('button--success');
    expect(screen.getByRole('button', { name: 'D' })).toHaveClass('button--warning');
    expect(screen.getByRole('button', { name: 'E' })).toHaveClass('button--small');
    expect(screen.getByRole('button', { name: 'F' })).toHaveClass('button--large');
  });

  test('mostra loading e desabilita quando loading=true', async () => {
    render(<Button loading>Salvar</Button>);
    const btn = screen.getByRole('button', { name: /Salvar/ });
    expect(btn).toBeDisabled();
    expect(btn.querySelector('.button__spinner')).toBeInTheDocument();
    expect(btn.querySelector('.button__text--loading')).toBeInTheDocument();
  });

  test('chama onClick quando clicado', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Clique</Button>);
    await user.click(screen.getByRole('button', { name: 'Clique' }));
    expect(onClick).toHaveBeenCalled();
  });

  test('não chama onClick quando disabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick}>Clique</Button>);
    await user.click(screen.getByRole('button', { name: 'Clique' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});