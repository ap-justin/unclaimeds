import * as fs from "node:fs";

const inputFilePath = "data-download-epostcard.txt"; // Path to the input pipe-delimited text file
const outputFilePath = "grouped-by-name.txt"; // Path to the output JSON file

fs.readFile(inputFilePath, "utf8", (err, data) => {
	if (err) {
		console.error("Error reading file:", err);
		return;
	}

	const lines = data.trim().split("\n"); // Split the file into lines

	const obj: { [key: string]: Organization[] } = {};
	for (const line of lines) {
		const fields = line.split("|");

		const taxEnd = fields[6];

		if (new Date(taxEnd) < new Date("2023")) continue;

		if (fields[4] === "T") continue;

		const org: Organization = {
			name: fields[2],
			ein: fields[0],
			taxEnd: fields[6],
			website: fields.length > 26 ? undefined : fields[7],
			officer: fields.length > 26 ? fields[9] : fields[8],
		};

		if (/^-?\d+$/.test(org.name)) continue;

		obj[org.name] ||= [];
		obj[org.name].push(org);
	}

	const organizations: Organization[] = [];
	for (const [name, org] of Object.entries(obj)) {
		const sortedFilings = org.sort((a, b) => {
			const dateA = new Date(a.taxEnd);
			const dateB = new Date(b.taxEnd);

			if (dateA > dateB) {
				return -1;
			}

			if (dateA < dateB) {
				return 1;
			}

			return 0;
		});

		const latestFiling = sortedFilings[0];
		organizations.push(latestFiling);
	}

	let csv = "";
	for (const org of organizations) {
		//biome-ignore lint:
		csv += Object.values(org).join(",") + "\n";
	}

	fs.writeFile(outputFilePath, csv, (err) => {
		if (err) {
			console.error("Error writing file:", err);
			return;
		}

		console.log("JSON file created successfully!");
	});
});

type Organization = {
	name: string;
	ein: string;
	/** ISODate */
	taxEnd: string;
	officer?: string;
	website?: string;
};
