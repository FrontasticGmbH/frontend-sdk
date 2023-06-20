import { FetchError } from "../library/FetchError";

/**
 * A wrapper for returns from API requests. On error returns an error, otherwise requested data.
 *
 * @param {T} T - The type of data expected to be returned from a successful API call.
 */
export type SDKResponse<T> =
	| {
			/**
			 * The data returned from the API call. The type is set in the generic argument in the {@link SDKResponse}.
			 */
			data: T;
			/**
			 * A boolean set to false to indicate the API call was successful.
			 */
			isError: false;
	  }
	| {
			/**
			 * A boolean set to true to indicate an error occurred during the API call.
			 */
			isError: true;
			/**
			 * The error which occurred during the API call.
			 */
			error: FetchError;
	  };
