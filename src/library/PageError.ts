import { FetchError } from "./FetchError";

export class PageError extends FetchError {
    constructor(path: string, error: FetchError) {
        super(error);

        this.path = path;
    }

    path: string;
}
