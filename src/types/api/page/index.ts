import { SDKResponse } from "../../../library/types";
import { PagePreviewResponse } from "./PagePreviewResponse";
import { PageResponse } from "./PageResponse";
import { PageViewData } from "./PageViewData";

type PageApi = {
	getPage: (options: { path: string }) => Promise<SDKResponse<PageResponse>>;
	getPreview: (options: {
		previewId: string;
	}) => Promise<SDKResponse<PagePreviewResponse>>;
};

export { PageApi, PageResponse, PagePreviewResponse, PageViewData };
