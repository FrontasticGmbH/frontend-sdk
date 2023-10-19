import { ServerOptions } from "../../cookieHandling";
import { SDKResponse } from "../../../types/SDKResponse";
import { AcceptedQueryTypes } from "../../Query";
import { PageFolderListResponse } from "./PageFolderListResponse";
import { PagePreviewResponse } from "./PagePreviewResponse";
import { PageResponse } from "./PageResponse";
import { PageViewData } from "./PageViewData";

type PageApi = {
	/**
	 * The method to get page data from the API-hub.
	 *
	 * @param {string} options.path - A string representing the relative path of the page data to be fetched, for example "/sale".
	 * @param {Object.<string, number, boolean, string[], number[], boolean[]>} [options.query] - An optional key, value pair object to be serialised into the url query.
	 * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively.  Required for server-side rendering session management.
	 *
	 * @returns {PromiseLike<PageResponse>} An object with a boolean isError property, and either an error or data property for true and false respectively. Data contains Page, PageFolder and PageView data.
	 */
	getPage: (options: {
		path: string;
		query?: AcceptedQueryTypes;
		serverOptions?: ServerOptions;
	}) => Promise<SDKResponse<PageResponse>>;
	/**
	 * The method to get page preview data from the API-hub.
	 *
	 * @param {string} options.previewId - A string representing the ID of the preview to be fetched, likely to be acquired from a query in the visited URL.
	 * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively.  Required for server-side rendering session management.
	 *
	 * @returns {PromiseLike<PagePreviewResponse>} An object with a boolean isError property, and either an error or data property for true and false respectively. Data contains Page, PageFolder and PageView data.
	 */
	getPreview: (options: {
		previewId: string;
		serverOptions?: ServerOptions;
	}) => Promise<SDKResponse<PagePreviewResponse>>;
	/**
	 * The method to get a flat folder structure of pages from a relative path.
	 *
	 * @param {string} [options.path="/"] - An optional string with a default value of "" for home, representing the relative path of the page to start fetching data, for example "/sale".
	 * @param {number} [options.depth=16] - An optional number with a default value of 16, the depth to dig into page folders to fetch.
	 * @param {string} [options.types="static"] - An optional string with a default value of "static". The types of pages to fetch.
	 * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively.  Required for server-side rendering session management.
	 *
	 * @returns {PromiseLike<PageFolderListResponse>} An object with a boolean isError property, and either an error or data property for true and false respectively. Data is an array of PageFolder data.
	 */
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
