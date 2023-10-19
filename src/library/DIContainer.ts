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
}

class Wrapper {
	diContainer!: DIContainer;

	getDiContainer = () => this.diContainer ?? new DIContainer();
}

const wrapper = new Wrapper();
const diContainer = wrapper.getDiContainer;

export { diContainer };
