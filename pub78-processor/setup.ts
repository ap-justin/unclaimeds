import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import type { Environment } from "./types";
const inputFilePath = path.join(__dirname, "pub78-test.txt");
const dynamoDbFilePath = path.join(__dirname, "dynamodb.json");
const algoliaIndexFilePath = path.join(__dirname, "algolia.json");
const errorFilePath = path.join(__dirname, "errors.txt");
/** used to determine if put trailing comma */
export const lastItemEIN = "002067446";
export const env: Environment = "staging";
export const startindId = 104;

// SETUP ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const inputStream = fs.createReadStream(inputFilePath, {
  encoding: "utf8",
});
export const dynamoDBStream = fs.createWriteStream(dynamoDbFilePath, {
  encoding: "utf8",
});
export const algoliaStream = fs.createWriteStream(algoliaIndexFilePath, {
  encoding: "utf-8",
});
export const errorStream = fs.createWriteStream(errorFilePath, {
  encoding: "utf8",
});

export const rl = readline.createInterface({
  input: inputStream,
  crlfDelay: Number.POSITIVE_INFINITY,
});
