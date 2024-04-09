import { SDK } from "./SDK";
import { Events } from "../types/events/Events";

/**
 * The abstract base class signature to extend SDK integration classes.
 *
 * @param {Integration<CustomEvents>} CustomEvents - The generic argument defining any custom events on the integration.
 */
abstract class Integration<CustomEvents extends Events> {
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
}

export { Integration };
