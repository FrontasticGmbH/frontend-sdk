import { ActionError } from "../../library/ActionError";
import { PageError } from "../../library/PageError";
import { AcceptedPayloadTypes } from "../Payload";
import { AcceptedQueryTypes } from "../Query";

type HandleErrorCaughtOptions = (
	| {
			type: "pageAPI";
			method: "getPage" | "getPreview" | "getPages";
			error: PageError;
	  }
	| { type: "action"; actionName: string; error: ActionError }
) & {
	parameters: {
		query?: AcceptedQueryTypes;
		body?: AcceptedPayloadTypes;
	};
	url: string;
	tracing: {
		frontendRequestId: string;
		frontasticRequestId?: string;
	};
};

export { HandleErrorCaughtOptions };
