import { AcceptedPayloadTypes } from "../Payload";
import { AcceptedQueryTypes } from "../Query";

type HandleSuccessfulFetchOptions = (
	| {
			type: "pageAPI";
			method: "getPage" | "getPreview" | "getPages";
	  }
	| {
			type: "action";
			actionName: string;
	  }
) & {
	parameters: {
		query?: AcceptedQueryTypes;
		body?: AcceptedPayloadTypes;
	};
	url: string;
	dataResponse: unknown;
	tracing: {
		frontendRequestId: string;
		frontasticRequestId: string;
	};
};

export { HandleSuccessfulFetchOptions };
