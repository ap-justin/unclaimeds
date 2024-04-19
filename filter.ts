const readline = require("node:readline");
const fs = require("node:fs");

const inputFile = "./data-download-epostcard.txt"; // Path to the input file
const outputFile = "./filtered-data-download-epostcard.txt"; // Path to the output file

// Create a readable stream for the input file
const inputStream = fs.createReadStream(inputFile);

// Create a writeable stream for the output file
const outputStream = fs.createWriteStream(outputFile);

// Create a readline interface for reading the input file line by line
const rl = readline.createInterface({
	input: inputStream,
	crlfDelay: Number.POSITIVE_INFINITY,
});

// Read each line from the input file and write it to the output file
let prev_ein = "";
rl.on("line", (line: string) => {
	const elements = line.split("|");
	const ein = elements[0];
	const terminated = elements[4] as "T" | "F";
	const orgName = elements[2];

	if (elements.length <= 1) return;
	if (terminated) {
		console.log("terminated:", ein, orgName);
		return;
	}
	prev_ein = elements[0];
	outputStream.write(`${line}\n`);
});

// Handle any errors
rl.on("error", (err: unknown) => {
	console.error("Error reading file:", err);
});

// Close the output stream when the input stream is finished
inputStream.on("end", () => {
	outputStream.end();
	console.log("File copied successfully.");
});
