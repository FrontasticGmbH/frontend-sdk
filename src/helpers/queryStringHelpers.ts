type QueryTypes = string | number | boolean;

type QueryInputObject = {
	[key: string]: QueryTypes;
}

export const generateQueryString = function(query: QueryInputObject): string {
	const params = new URLSearchParams();
	Object.keys(query).forEach(key => {
		if (query[key] !== undefined) {
			params.set(key, query[key].toString());
		}
	});
	return `?${params.toString()}`;
}
