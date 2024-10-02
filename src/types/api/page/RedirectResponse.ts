interface RedirectResponse {
	statusCode: 301;
	reason:
		| "locale mismatch"
		| "redirect exists for path"
		| "dynamic page redirect";
	targetType: "page folder" | "link" | "unknown";
	/**
	 * The target url or path
	 *
	 */
	target: string;
}

export { RedirectResponse };
