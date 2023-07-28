import { CookieManager } from "../interfaces/CookieManager";

export class DIContainer {
	hasBeenConfigured: boolean
	_cookieHandler!: CookieManager;
	constructor () {
		this.hasBeenConfigured = false
		this._cookieHandler = {} as unknown as CookieManager
	}
	get cookieHandler(): CookieManager {
		return this._cookieHandler;
	}
	set cookieHandler(cookierHandler: CookieManager) {
		this._cookieHandler = cookierHandler;
	}
}
const diContainer = new DIContainer();

export { diContainer };
