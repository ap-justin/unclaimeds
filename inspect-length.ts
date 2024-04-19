import * as fs from "node:fs";

const contents = fs.readFileSync("data-download-epostcard.txt", "utf-8");
const lines = contents.split("\n");

const numElements: { [index: number]: number } = {};

console.log("looping..");
for (const line of lines) {
  const elements = line.split("|");
  numElements[elements.length] ||= 0;
  numElements[elements.length]++;

  if (elements.length === 27 || elements.length === 1) console.log(line);
}

console.log(numElements);
