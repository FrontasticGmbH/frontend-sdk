import { SDK } from "./SDK";
import { Events } from "../types/events/Events";
import { Integration } from "./Integration";
/**
 * The abstract base class signature to extend SDK integration classes.
 * @deprecated This class is deprecated and should not be used any more, extend the {@link Integration} class instead
 *
 * @param {Extension<CustomEvents>} CustomEvents - The generic argument defining any custom events on the integration.
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
}

export { Extension };
