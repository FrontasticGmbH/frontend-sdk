import { FetchError } from "./FetchError";

/**
 * An error created when a method in the page API fails, extends the {@link FetchError}.
 */
export class PageError extends FetchError {
	/**
	 * Constructor.
	 *
	 * @param {string | Error} options.error - The error returned from the internal fetcher.
	 */
	constructor(options: { error: string | Error }) {
		super(options);
	}
}
