interface RedactionRule {
	/**
	 * A string representing the value of the rule to apply.
	 */
	value: string;
	/**
	 * An optional boolean dictating whether to apply the rule value as case sensitive, default false.
	 */
	caseSensitive?: boolean;
}

export { RedactionRule };
