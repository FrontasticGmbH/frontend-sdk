import { serialize, parse, CookieSerializeOptions } from "cookie";
import {
	ServerOptions,
	TmpCookiesObj,
	CookieValueTypes,
} from "../types/cookieHandling";
import { CookieManager } from "../types/cookieHandling/CookieManager";

export class CookieHandler implements CookieManager {
	isClientSide(): boolean {
		return typeof window !== "undefined";
	}

	stringify(value: string = ""): string {
		try {
			const result = JSON.stringify(value);
			return /^[\{\[]/.test(result) ? result : value;
		} catch (e) {
			return value;
		}
	}

	decode(str: string): string {
		return str ? str.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent) : str;
	}

	processValue(value: string): CookieValueTypes {
		switch (value) {
			case "true":
				return true;
			case "false":
				return false;
			case "undefined":
				return undefined;
			case "null":
				return null;
			default:
				return value;
		}
	}

	async getCookies(options?: ServerOptions): Promise<TmpCookiesObj> {
		let req;
		if (options) {
			req = options.req;
		}
		if (!this.isClientSide()) {
			// if cookie-parser is used in project, get cookies from ctx.req.cookies
			// if cookie-parser isn't used in project, get cookies from ctx.req.headers.cookie
			if (req?.cookies) {
				return req.cookies;
			}
			if (req?.headers?.cookie) {
				return parse(req.headers.cookie);
			}
			return {};
		}

		const _cookies: TmpCookiesObj = {};
		const documentCookies = document.cookie
			? document.cookie.split("; ")
			: [];

		for (let i = 0, len = documentCookies.length; i < len; i++) {
			const cookieParts = documentCookies[i].split("=");

			const _cookie = cookieParts.slice(1).join("=");
			const name = cookieParts[0];

			_cookies[name] = _cookie;
		}

		return _cookies;
	}

	async hasCookie(key: string, options?: ServerOptions): Promise<boolean> {
		if (!key) {
			return false;
		}

		const cookie = await this.getCookies(options);
		return cookie.hasOwnProperty(key);
	}

	async setCookie(
		key: string,
		data: any,
		options?: ServerOptions
	): Promise<void> {
		let _cookieOptions: CookieSerializeOptions = {
			secure: true,
		};
		let _req;
		let _res;
		if (options) {
			const { req, res, ..._options } = options;
			_req = req;
			_res = res;
			_cookieOptions = Object.assign({}, _options, _cookieOptions);
		}

		const cookieStr = serialize(key, this.stringify(data), {
			path: "/",
			..._cookieOptions,
		});
		if (!this.isClientSide()) {
			if (_res && _req) {
				let currentCookies = _res.getHeader("Set-Cookie");

				if (!Array.isArray(currentCookies)) {
					currentCookies = !currentCookies
						? []
						: [String(currentCookies)];
				}
				_res.setHeader("Set-Cookie", currentCookies.concat(cookieStr));

				if (_req && _req.cookies) {
					const _cookies = _req.cookies;
					data === ""
						? delete _cookies[key]
						: (_cookies[key] = this.stringify(data));
				}

				if (_req && _req.headers && _req.headers.cookie) {
					const _cookies = parse(_req.headers.cookie);

					data === ""
						? delete _cookies[key]
						: (_cookies[key] = this.stringify(data));

					_req.headers.cookie = Object.entries(_cookies).reduce(
						(accum, item) => {
							return accum.concat(`${item[0]}=${item[1]};`);
						},
						""
					);
				}
			}
		} else {
			document.cookie = cookieStr;
		}
	}

	async getCookie(
		key: string,
		options?: ServerOptions
	): Promise<CookieValueTypes> {
		const _cookies = await this.getCookies(options);
		const value = _cookies[key];

		if (value === undefined) {
			return undefined;
		}
		return this.processValue(this.decode(value));
	}

	async deleteCookie(key: string, options?: ServerOptions): Promise<void> {
		this.setCookie(key, "", { ...options, maxAge: -1 });
	}
}
