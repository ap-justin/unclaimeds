const search = new URLSearchParams({
	asker: "justin@better.giving",
	endDate: "2024-4-4",
	startDate: "2024-4-4",
}).toString();

const result = await fetch(
	`https://kpnxz5rzo2.execute-api.us-east-1.amazonaws.com/staging/donations${
		search ? `?${search}` : ""
	}`,
).then((res) => res.json());

console.log(result);
