import { SDK_NOT_CONFIGURED_ERROR_MESSAGE } from "../constants";
import { CookieManager } from "../types/cookieHandling/CookieManager";
import { RedactionManager } from "../types/redactionHandling";

class DependencyContainer {
	private _hasBeenConfigured: boolean;
	private _cookieHandler!: CookieManager;
	private _redactHandler!: RedactionManager;

	constructor() {
		this._hasBeenConfigured = false;
	}

	hasBeenConfigured(): boolean {
		return this._hasBeenConfigured;
	}

	cookieHandler(): CookieManager {
		return this._cookieHandler;
	}

	redactHandler(): RedactionManager {
		return this._redactHandler;
	}

	configure(config: {
		cookieHandler: CookieManager;
		redactHandler: RedactionManager;
	}) {
		this._hasBeenConfigured = true;
		this._cookieHandler = config.cookieHandler;
		this._redactHandler = config.redactHandler;
	}

	throwIfDINotConfigured = () => {
		if (!this._hasBeenConfigured) {
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
