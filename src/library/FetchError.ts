/**
 * An error created when the internal fetcher fails.
 */
export class FetchError extends Error {
	[key: string]: any;
	/**
	 * The message associated with the error.
	 */
	message!: string;

	/**
	 * Constructor.
	 *
	 * @param {string | Error} error - The error message or object detected.
	 */
	constructor(error: string | Error) {
		super();

		if (typeof error === "string") {
			this.message = error;
		} else {
			Object.keys(error).forEach((key) => {
				this[key] = error[key as keyof typeof error];
			});
		}
	}
}
