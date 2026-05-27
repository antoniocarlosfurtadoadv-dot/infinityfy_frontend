export function formeteCNPJ(cnpj: string): string {
  // Remove todos os caracteres não numéricos do CNPJ
  const numericCNPJ = cnpj.replace(/\D/g, '');

  // Aplica a formatação específica do CNPJ
  return numericCNPJ.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  );
}

export function formateCPF(cpf: string): string {
  // Remove todos os caracteres não numéricos do CPF
  const numericCPF = cpf.replace(/\D/g, '');

  // Aplica a formatação específica do CPF
  return numericCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export function formatDate(date: Date | string) {

  if (!date || Number.isNaN(new Date(date).getTime())) {
    return ''; // Retorna string vazia para datas inválidas
  }

  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC', // ← Evita "adiantamento" por fuso
  });
}
export function formatDateShort(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDate2Digit(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDayDateToHour(date: Date | string) {
  const newDate = new Date(date);
  return newDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateToYear(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric',
  });
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date): boolean {
  return date.getTime() < new Date().getTime();
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}


/**
 * Format distance from now to a date (e.g., "2 days ago", "in 3 hours")
 */
export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const isPastDate = diffMs < 0;

  // Seconds
  if (diffSec < 60) {
    return isPastDate ? 'há alguns segundos' : 'em alguns segundos';
  }

  // Minutes
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return isPastDate
      ? `há ${diffMin} minuto${diffMin > 1 ? 's' : ''}`
      : `em ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
  }

  // Hours
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return isPastDate
      ? `há ${diffHour} hora${diffHour > 1 ? 's' : ''}`
      : `em ${diffHour} hora${diffHour > 1 ? 's' : ''}`;
  }

  // Days
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) {
    return isPastDate
      ? `há ${diffDay} dia${diffDay > 1 ? 's' : ''}`
      : `em ${diffDay} dia${diffDay > 1 ? 's' : ''}`;
  }

  // Months
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) {
    return isPastDate
      ? `há ${diffMonth} ${diffMonth > 1 ? 'meses' : 'mês'}`
      : `em ${diffMonth} ${diffMonth > 1 ? 'meses' : 'mês'}`;
  }

  // Years
  const diffYear = Math.floor(diffMonth / 12);
  return isPastDate
    ? `há ${diffYear} ano${diffYear > 1 ? 's' : ''}`
    : `em ${diffYear} ano${diffYear > 1 ? 's' : ''}`;
}

