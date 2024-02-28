/**
 * An error thrown when the internal fetcher fails.
 */
export class FetchError extends Error {
	/**
	 * The message associated with the error.
	 */
	message: string;

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
			this.cause = error.cause;
			this.message = error.message;
			this.name = error.name;
			this.stack = error.stack;
		}
	}
}
