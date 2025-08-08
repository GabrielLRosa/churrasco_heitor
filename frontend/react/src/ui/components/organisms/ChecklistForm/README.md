# ChecklistForm

Componente de formulário para criação de checklists com funcionalidade de reset.

## Funcionalidades

- ✅ **Campos de checkbox** para cada item do checklist
- ✅ **Validação** automática dos campos
- ✅ **Reset automático** após envio
- ✅ **Reset manual** via botão cancelar
- ✅ **Callback onReset** para ações customizadas
- ✅ **Loading state** durante envio
- ✅ **TypeScript** - totalmente tipado

## Props

| Propriedade | Tipo | Obrigatório | Padrão | Descrição |
|-------------|------|-------------|--------|-----------|
| `onSubmit` | `(data: CreateChecklistRequest) => void` | ✅ | - | Callback executado ao enviar |
| `onCancel` | `() => void` | ❌ | - | Callback executado ao cancelar |
| `onReset` | `() => void` | ❌ | - | Callback executado ao resetar |
| `loading` | `boolean` | ❌ | `false` | Estado de loading |
| `className` | `string` | ❌ | `''` | Classes CSS adicionais |

## Campos do Formulário

### CreateChecklistRequest
```typescript
interface CreateChecklistRequest {
  tank_full: boolean;    // Tanque cheio
  has_step: boolean;     // Com step
  has_license: boolean;  // Com CNH
}
```

## Comportamento do Reset

### 1. Reset Automático (Após Envio)
```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSubmit(formData);
  resetForm(); // ← Reset automático
};
```

### 2. Reset Manual (Botão Cancelar)
```tsx
onClick={() => {
  resetForm(); // ← Reset manual
  onCancel();  // ← Chama callback
}}
```

### 3. Callback onReset
```tsx
const resetForm = () => {
  setFormData({
    tank_full: false,
    has_step: false,
    has_license: false,
  });
  
  // Chama o callback onReset se fornecido
  if (onReset) {
    onReset();
  }
};
```

## Exemplos de Uso

### Uso Básico
```tsx
<ChecklistForm
  onSubmit={handleCreateChecklist}
  onCancel={handleCloseModal}
  loading={creating}
/>
```

### Com Callback onReset
```tsx
<ChecklistForm
  onSubmit={handleCreateChecklist}
  onCancel={handleCloseModal}
  onReset={() => {
    console.log('Formulário resetado');
    setShowSuccessMessage(false);
    setSubmittedData(null);
  }}
  loading={creating}
/>
```

### Exemplo Completo
```tsx
const MyComponent = () => {
  const [resetCount, setResetCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = (data: CreateChecklistRequest) => {
    console.log('Enviando:', data);
    // Lógica de envio...
  };

  const handleCancel = () => {
    console.log('Cancelado');
    setShowMessage(false);
  };

  const handleReset = () => {
    console.log('Resetado');
    setResetCount(prev => prev + 1);
    setShowMessage(false);
  };

  return (
    <ChecklistForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onReset={handleReset}
      loading={false}
    />
  );
};
```

## Casos de Uso do onReset

### 1. Limpar Estados Relacionados
```tsx
const handleReset = () => {
  setShowSuccessMessage(false);
  setSubmittedData(null);
  setError(null);
};
```

### 2. Feedback Visual
```tsx
const handleReset = () => {
  setResetCount(prev => prev + 1);
  showToast('Formulário resetado');
};
```

### 3. Analytics/Tracking
```tsx
const handleReset = () => {
  analytics.track('form_reset', {
    form: 'checklist',
    timestamp: Date.now()
  });
};
```

### 4. Validação de Campos
```tsx
const handleReset = () => {
  clearFieldErrors();
  resetValidationState();
};
```

## Fluxo de Execução

```
1. Usuário preenche formulário
2. Usuário clica em "Criar Checklist"
   ↓
3. handleSubmit() é chamado
4. onSubmit() é executado
5. resetForm() é chamado automaticamente
   ↓
6. Formulário é limpo
7. onReset() é chamado (se fornecido)
```

```
1. Usuário preenche formulário
2. Usuário clica em "Cancelar"
   ↓
3. resetForm() é chamado
4. Formulário é limpo
5. onReset() é chamado (se fornecido)
6. onCancel() é chamado
```

## Vantagens

1. **UX Melhorada**: Formulário sempre limpo após ações
2. **Flexibilidade**: Callback onReset para ações customizadas
3. **Consistência**: Mesmo comportamento em todos os casos
4. **Manutenibilidade**: Lógica centralizada no componente
5. **TypeScript**: Tipagem completa para melhor DX 