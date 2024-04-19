const res = await fetch(
	"https://apps.irs.gov/prod-east/teos/details/ePostSearch/020504745",
).then((res) => res.json());

console.log(res);
