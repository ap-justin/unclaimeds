import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import zlib from "node:zlib";
import type { Environment } from "./types";
const inputFilePath = path.join(__dirname, "pub78.txt"); //NOTE: update lastItem EIN
const dynamoDbFilePath = path.join(__dirname, "dynamodbjson.txt.gz");
const algoliaIndexFilePath = path.join(__dirname, "algolia.json");
const errorFilePath = path.join(__dirname, "errors.txt");
/** used to determine if put trailing comma */
export const lastItemEIN = "999999062";
export const env: Environment = "production";
export const startingId = 200; //make sure to query endowments_v2 per stage

export const inputStream = fs.createReadStream(inputFilePath, {
  encoding: "utf8",
});

export const dynamoDBStream = zlib.createGzip();
const dynamoDBGzipStream = fs.createWriteStream(dynamoDbFilePath, {
  encoding: "utf-8",
});
dynamoDBStream.pipe(dynamoDBGzipStream);

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
