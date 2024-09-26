import { ActionError } from "../../library/ActionError";
import { PageError } from "../../library/PageError";
import { AcceptedPayloadTypes } from "../Payload";
import { AcceptedQueryTypes } from "../Query";

/**
 * The types of standard events and commerce events the base SDK ships with.
 */
export interface BaseEvents {
	actionCalled: {
		/**
		 * The name of the action called.
		 */
		actionName: string;
		/**
		 * The query and body parameters passed to the fetcher.
		 */
		parameters: {
			/**
			 * The query parameter passed to the fetcher.
			 */
			query?: AcceptedQueryTypes;
			/**
			 * The body parameter passed to the fetcher.
			 */
			body?: AcceptedPayloadTypes;
		};
		/**
		 * The url that was fetched.
		 */
		url: string;
		/**
		 * An object containing tracing data for logging.
		 */
		tracing: {
			/**
			 * An ID attached to the request on the frontend, to match to the "actionErrorCaught" or "actionFetchSuccessful" event.
			 */
			frontendRequestId: string;
		};
	};
	pageApiMethodCalled: {
		/**
		 * The page API method called.
		 */
		method: "getPage" | "getPreview" | "getPages";
		/**
		 * The query and body parameters passed to the fetcher.
		 */
		parameters: {
			/**
			 * The query parameter passed to the fetcher.
			 */
			query?: AcceptedQueryTypes;
			/**
			 * The body parameter passed to the fetcher.
			 */
			body?: AcceptedPayloadTypes;
		};
		/**
		 * The url that was fetched.
		 */
		url: string;
		/**
		 * An object containing tracing data for logging.
		 */
		tracing: {
			/**
			 * An ID attached to the request on the frontend, to match to the "pageApiErrorCaught" or "pageApiFetchSuccessful" event.
			 */
			frontendRequestId: string;
		};
	};
	fetchCalled: (
		| {
				type: "pageAPI";
				/**
				 * The page API method called.
				 */
				method: "getPage" | "getPreview" | "getPages";
		  }
		| {
				type: "action";
				/**
				 * The name of the action called.
				 */
				actionName: string;
		  }
	) & {
		/**
		 * The query and body parameters passed to the fetcher.
		 */
		parameters: {
			/**
			 * The query parameter passed to the fetcher.
			 */
			query?: AcceptedQueryTypes;
			/**
			 * The body parameter passed to the fetcher.
			 */
			body?: AcceptedPayloadTypes;
		};
		/**
		 * The url that was fetched.
		 */
		url: string;
		/**
		 * An object containing tracing data for logging.
		 */
		tracing: {
			/**
			 * An ID attached to the request on the frontend, to match to the "errorCaught" or "fetchSuccessful" event, and corresponding page API or action specific events.
			 */
			frontendRequestId: string;
		};
	};
	actionErrorCaught: {
		/**
		 * The name of the action called.
		 */
		actionName: string;
		/**
		 * The query and body parameters passed to the fetcher.
		 */
		parameters: {
			/**
			 * The query parameter passed to the fetcher.
			 */
			query?: AcceptedQueryTypes;
			/**
			 * The body parameter passed to the fetcher.
			 */
			body?: AcceptedPayloadTypes;
		};
		/**
		 * The url that was fetched.
		 */
		url: string;
		/**
		 * An object containing tracing data for logging.
		 */
		tracing: {
			/**
			 * An ID attached to the request on the frontend, to match to the "actionCalled" event.
			 */
			frontendRequestId: string;
			/**
			 * An ID attached to the request in the API hub, shared with backend API calls. Absence of this property likely means the API hub and therefore extensions were unreachable.
			 */
			frontasticRequestId?: string;
		};
		/**
		 * The ActionError caught while attepting to call an action.
		 */
		error: ActionError;
	};
	pageApiErrorCaught: {
		/**
		 * The page API method called.
		 */
		method: "getPage" | "getPreview" | "getPages";
		/**
		 * The query and body parameters passed to the fetcher.
		 */
		parameters: {
			/**
			 * The query parameter passed to the fetcher.
			 */
			query?: AcceptedQueryTypes;
			/**
			 * The body parameter passed to the fetcher.
			 */
			body?: AcceptedPayloadTypes;
		};
		/**
		 * The url that was fetched.
		 */
		url: string;
		/**
		 * An object containing tracing data for logging.
		 */
		tracing: {
			/**
			 * An ID attached to the request on the frontend, to match to the "pageApiMethodCalled" event.
			 */
			frontendRequestId: string;
			/**
			 * An ID attached to the request in the API hub, shared with backend API calls. Absence of this property likely means the API hub and therefore extensions were unreachable.
			 */
			frontasticRequestId?: string;
		};
		/**
		 * The PageError caught while attepting to call a page API method.
		 */
		error: PageError;
	};
	errorCaught: (
		| {
				type: "pageAPI";
				/**
				 * The page API method called.
				 */
				method: "getPage" | "getPreview" | "getPages";
		  }
		| {
				type: "action";
				/**
				 * The name of the action called.
				 */
				actionName: string;
		  }
	) & {
		/**
		 * The query and body parameters passed to the fetcher.
		 */
		parameters: {
			/**
			 * The query parameter passed to the fetcher.
			 */
			query?: AcceptedQueryTypes;
			/**
			 * The body parameter passed to the fetcher.
			 */
			body?: AcceptedPayloadTypes;
		};
		/**
		 * The url that was fetched.
		 */
		url: string;
		/**
		 * An object containing tracing data for logging.
		 */
		tracing: {
			/**
			 * An ID attached to the request on the frontend, to match to the "fetchCalled" event.
			 */
			frontendRequestId: string;
			/**
			 * An ID attached to the request in the API hub, shared with backend API calls. Absence of this property likely means the API hub and therefore extensions were unreachable.
			 */
			frontasticRequestId?: string;
		};
		/**
		 * The PageError or ActionError caught while attepting to call a page API method or action.
		 */
		error: PageError | ActionError;
	};
	actionFetchSuccessful: {
		/**
		 * The name of the action called.
		 */
		actionName: string;
		/**
		 * The query and body parameters passed to the fetcher.
		 */
		parameters: {
			/**
			 * The query parameter passed to the fetcher.
			 */
			query?: AcceptedQueryTypes;
			/**
			 * The body parameter passed to the fetcher.
			 */
			body?: AcceptedPayloadTypes;
		};
		/**
		 * The url that was fetched.
		 */
		url: string;
		/**
		 * The data returned from the successful call, may be quite large.
		 */
		dataResponse: unknown;
		/**
		 * An object containing tracing data for logging.
		 */
		tracing: {
			/**
			 * An ID attached to the request on the frontend, to match to the "actionCalled" event.
			 */
			frontendRequestId: string;
			/**
			 * An ID attached to the request in the API hub, shared with backend API calls.
			 */
			frontasticRequestId: string;
		};
	};
	pageApiFetchSuccessful: {
		/**
		 * The page API method called.
		 */
		method: "getPage" | "getPreview" | "getPages";
		/**
		 * The query and body parameters passed to the fetcher.
		 */
		parameters: {
			/**
			 * The query parameter passed to the fetcher.
			 */
			query?: AcceptedQueryTypes;
			/**
			 * The body parameter passed to the fetcher.
			 */
			body?: AcceptedPayloadTypes;
		};
		/**
		 * The url that was fetched.
		 */
		url: string;
		/**
		 * The data returned from the successful call, may be quite large.
		 */
		dataResponse: unknown;
		/**
		 * An object containing tracing data for logging.
		 */
		tracing: {
			/**
			 * An ID attached to the request on the frontend, to match to the "pageApiMethodCalled" event.
			 */
			frontendRequestId: string;
			/**
			 * An ID attached to the request in the API hub, shared with backend API calls.
			 */
			frontasticRequestId: string;
		};
	};
	fetchSuccessful: (
		| {
				type: "pageAPI";
				/**
				 * The page API method called.
				 */
				method: "getPage" | "getPreview" | "getPages";
		  }
		| {
				type: "action";
				/**
				 * The name of the action called.
				 */
				actionName: string;
		  }
	) & {
		/**
		 * The query and body parameters passed to the fetcher.
		 */
		parameters: {
			/**
			 * The query parameter passed to the fetcher.
			 */
			query?: AcceptedQueryTypes;
			/**
			 * The body parameter passed to the fetcher.
			 */
			body?: AcceptedPayloadTypes;
		};
		/**
		 * The url that was fetched.
		 */
		url: string;
		/**
		 * The data returned from the successful call, may be quite large.
		 */
		dataResponse: unknown;
		/**
		 * An object containing tracing data for logging.
		 */
		tracing: {
			/**
			 * An ID attached to the request on the frontend, to match to the "fetchCalled" event.
			 */
			frontendRequestId: string;
			/**
			 * An ID attached to the request in the API hub, shared with backend API calls.
			 */
			frontasticRequestId: string;
		};
	};
}
