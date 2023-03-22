import { PageFolder } from "@frontastic/extension-types";

type PageFolderListResponse = {
	pageFolderStructure: Omit<PageFolder, "isDynamic">[];
};

export { PageFolderListResponse };
