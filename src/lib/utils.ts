import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  // If it's a full ISO8601 (contains T), get only the date part
  const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = datePart.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function formatTime(dateStr: string | null | undefined): string {
  if (!dateStr || !dateStr.includes('T')) return '—';
  const timePart = dateStr.split('T')[1];
  const parts = timePart.split(':');
  if (parts.length < 2) return '—';
  const [hour, minute] = parts;
  return `${hour}:${minute}`;
}
