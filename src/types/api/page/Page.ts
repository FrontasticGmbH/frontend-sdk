import { Section } from "@frontastic/extension-types";

export interface Page {
	pageId: string;
	sections: {
		footer?: Section;
		head?: Section;
		main?: Section;
	};
	state: "default" | "published" | "draft" | "scheduled";
}
