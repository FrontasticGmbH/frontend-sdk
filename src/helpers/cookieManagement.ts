
const REMEMBER_ME = "__rememberMe";

export const rememberMeCookie = {
    get: function () {
        if (window) {
            return window.localStorage.getItem(REMEMBER_ME);
        }
    },
    set: function () {
        if (window) {
            window.localStorage.setItem(REMEMBER_ME, "1");
        }
    },
    remove: function () {
        if (window) {
            window.localStorage.removeItem(REMEMBER_ME);
        }
    }
}
