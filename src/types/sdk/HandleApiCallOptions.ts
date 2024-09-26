import { AcceptedPayloadTypes } from "../Payload";
import { AcceptedQueryTypes } from "../Query";

type HandleApiCallOptions = (
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
	tracing: {
		frontendRequestId: string;
	};
};

export { HandleApiCallOptions };
