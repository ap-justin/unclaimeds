type MaybeEmptyStr = string;
type Environment = "staging" | "production";

type EndowDesignation =
  | "Charity"
  | "Religious Organization"
  | "University"
  | "Hospital"
  | "Other";

declare namespace V3Endowment {
  namespace EndowCount {
    type Keys = {
      PK: "Count";
      SK: Environment;
    };

    type NonKeyAttributes = {
      count: number;
    };
  }

  namespace Endow {
    type Keys = {
      PK: `Endow#${number}`;
      SK: Environment;
    };

    type SocialMediaURLs = {
      discord?: MaybeEmptyStr;
      facebook?: MaybeEmptyStr;
      instagram?: MaybeEmptyStr;
      linkedin?: MaybeEmptyStr;
      tiktok?: MaybeEmptyStr;
      twitter?: MaybeEmptyStr;
      youtube?: MaybeEmptyStr;
    };

    type NonKeyAttributes = {
      id: number;
      slug?: MaybeEmptyStr;
      env: Environment;
      registration_number: string;
      name: string;
      endow_designation: EndowDesignation;
      overview?: MaybeEmptyStr;
      tagline?: MaybeEmptyStr;
      image?: string;
      logo?: string;
      card_img?: string;
      hq_country: string;
      active_in_countries: string[];
      street_address?: MaybeEmptyStr;
      social_media_urls: SocialMediaURLs;
      url?: MaybeEmptyStr;
      sdgs: UNSDG_NUMS[];
      receiptMsg?: MaybeEmptyStr;

      kyc_donors_only: boolean;
      hide_bg_tip: boolean;
      fiscal_sponsored: boolean;
      claimed: boolean;
      published: boolean;
      sfCompounded: boolean;
    };

    type DBRecord = Keys & NonKeyAttributes;

    //fields used in web-app
    type Item = Pick<
      DBRecord,
      | "id"
      | "slug"
      | "active_in_countries"
      | "endow_designation"
      | "fiscal_sponsored"
      | "hide_bg_tip"
      | "hq_country"
      | "image"
      | "card_img"
      | "kyc_donors_only"
      | "logo"
      | "name"
      | "overview"
      | "published"
      | "registration_number"
      | "sdgs"
      | "social_media_urls"
      | "street_address"
      | "tagline"
      | "url"
      | "claimed"
    >;

    type SortDirection = "asc" | "desc";
    type SortKey = "name_internal" | "overall" | "claimed";

    type ItemsQueryParams = {
      query: string;
      sort?: `${SortKey}+${SortDirection}`;
      page: number;
      /** EndowDesignation csv */
      endow_designation?: string;
      /** sdg num csv */
      sdgs?: string;
      /** boolean csv */
      kyc_only?: string;
      /** boolean csv */
      claimed?: string;
      /** country name csv */
      countries?: string;
      env: Environment;
      /** Item key csv */
      fields?: string;
    };

    type ItemQueryParams = {
      fields?: string; //csv string
      slug?: string;
      env: Environment;
    };
  }

  namespace RegNumEnvGsi {
    type Name = "regnum-env-gsi";
    type Keys = Pick<Endow.NonKeyAttributes, "registration_number" | "env">;
    type DBRecord = Keys &
      Pick<Endow.NonKeyAttributes, "claimed" | "name" | "hq_country">;

    type ItemParams = {
      env: Environment;
      ein?: string;
    };
  }
  namespace SlugEnvGsi {
    type Name = "slug-env-gsi";
    type Keys = Pick<Endow.NonKeyAttributes, "slug" | "env">;
    type DBRecord = Endow.DBRecord; //all attributes are copied to this index
  }

  namespace Program {
    type Id = string;
    type Keys = {
      PK: `Endow#${number}`;
      SK: `Prog#${Id}`;
    };

    type Milestone = {
      id: string;
      date: ISODate;
      title: string;
      description: string;
      media?: string;
    };

    type NonKeyAttributes = {
      id: Id;
      title: string;
      banner?: string;
      description: string;
      milestones: Milestone[];
    };
    type DBRecord = Keys & NonKeyAttributes;
  }

  type DBRecord = Endow.DBRecord | Program.DBRecord;
}

declare namespace Algolia {
  export type EndowObjectID = `${Environment}-${number}`;
  export type EndowRecord = {
    objectID: EndowObjectID;
    name_internal: string;
  } & Required<
    Pick<
      V3Endowment.Endow.DBRecord,
      //card UI attribures
      | "id"
      | "card_img"
      | "name"
      | "tagline"
      | "hq_country"
      | "sdgs"
      | "active_in_countries"
      | "endow_designation"
      //icons
      | "kyc_donors_only"
      | "claimed"

      //filters
      | "env"
      | "published"
    >
  >;
}
