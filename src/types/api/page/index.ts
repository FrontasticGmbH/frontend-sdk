import { ServerOptions } from "../../../cookieHandling/types";
import { SDKResponse } from "../../../library/types";
import { AcceptedQueryTypes } from "../../Query";
import { PageFolderListResponse } from "./PageFolderListResponse";
import { PagePreviewResponse } from "./PagePreviewResponse";
import { PageResponse } from "./PageResponse";
import { PageViewData } from "./PageViewData";

type PageApi = {
	getPage: (options: {
		path: string;
		query?: AcceptedQueryTypes;
		serverOptions?: ServerOptions;
	}) => Promise<SDKResponse<PageResponse>>;
	getPreview: (options: {
		previewId: string;
		serverOptions?: ServerOptions;
	}) => Promise<SDKResponse<PagePreviewResponse>>;
	getPages: (options?: {
		path?: string;
		depth?: number;
		types?: "static";
		serverOptions?: ServerOptions;
	}) => Promise<SDKResponse<PageFolderListResponse>>;
};

export {
	PageApi,
	PageResponse,
	PagePreviewResponse,
	PageViewData,
	PageFolderListResponse,
};
