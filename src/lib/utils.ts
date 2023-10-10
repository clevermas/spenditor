import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function titleCase(word = "") {
  return (
    typeof word == "string" &&
    word.length &&
    word[0].toUpperCase() + word.slice(1).toLowerCase()
  );
}

export function createList<T>(n: number, mapFn: (i: number) => T): T[] {
  return Array.from(Array(n), (_, i) => mapFn(i));
}

export function randomNItems(n) {
  return Math.ceil(Math.random() * n);
}
