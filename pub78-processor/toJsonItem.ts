import { toDBFormat } from "./toDBFormat";
import type { EndowData } from "./types";

export const toJsonItem = (item: EndowData, id: number, lastEIN: string) => {
  const trailingComma = item.ein !== lastEIN ? "," : "";
  return `${JSON.stringify(toDBFormat(id, item))}${trailingComma}`;
};
