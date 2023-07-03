import { CookieManager } from "../interfaces";

export class DIContainer {
	get cookieHandler(): CookieManager {
		return this.cookieHandler;
	}
	set cookieHandler(cookierHandler: CookieManager) {
		this.cookieHandler = cookierHandler;
	}
}
const diContainer = new DIContainer();
export default diContainer;
