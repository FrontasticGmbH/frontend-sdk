/**
 * An error thrown when the internal fetcher fails.
 */
export class FetchError extends Error {
	/**
	 * Covers any additional properties that may be added to an error.
	 */
	[key: string]: any;
	/**
	 * The message associated with the error.
	 */
	message!: string;

	/**
	 * Constructor.
	 *
	 * @param {string | Error} options.error - The error message or object detected.
	 */
	constructor(options: { error: string | Error }) {
		super();

		const error = options.error;
		if (typeof error === "string") {
			this.message = error;
		} else {
			Object.getOwnPropertyNames(error).forEach((key) => {
				this[key] = error[key as keyof typeof error];
			});
		}
	}
}
