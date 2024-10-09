/**
 * The type describing the general structure of generic event parameters.
 */
export interface Events {
	[key: string]: {
		[key: string]: unknown;
	};
}
