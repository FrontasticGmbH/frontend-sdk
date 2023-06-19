import { IncomingMessage, ServerResponse } from "http";
import { deleteCookie, getCookie, setCookie } from "../cookieHandling";

const REMEMBER_ME = "__rememberMe";

export const rememberMeCookie = {
	get: function (): boolean {
		if (getCookie(REMEMBER_ME)) {
			return true;
		}
		return false;
	},
	set: function (rememberMe: boolean) {
		if (rememberMe) {
			return setCookie(REMEMBER_ME, "1");
		} else {
			this.remove();
		}
	},
	remove: function () {
		return deleteCookie(REMEMBER_ME);
	},
};

export const serverSession = {
	get: function (
		req: IncomingMessage,
		res: ServerResponse
	): string | undefined {
		return getCookie("frontastic-session", { req, res })?.toString();
	},
};
