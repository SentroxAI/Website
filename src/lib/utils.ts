import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Delay execution.
 */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sleep alias.
 */
export const sleep = delay;

/**
 * Capitalize first letter.
 */
export function capitalize(value: string) {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Truncate text.
 */
export function truncate(
  text: string,
  length = 100
) {
  if (text.length <= length) return text;

  return text.slice(0, length) + "...";
}

/**
 * Generate random id.
 */
export function generateId(length = 12) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

/**
 * Currency formatter.
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Number formatter.
 */
export function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value);
}

/**
 * Debounce.
 */
export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  wait = 300
) {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

/**
 * Copy text.
 */
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch {
    return false;
  }
}

/**
 * Smooth scroll.
 */
export function scrollToSection(id: string) {
  const element = document.getElementById(id);

  if (!element) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/**
 * Check email.
 */
export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Random integer.
 */
export function random(min: number, max: number) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  );
}

/**
 * Clamp value.
 */
export function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Slugify.
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}