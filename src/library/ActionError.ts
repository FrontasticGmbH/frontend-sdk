import { FetchError } from "./FetchError";

export class ActionError extends FetchError {
	constructor(actionName: string, error: FetchError) {
		super(error);

		this.actionName = actionName;
	}

	actionName: string;
}
