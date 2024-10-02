import { PageFolder } from "@frontastic/extension-types";

interface PageFolderListResponse {
	pageFolderStructure: Omit<PageFolder, "isDynamic">[];
}

export { PageFolderListResponse };
