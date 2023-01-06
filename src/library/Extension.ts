import { SDK } from "./SDK";
import { Events } from "./types";

abstract class Extension<CustomEvents extends Events> {
	protected sdk: SDK<CustomEvents>;

	constructor(sdk: SDK<CustomEvents>) {
		this.sdk = sdk;
	}

	abstract unregisterExtension(): void;
}

export { Extension };
