import { AcceptedQueryTypes } from "../types/Query";

const normaliseUrl = function (url: string): string {
	let protocolSplit = url.split("//");
	let normalisedUrl = "";
	if (
		protocolSplit[0] &&
		(protocolSplit[0] === "http:" ||
			protocolSplit[0] === "https:" ||
			protocolSplit[0] === "ws:" ||
			protocolSplit[0] === "wss:")
	) {
		normalisedUrl = `${protocolSplit[0]}//`;
		protocolSplit.splice(0, 1);
	}

	let query = "";
	let querySplit = protocolSplit.join("//").split("?");
	if (querySplit.length > 1) {
		query = `?${querySplit.slice(1, querySplit.length).join("?")}`;
	}
	const pathSplit = querySplit[0].split("/");

	for (let n = 0; n < pathSplit.length; n++) {
		if (pathSplit[n]) {
			normalisedUrl += `${pathSplit[n]}/`;
		}
	}

	normalisedUrl = normalisedUrl.substring(0, normalisedUrl.length - 1);
	return normalisedUrl + query;
};

const generateQueryString = function (query: AcceptedQueryTypes): string {
	let queryString = "";
	let arrayParams: string[] = [];
	const params = new URLSearchParams();

	Object.keys(query).forEach((key) => {
		let value = query[key];
		if (value !== undefined) {
			if (Array.isArray(value)) {
				arrayParams.push(key);
				value.forEach((currentValue) => {
					params.append(key, currentValue.toString());
				});
			} else {
				params.set(key, query[key].toString());
			}
		}
	});

	queryString = params.toString();

	arrayParams.forEach((arrayParam) => {
		queryString = queryString.replaceAll(
			`${arrayParam}=`,
			`${arrayParam}[]=`
		);
	});

	return queryString ? `?${queryString}` : "";
};

export { normaliseUrl, generateQueryString };
