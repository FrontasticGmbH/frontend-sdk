import { SDK } from "./SDK";

abstract class Extension {
	protected sdk: SDK;

	constructor(sdk: SDK) {
		this.sdk = sdk;
	}

	abstract unregisterExtension(): void;
}

export { Extension };
