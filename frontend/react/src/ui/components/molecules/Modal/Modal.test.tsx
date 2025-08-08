import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  test('renderiza conteúdo quando aberto', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen onClose={onClose} title="Título" showCloseButton>
        <div>Conteúdo</div>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    expect(screen.getByText('Título')).toBeInTheDocument();
  });

  test('fecha ao clicar no overlay quando permitido', () => {
    const onClose = jest.fn();
    const { container } = render(
      <Modal isOpen onClose={onClose} closeOnOverlayClick>
        <div>Conteúdo</div>
      </Modal>
    );

    const overlay = container.querySelector('.modal-overlay');
    expect(overlay).toBeTruthy();
    fireEvent.click(overlay!);

    expect(onClose).toHaveBeenCalled();
  });

  test('não fecha ao clicar dentro do modal', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <div>Conteúdo</div>
      </Modal>
    );

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  test('fecha ao pressionar ESC quando habilitado', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen onClose={onClose} closeOnEscape>
        <div>Conteúdo</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  test('não fecha ao pressionar ESC quando desabilitado', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen onClose={onClose} closeOnEscape={false}>
        <div>Conteúdo</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});