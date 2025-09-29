import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function titleCase(word = ""): string {
  return (
    (typeof word == "string" &&
      word.length &&
      word[0].toUpperCase() + word.slice(1).toLowerCase()) ||
    word
  );
}

export function createList<T>(n: number, mapFn: (i: number) => T): T[] {
  return Array.from(Array(n), (_, i) => mapFn(i));
}

export function randomNItems(n) {
  return Math.ceil(Math.random() * n);
}

export interface ListItem {
  name: string;
  value: number;
}

export function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
