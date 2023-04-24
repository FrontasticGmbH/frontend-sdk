import { OptionsType } from "../../../cookieHandling/types";
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
		optionsType?: OptionsType;
	}) => Promise<SDKResponse<PageResponse>>;
	getPreview: (options: {
		previewId: string;
	}) => Promise<SDKResponse<PagePreviewResponse>>;
	getPages: (options?: {
		path?: string;
		depth?: number;
		types?: "static";
	}) => Promise<SDKResponse<PageFolderListResponse>>;
};

export {
	PageApi,
	PageResponse,
	PagePreviewResponse,
	PageViewData,
	PageFolderListResponse,
};
