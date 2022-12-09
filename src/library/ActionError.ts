import { FetchError } from "./FetchError";

export class ActionError extends FetchError {
    constructor(type: string, error: FetchError) {
        super(error);

        this.type = type;
    }

    type: string;
}
