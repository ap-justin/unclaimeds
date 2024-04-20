import * as fs from "node:fs";
import * as readline from "node:readline";
import Joi, { type StrictSchemaMap, type ValidationResult } from "joi";

// DEFINE MODEL ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
type EndowData = {
  name: string;
  ein: string;
  city: string | undefined;
  state: string | undefined;
};

const endowDataShape: StrictSchemaMap<EndowData> = {
  name: Joi.string().min(3),
  ein: Joi.string()
    .required()
    .length(9)
    .pattern(/^[0-9]+$/),
  city: Joi.string().min(2),
  state: Joi.string().uppercase().min(2),
};

const schema = Joi.object(endowDataShape);

// SETUP ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const inputFilePath = "./test-processed.txt";
const outputFilePath = "./pub78-processed.json";
const errorFilePath = "./pub78-errors.txt";
/** used to determine if put trailing comma */
const lastItemEIN = "000852649";
/** starting id */
let id = 104;

// SETUP ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const inputStream = fs.createReadStream(inputFilePath, { encoding: "utf8" });
const outputStream = fs.createWriteStream(outputFilePath, { encoding: "utf8" });
const errorStream = fs.createWriteStream(errorFilePath, { encoding: "utf8" });

const rl = readline.createInterface({
  input: inputStream,
  crlfDelay: Number.POSITIVE_INFINITY,
});

let numLines = 0;
let numSuccess = 0;
let numError = 0;

rl.on("line", (line) => {
  numLines++;

  if (line.length === 0) return;

  const texts = line.split("|");

  const data: Partial<EndowData> = {
    ein: texts[1],
    name: texts[2],
    city: texts[3],
    state: texts[4],
  };

  const { error, value }: ValidationResult<EndowData> = schema.validate(data);

  if (error) {
    numError++;
    return errorStream.write(`${texts.concat([error.message]).join("|")}\n`);
  }

  const trailingComma = value.ein !== lastItemEIN ? "," : "";
  const str = `${JSON.stringify(toDBFormat(id++, value))}${trailingComma}`;
  outputStream.write(str);
  numSuccess++;
});

inputStream.on("open", () => {
  outputStream.write("[");
});
inputStream.on("end", () => {
  console.log({ numLines, numSuccess, numError });
  outputStream.write("]");
  outputStream.end();
  errorStream.end();
});
inputStream.on("error", (error) => {
  console.log(error);
  outputStream.write("]");
  outputStream.end();
  errorStream.end();
});

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

function toDBFormat(
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
      L: [],
    },
    claimed: {
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
