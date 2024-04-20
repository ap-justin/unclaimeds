import { toDBFormat } from "./toDBFormat";
import type { EndowData } from "./types";

export const toJsonItem =
  (lastEIN: string) => (item: EndowData, id: number) => {
    const trailingComma = item.ein !== lastEIN ? "," : "";
    return `${JSON.stringify(toDBFormat(id, item))}${trailingComma}`;
  };
