import { SDK } from "./SDK";
import { Events } from "./types";

/**
 * The abstract base class signature to extend SDK integration classes.
 *
 * @param {Extension<CustomEvents>} CustomEvents - blah blah blah.
 */
abstract class Extension<CustomEvents extends Events> {
	/**
	 * The sdk instance passed and assigned in the constructor.
	 */
	protected sdk: SDK<CustomEvents>;

	/**
	 * Contructor.
	 *
	 * @param {SDK} sdk - The singleton sdk instance created within your project.
	 */
	constructor(sdk: SDK<CustomEvents>) {
		this.sdk = sdk;
	}

	/**
	 * The unregister method signature to implement to remove eventHandlers for short lived integrations.
	 *
	 * @returns {void} Void.
	 */
	abstract unregisterExtension(): void;
}

export { Extension };
