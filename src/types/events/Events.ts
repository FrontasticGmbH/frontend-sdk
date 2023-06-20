/**
 * The type describing the general structure of generic events parameters.
 */
export type Events = {
	[key: string]: {
		[key: string]: unknown;
	};
};
