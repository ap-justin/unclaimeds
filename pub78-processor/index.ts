import fs from "node:fs";
import readline from "node:readline";
import { parseEndow } from "./schema";
import { toJsonItem } from "./toJSONItem";
import type { EndowData } from "./types";

const inputFilePath = "./test-processed.txt";
const dynamoDbFilePath = "./pub78-dynamodb.json";
const algoliaIndexFilePath = "./pub78-algolia.json";
const errorFilePath = "./pub78-errors.txt";
/** used to determine if put trailing comma */
const lastItemEIN = "000852649";
/** starting id */
let id = 104;

// SETUP ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const inputStream = fs.createReadStream(inputFilePath, { encoding: "utf8" });
const dynamoDBStream = fs.createWriteStream(dynamoDbFilePath, {
  encoding: "utf8",
});
const algoliaStream = fs.createWriteStream(algoliaIndexFilePath, {
  encoding: "utf-8",
});
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

  const constructedEndow: Partial<EndowData> = {
    ein: texts[1],
    name: texts[2],
    city: texts[3],
    state: texts[4],
  };

  const { error, value: endow } = parseEndow(constructedEndow);

  if (error) {
    numError++;
    return errorStream.write(`${texts.concat([error.message]).join("|")}\n`);
  }

  const currId = id++;
  dynamoDBStream.write(toJsonItem(lastItemEIN)(endow, currId));

  numSuccess++;
});

inputStream.on("open", () => {
  dynamoDBStream.write("[");
  algoliaStream.write("[");
});
inputStream.on("end", () => {
  console.log({ numLines, numSuccess, numError });
  dynamoDBStream.write("]");
  algoliaStream.write("]");
  errorStream.end();
});
inputStream.on("error", (error) => {
  console.log(error);
  dynamoDBStream.write("]");
  algoliaStream.end();
});
