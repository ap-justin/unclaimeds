import { algoliaIndexFormat, dynamoDBFormat, writer } from "./helpers";
import { parseEndow } from "./schema";
import {
  algoliaStream,
  dynamoDBStream,
  env,
  errorStream,
  inputStream,
  rl,
  startingId,
} from "./setup";
import type { EndowData } from "./types";

let numLines = 0;
let numSuccess = 0;
let numError = 0;
let id = startingId;

rl.on("line", (line) => {
  console.log(numLines++);
  if (line.length === 0) return;

  const texts = line.split("|");

  const constructedEndow: Partial<EndowData> = {
    ein: texts[1],
    name: texts[2],
    city: texts[3],
    state: texts[4],
    env,
  };

  const { error, value: endow } = parseEndow(constructedEndow);

  if (error) {
    console.log(error.details[0]?.message);
    numError++;
    return errorStream.write(`${texts.concat([error.message]).join("|")}\n`);
  }

  const dbWriter = writer(endow, dynamoDBFormat);
  const algoliaWriter = writer(endow, algoliaIndexFormat);

  const endowId = ++id;
  dynamoDBStream.write(dbWriter(endowId));
  algoliaStream.write(algoliaWriter(endowId));

  numSuccess++;
});

inputStream.on("open", () => {
  dynamoDBStream.write("[");
  algoliaStream.write("[");
});

inputStream.on("end", () => {
  console.log({ numLines, numSuccess, numError });
  dynamoDBStream.end("]");
  algoliaStream.end("]");
  errorStream.end();
});
inputStream.on("error", (error) => {
  console.log(error);
  dynamoDBStream.end();
  algoliaStream.end();
  errorStream.end();
});
