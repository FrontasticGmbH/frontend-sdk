interface RedactionManager {
	/**
	 * Recursively dives into an object, redacting specified properties.
	 */
	redact<T>(data: T): T extends number | boolean ? string | T : T;
	/**
	 * Redacts specified properties from the url query.
	 */
	redactUrl(url: string): string;
}

export { RedactionManager };
