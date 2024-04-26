import { lastItemEIN } from "./setup";
import type { Algolia, EndowData, V3Endowment } from "./types";

type Formatter<T> = (id: number, input: EndowData) => T;

export const algoliaIndexFormat: Formatter<Algolia.EndowRecord> = (
  id,
  endow
) => {
  const name = `${endow.env === "staging" ? "test-" : ""}${endow.name}`;
  return {
    id,
    objectID: `${endow.env}-${id}`,
    card_img: "",
    name: name,
    name_internal: name.toLowerCase(),
    tagline: "",
    hq_country: "United States",
    sdgs: [],
    active_in_countries: ["United States"],
    endow_designation: "Charity",
    kyc_donors_only: false,
    claimed: true,
    env: endow.env,
    published: true,
  };
};

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

type DynamoDBJson = {
  [K in Key]-?: V<K> extends undefined
    ? undefined
    : Record<DT<K>, V3Endowment.Endow.DBRecord[K]>;
};

export const dynamoDBFormat: Formatter<DynamoDBJson> = (id: number, endow) => {
  const name = `${endow.env === "staging" ? "test-" : ""}${endow.name}`;
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
      S: endow.ein,
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
      S: [endow.city, endow.state].filter(Boolean).join(", "),
    },
  };
};

export const writer =
  (endow: EndowData, formatter: Formatter<object>) =>
  (id: number): string =>
    `${JSON.stringify(formatter(id, endow))}${
      //trailing comma
      endow.ein !== lastItemEIN ? "," : ""
    }`;
