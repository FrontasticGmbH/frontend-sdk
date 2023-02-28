import { AcceptedQueryTypes } from "../types/Query";

export const generateQueryString = function(query: AcceptedQueryTypes): string {
	const params = new URLSearchParams();
	Object.keys(query).forEach(key => {
		if (query[key] !== undefined) {
			params.set(key, query[key].toString());
		}
	});
	return `?${params.toString()}`;
}
