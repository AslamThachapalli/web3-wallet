import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DerivationPath = {
  solana: (x: number) => `m/44'/501'/${x}'/0'`,
  etherium: (x: number) => `m/44'/60'/${x}'/0'`,
};
