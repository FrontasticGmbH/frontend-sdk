import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { fetcher } from "../../../src/helpers/fetcher";
import { CookieHandler } from "../../../src/cookieHandling";

const cookieHandler = new CookieHandler();
describe("fetcher", () => {
	let mockedTimestamp;

	beforeAll(() => {
		mockedTimestamp = 1673673600000;
		vi.spyOn(Date, "now").mockImplementation(() => mockedTimestamp);
		vi.spyOn(CookieHandler.prototype, "setCookie");
	});

	afterAll(() => {
		vi.resetAllMocks();
	});

	test("fetcher should set sessionLifetime when rememberMe is set to true with given param[sessionLifetime]", async () => {
		const cookieManagement = await import(
			"../../../src/helpers/cookieManagement"
		);

		cookieManagement.rememberMeCookie.get = vi.fn(() => true);

		const sessionLifetime = 890000000;

		await fetcher(
			"https://test-xyz.frontastic.dev",
			{
				method: "GET",
			},
			{},
			sessionLifetime
		);
		expect(cookieHandler.setCookie).toHaveBeenCalled();
		const newSessionLife = new Date(Date.now() + sessionLifetime);
		expect(cookieHandler.setCookie).toHaveBeenCalledWith(
			"frontastic-session",
			"SESSION",
			{
				expires: newSessionLife,
			}
		);
	});

	test("fetcher should not set sessionLifetime when rememberMe is set to false", async () => {
		const cookieManagement = await import(
			"../../../src/helpers/cookieManagement"
		);

		cookieManagement.rememberMeCookie.get = vi.fn(() => false);

		await fetcher(
			"https://test-xyz.frontastic.dev",
			{
				method: "GET",
			},
			{},
			890000000
		);
		expect(cookieHandler.setCookie).toHaveBeenCalled();

		expect(cookieHandler.setCookie).toHaveBeenCalledWith(
			"frontastic-session",
			"SESSION",
			{
				expires: undefined,
			}
		);
	});
});
