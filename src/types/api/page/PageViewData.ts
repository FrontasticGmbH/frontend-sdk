interface PageViewData {
	dataSources: {
		[id: string]: {
			total: number;
			items: unknown[];
			count: number;
			facets: unknown[];
			query: unknown;
		};
	};
}

export { PageViewData };
