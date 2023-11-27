import { CookieManager } from "../types/cookieHandling/CookieManager";

class DIContainer {
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
}

class Wrapper {
	diContainer!: DIContainer;

	constructor() {
		this.diContainer = new DIContainer();
	}

	getDiContainer = () => this.diContainer;
}

const wrapper = new Wrapper();
const diContainer = wrapper.getDiContainer;

export { diContainer };
