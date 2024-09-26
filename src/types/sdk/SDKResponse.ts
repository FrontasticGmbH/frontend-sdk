import { FetchError } from "../../library/FetchError";

/**
 * A wrapper for API request returns. On error returns an error, otherwise requested data.
 *
 * @param {T} T - The type of data expected to be returned from a successful API call.
 */
export type SDKResponse<T> =
	| {
			/**
			 * A boolean set to false to indicate the API call was successful.
			 */
			isError: false;
			/**
			 * An object with properties to help identify requests in logging.
			 */
			tracing: {
				/**
				 * An ID attached to the request on the frontend, to match with fetch called and successful fetch events.
				 */
				frontendRequestId: string;
				/**
				 * The request ID used to identify requests in logs and for distributed tracing.
				 */
				frontasticRequestId?: string;
			};
			/**
			 * The data returned from the API call. The type is set in the generic argument in the {@link SDKResponse}.
			 */
			data: T;
	  }
	| {
			/**
			 * A boolean set to true to indicate an error occurred during the API call.
			 */
			isError: true;
			/**
			 * An object with properties to help identify requests in logging.
			 */
			tracing: {
				/**
				 * An ID attached to the request on the frontend, to match with fetch called and error caught events.
				 */
				frontendRequestId: string;
				/**
				 * The request ID used to identify requests in logs and for distributed tracing. Only provided when the request reaches the extension runner.
				 */
				frontasticRequestId?: string;
			};
			/**
			 * The error which occurred during the API call.
			 */
			error: FetchError;
	  };
