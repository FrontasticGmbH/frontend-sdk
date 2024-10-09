import { FetchError } from "./FetchError";

/**
 * An error created when the action API fails, extends the {@link FetchError}.
 */
export class ActionError extends FetchError {
	/**
	 * Constructor.
	 *
	 * @param {string | Error} options.error - The error returned from the internal fetcher.
	 */
	constructor(options: { error: string | Error }) {
		super(options);
	}
}
