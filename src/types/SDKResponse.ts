import { FetchError } from "../library/FetchError";

export type SDKResponse<T> =
	| {
			data: T;
			isError: false;
	  }
	| {
			isError: true;
			error: FetchError;
	  };
