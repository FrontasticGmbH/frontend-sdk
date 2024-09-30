import { Page, PageFolder } from "@frontastic/extension-types";
import { PageViewData } from "./PageViewData";

//TODO: update @frontastic/extension-types to include PageResponse
type PageResponse = {
	page: Page;
	pageFolder: PageFolder;
	data: PageViewData;
};

export { PageResponse };
