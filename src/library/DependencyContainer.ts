import { SDK_NOT_CONFIGURED_ERROR_MESSAGE } from "../constants";
import { CookieManager } from "../types/cookieHandling/CookieManager";

class DependencyContainer {
	hasBeenConfigured: boolean;
	private _cookieHandler!: CookieManager;

	constructor() {
		this.hasBeenConfigured = false;
	}

	get cookieHandler(): CookieManager {
		return this._cookieHandler;
	}

	set cookieHandler(cookierHandler: CookieManager) {
		this._cookieHandler = cookierHandler;
	}

	configure(cookieHandler: CookieManager) {
		this.hasBeenConfigured = true;
		this.cookieHandler = cookieHandler;
	}

	throwIfDINotConfigured = () => {
		if (!this.hasBeenConfigured) {
			throw new Error(SDK_NOT_CONFIGURED_ERROR_MESSAGE);
		}
	};
}

class Wrapper {
	dependencyContainer!: DependencyContainer;

	constructor() {
		this.dependencyContainer = new DependencyContainer();
	}

	getDependencyContainer = () => this.dependencyContainer;
}

const wrapper = new Wrapper();
const dependencyContainer = wrapper.getDependencyContainer;

export { dependencyContainer };
