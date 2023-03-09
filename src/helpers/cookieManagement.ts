const REMEMBER_ME = "__rememberMe";

export const rememberMeCookie = {
	get: function (): boolean {
		if (typeof window !== "undefined") {
			if (window.localStorage.getItem(REMEMBER_ME)) {
				return true;
			}
		}
		return false;
	},
	set: function (rememberMe: boolean) {
		if (typeof window !== "undefined") {
			if (rememberMe) {
				window.localStorage.setItem(REMEMBER_ME, "1");
			}
			else {
				this.remove();
			}
		}
	},
	remove: function () {
		if (typeof window !== "undefined") {
			window.localStorage.removeItem(REMEMBER_ME);
		}
	},
};
