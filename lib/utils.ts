import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes Tailwind de forma segura, resolvendo conflitos
 * Uso: cn('px-4 py-2', condicao && 'bg-green-500')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata data para exibição em português
 * Ex: "sábado, 12 de julho de 2025"
 */
export function formatarData(data: string | Date): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Formata horário para exibição
 * Ex: "15:30"
 */
export function formatarHorario(horario: string): string {
  return horario.substring(0, 5);
}

/**
 * Formata valor em reais
 * Ex: "R$ 25,00"
 */
export function formatarDinheiro(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

/**
 * Retorna as iniciais de um nome
 * Ex: "João Silva" → "JS"
 */
export function iniciais(nome: string): string {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

/**
 * Retorna o label da posição no campo
 */
export const POSICOES = {
  goleiro: "Goleiro",
  zagueiro: "Zagueiro",
  lateral: "Lateral",
  volante: "Volante",
  meia: "Meia",
  atacante: "Atacante",
} as const;

export type Posicao = keyof typeof POSICOES;

/**
 * Status de confirmação da pelada
 */
export const STATUS_CONFIRMACAO = {
  confirmado: "Vou",
  recusado: "Não vou",
  talvez: "Talvez",
} as const;

/**
 * Status da pelada
 */
export const STATUS_PELADA = {
  agendada: "Agendada",
  em_andamento: "Em andamento",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
} as const;
