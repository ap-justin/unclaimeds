import { marshall } from "@aws-sdk/util-dynamodb";
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
    claimed: false,
    env: endow.env,
    published: true,
  };
};

export const dynamoDBFormat: Formatter<Record<string, any>> = (
  id: number,
  endow
) => {
  const name = `${endow.env === "staging" ? "test-" : ""}${endow.name}`;
  const unmarshalled: V3Endowment.Endow.DBRecord = {
    PK: `Endow#${id}`,
    SK: endow.env,
    id: id,
    env: endow.env,
    registration_number: endow.ein,
    name,
    active_in_countries: ["United States"],
    claimed: false,
    kyc_donors_only: false,
    fiscal_sponsored: false,
    endow_designation: "Charity",
    hq_country: "United States",
    sdgs: [],
    social_media_urls: {},
    street_address: [endow.city, endow.state].filter(Boolean).join(", "),
  };
  return { Item: marshall(unmarshalled) };
};

export const jsonWriter =
  (endow: EndowData, formatter: Formatter<object>) =>
  (id: number): string =>
    `${JSON.stringify(formatter(id, endow))}${
      //trailing comma
      endow.ein !== lastItemEIN ? "," : ""
    }`;

export const dynamoWriter =
  (endow: EndowData, formatter: Formatter<object>) =>
  (id: number): string =>
    `${JSON.stringify(formatter(id, endow))}\n`;
