import type { Algolia, EndowData } from "./types";

export const toAlgoliaIndexFormat = (
  endow: EndowData,
  id: number
): Algolia.EndowRecord => {
  return {
    id,
    objectID: `production-${id}`,
    card_img: "",
    name: endow.name,
    name_internal: endow.name.toLowerCase(),
    tagline: "",
    hq_country: "United States",
    sdgs: [],
    active_in_countries: ["United States"],
    endow_designation: "Charity",
    kyc_donors_only: false,
    claimed: true,
    env: "production",
    published: true,
  };
};
