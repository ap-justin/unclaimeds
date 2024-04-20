import type { EndowData, V3Endowment } from "./types";

type RemoveOptional<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};
type Data = RemoveOptional<V3Endowment.Endow.DBRecord> &
  //include as state and city is available in pub78
  Required<Pick<V3Endowment.Endow.DBRecord, "street_address">>;
type Key = keyof Data;
type V<K extends Key> = Data[K];
type DT<K extends Key> = V<K> extends boolean
  ? "BOOL"
  : V<K> extends string
    ? "S"
    : V<K> extends number
      ? "N"
      : V<K> extends unknown[]
        ? "L"
        : V<K> extends Record<string, unknown>
          ? "M"
          : "";

export function toDBFormat(
  id: number,
  { name, ein, state, city }: EndowData
): {
  [K in Key]-?: V<K> extends undefined
    ? undefined
    : Record<DT<K>, V3Endowment.Endow.DBRecord[K]>;
} {
  return {
    PK: {
      S: `Endow#${id}`,
    },
    SK: {
      S: "production",
    },
    id: {
      N: id,
    },
    env: {
      S: "production",
    },
    registration_number: {
      S: ein,
    },
    name: {
      S: name,
    },
    active_in_countries: {
      L: ["United States"],
    },
    claimed: {
      BOOL: false,
    },
    kyc_donors_only: {
      BOOL: false,
    },
    fiscal_sponsored: {
      BOOL: false,
    },
    endow_designation: {
      S: "Charity",
    },
    hq_country: {
      S: "United States",
    },
    sdgs: {
      L: [],
    },
    social_media_urls: {
      M: {},
    },
    street_address: {
      S: [city, state].filter(Boolean).join(", "),
    },
  };
}
