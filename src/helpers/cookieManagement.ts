
const REMEMBER_ME = "__rememberMe";

export const rememberMeCookie = {
    get: function () {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem(REMEMBER_ME);
        }
        return null;
    },
    set: function () {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(REMEMBER_ME, "1");
        }
    },
    remove: function () {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(REMEMBER_ME);
        }
    }
}
