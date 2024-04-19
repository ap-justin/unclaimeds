declare namespace V2Endowment {
	type Index =
		| "slug-env-index"
		| "regnum-env-index"
		| "chain-id-index"
		| "chain-index"
		| "chain-name-index"
		| "chain-overall-index"
		| "endow_type-chain-index"
		| "registration_uuid-index";

	type MainKeys = {
		chain_id: Environment; //PK
		id: EndowID; //SK
	};

	type Chain_ID_IndexKeys = {
		chain: Environment; //PK
		id: EndowID; //SK
	};

	type ChainIndexKeys = {
		chain: Environment; //PK
	};

	type Chain_Name_IndexKeys = {
		chain: Environment; //PK
		name_internal: string; //SK
	};

	type Chain_Overall_IndexKeys = {
		chain: Environment; //PK
		overall?: number; //SK
	};
	type EndowType_Chain_IndexKeys = {
		endow_type: "charity"; //PK
		chain: Environment; //SK
	};
	type RegistrationUUIDindexKeys = {
		registration_uuid?: string; //PK
	};

	type SlugIndexKeys = {
		slug?: string; //PK
		chain_id: Environment; //SK
	};

	type RegNumEnvIndexKeys = {
		/** EIN or Registration number for FSA */
		registration_number: string;
		chain_id: Environment; //SK
	};

	type SocialMediaURLs = {
		discord: MaybeEmptyStr;
		facebook: MaybeEmptyStr;
		instagram: MaybeEmptyStr;
		linkedin: MaybeEmptyStr;
		tiktok: MaybeEmptyStr;
		twitter: MaybeEmptyStr;
		youtube: MaybeEmptyStr;
	};

	type Milestone = {
		milestone_date: ISODate;
		milestone_title: string;
		milestone_description: string;
		milestone_media: string;
	};

	type Program = {
		program_title: string;
		program_id: string;
		program_banner: string;
		program_description: string;
		program_milestones: Milestone[];
	};

	type NonKeyAttributes = {
		active_in_countries: string[];
		approved: boolean;
		card_img?: MaybeEmptyStr;
		contributor_verification_required: true;
		endow_designation: EndowDesignation;
		fiscal_sponsored: boolean;
		hide_bg_tip?: boolean;
		hq_country: string;
		image: MaybeEmptyStr;
		kyc_donors_only: boolean;
		logo: MaybeEmptyStr;
		name: string;
		overview: MaybeEmptyStr;
		program: Program[];
		published: boolean;
		referral_id: MaybeEmptyStr;
		sdgs: UNSDG_NUMS[];
		social_media_urls: SocialMediaURLs;
		status?: "approved";
		street_address: MaybeEmptyStr;
		stripe_price_id: string;
		stripe_product_id: string;
		tagline?: MaybeEmptyStr;
		tier: 3; //no other tier atm
		url?: string;
		receiptMsg?: string;
		/** endowment is not claimed if `false` only */
		claimed?: boolean;
	};

	// Unused & Depreciated Attributes: kept here as optional fields
	// only because older records contain the field. Do not use!!
	type DepreciatedAttributes = {
		admin_users?: string[];
		bank_statement_file?: FileObject;
		bank_verification_status?: BankVerificationStatus;
		charity_navigator_rating?: "";
		contact_email?: string;
		cash_eligible?: boolean;
		on_hand_liq?: number;
		on_hand_lock?: number;
		on_hand_overall?: number;
		owner?: string;
		proposal_link?: number;
		total_liq?: number;
		total_lock?: number;
		wise_recipient_id?: number;
	};

	type DBRecord = MainKeys &
		Chain_ID_IndexKeys &
		ChainIndexKeys &
		Chain_Name_IndexKeys &
		Chain_Overall_IndexKeys &
		EndowType_Chain_IndexKeys &
		RegistrationUUIDindexKeys &
		RegNumEnvIndexKeys &
		SlugIndexKeys &
		NonKeyAttributes &
		DepreciatedAttributes;

	/** only used to verify if EIN is already claimed */
	type RegNumEnvIndexRecord = RegNumEnvIndexKeys &
		MainKeys &
		Pick<NonKeyAttributes, "claimed" | "name" | "hq_country">;

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
		| "kyc_donors_only"
		| "logo"
		| "name"
		| "overview"
		| "program"
		| "published"
		| "registration_number"
		| "sdgs"
		| "social_media_urls"
		| "street_address"
		| "tagline"
		| "url"
		| "claimed"
	>;

	type ItemQueryParams = {
		fields?: string; //csv string
		slug?: string;
		env: Environment;
	};

	type RegNumEnvItemParams = {
		env: Environment;
		ein?: string;
	};

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
}

declare namespace Algolia {
	export type EndowObjectID = `${Environment}-${number}`;
	export type EndowRecord = { objectID: EndowObjectID } & Required<
		Pick<
			V2Endowment.DBRecord,
			| "active_in_countries"
			| "card_img"
			| "chain"
			| "contributor_verification_required"
			| "endow_designation"
			| "endow_type"
			| "id"
			| "hq_country"
			| "image"
			| "kyc_donors_only"
			| "logo"
			| "name"
			| "name_internal"
			| "overview"
			| "program"
			| "published"
			| "sdgs"
			| "tagline"
			| "tier"
			| "slug"
			| "claimed"
		>
	>;
}
