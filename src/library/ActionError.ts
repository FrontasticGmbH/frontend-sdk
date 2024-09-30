import { FetchError } from "./FetchError";

/**
 * An error created when the action API fails, extends the {@link FetchError}.
 */
export class ActionError extends FetchError {
	/**
	 * The name of the failed action.
	 */
	actionName: string;

	/**
	 * Constructor.
	 *
	 * @param {string} actionName - The name of the failed action.
	 * @param {FetchError} error - The error returned from the internal fetcher.
	 */
	constructor(actionName: string, error: FetchError) {
		super(error);

		this.actionName = actionName;
	}
}
