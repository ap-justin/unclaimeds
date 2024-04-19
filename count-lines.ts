import * as fs from "node:fs";
import * as readline from "node:readline";

const fileStream = fs.createReadStream("./data-download-epostcard.txt");
const lineCount = new Promise((resolve, reject) => {
  let count = 0;
  const lineReader = readline.createInterface({
    input: fileStream,
    crlfDelay: Number.POSITIVE_INFINITY,
  });

  lineReader.on("line", () => {
    count++;
  });

  lineReader.on("close", () => {
    resolve(count);
  });

  lineReader.on("error", (err) => {
    reject(err);
  });
});

lineCount
  .then((count) => {
    console.log(`Number of lines: ${count}`);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
