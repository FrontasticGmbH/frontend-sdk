import { FetchError } from "./FetchError";

/**
 * An error created when a method in the page API fails, extends the {@link FetchError}.
 */
export class PageError extends FetchError {
	/**
	 * The path requested during the failed page API call.
	 */
	path: string;

	/**
	 * Constructor.
	 *
	 * @param {string} path - The path requested during the failed page API call.
	 * @param {FetchError} error - The error returned from the internal fetcher.
	 */
	constructor(path: string, error: FetchError) {
		super(error);

		this.path = path;
	}
}
