import { SDKResponse } from "../../../library/types";
import { PageResponse } from "./PageResponse";
import { PageViewData } from "./PageViewData";

type PageApi = {
	getPage: (options: {
		path: string
	}) => Promise<SDKResponse<PageResponse>>
}

export {
	PageApi,
	PageResponse,
	PageViewData
}
