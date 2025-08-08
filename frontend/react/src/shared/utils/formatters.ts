export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const formatChecklistId = (id: string): string => {
  return `#${id.slice(-8).toUpperCase()}`;
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};